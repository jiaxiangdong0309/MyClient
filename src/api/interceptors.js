/**
 * API 拦截器模块
 */
import axios from "axios";
import { handleApiError, isRetryable } from "./errorHandler";
import { API_CONFIG } from "./config";

// 简单的内存缓存
const apiCache = new Map();

/**
 * 生成缓存键
 * @param {Object} config 请求配置
 * @returns {string} 缓存键
 */
const generateCacheKey = (config) => {
  const { url, method, params, data } = config;
  return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(
    data || {}
  )}`;
};

/**
 * 检查缓存是否有效
 * @param {string} key 缓存键
 * @returns {Object|null} 缓存数据或null
 */
const getCache = (key) => {
  if (!apiCache.has(key)) {
    return null;
  }

  const { data, expiry } = apiCache.get(key);
  if (expiry < Date.now()) {
    apiCache.delete(key);
    return null;
  }

  return data;
};

/**
 * 设置缓存
 * @param {string} key 缓存键
 * @param {Object} data 响应数据
 * @param {number} maxAge 缓存有效期(ms)
 */
const setCache = (key, data, maxAge) => {
  apiCache.set(key, {
    data,
    expiry: Date.now() + maxAge,
  });
};

/**
 * 清除缓存
 * @param {string|RegExp} pattern 匹配模式
 */
export const clearCache = (pattern) => {
  if (!pattern) {
    apiCache.clear();
    return;
  }

  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  for (const key of apiCache.keys()) {
    if (regex.test(key)) {
      apiCache.delete(key);
    }
  }
};

/**
 * 请求拦截器
 * @param {Object} instance Axios实例
 */
export const setupRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      // 添加时间戳，用于计算请求耗时
      config.metadata = { startTime: new Date() };

      // 从本地存储获取token
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 检查是否启用缓存
      if (
        config.cache?.enable ||
        (API_CONFIG.cache.enable &&
          !API_CONFIG.cache.exclude.includes(config.url))
      ) {
        const cacheKey = generateCacheKey(config);
        const cachedData = getCache(cacheKey);

        if (cachedData) {
          // 使用缓存数据
          config.adapter = () => {
            return Promise.resolve({
              data: cachedData,
              status: 200,
              statusText: "OK",
              headers: {},
              config,
              request: {},
              __fromCache: true,
            });
          };
        }

        // 保存缓存键，用于响应拦截器中缓存数据
        config.__cacheKey = cacheKey;
      }

      // 记录请求日志
      if (API_CONFIG.enableLog) {
        console.log(
          `[API Request] ${config.method.toUpperCase()} ${config.url}`,
          {
            params: config.params,
            data: config.data,
          }
        );
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

/**
 * 响应拦截器
 * @param {Object} instance Axios实例
 */
export const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => {
      // 计算请求耗时
      const { config } = response;
      if (config.metadata) {
        const endTime = new Date();
        const duration = endTime - config.metadata.startTime;
        response.duration = duration;

        // 记录响应日志
        if (API_CONFIG.enableLog && !response.__fromCache) {
          console.log(
            `[API Response] ${config.method.toUpperCase()} ${
              config.url
            } (${duration}ms)`,
            response.data
          );
        }
      }

      // 缓存响应数据
      if (config.__cacheKey && !response.__fromCache) {
        const maxAge = config.cache?.maxAge || API_CONFIG.cache.maxAge;
        setCache(config.__cacheKey, response.data, maxAge);
      }

      return response;
    },
    async (error) => {
      // 获取配置和重试次数
      const { config } = error;
      if (!config) {
        return Promise.reject(error);
      }

      // 初始化重试次数
      config.__retryCount = config.__retryCount || 0;

      // 检查是否可以重试
      const retryConfig = config.retry || API_CONFIG.retry;
      const { maxRetries, retryDelay, retryStatusCodes } = retryConfig;

      if (
        config.__retryCount < maxRetries &&
        isRetryable(error, retryStatusCodes)
      ) {
        // 增加重试次数
        config.__retryCount += 1;

        // 计算延迟时间 (可以使用指数退避策略)
        const delay = retryDelay * Math.pow(2, config.__retryCount - 1);

        // 记录重试日志
        if (API_CONFIG.enableLog) {
          console.log(
            `[API Retry] ${config.method.toUpperCase()} ${
              config.url
            } - Attempt ${config.__retryCount}/${maxRetries} after ${delay}ms`
          );
        }

        // 延迟后重试
        await new Promise((resolve) => setTimeout(resolve, delay));
        return instance(config);
      }

      // 处理错误
      return Promise.reject(handleApiError(error));
    }
  );
};
