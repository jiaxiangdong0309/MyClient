/**
 * HTTP 客户端封装
 */
import axios from "axios";
import { API_CONFIG } from "./config";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";
import { fetchWithCorsProxy } from "../utils/corsProxy";

// 创建取消令牌源映射
const cancelTokenSources = new Map();

/**
 * 创建 Axios 实例
 * @param {Object} config 配置
 * @returns {Object} Axios 实例
 */
export const createHttpClient = (config = {}) => {
  // 合并默认配置
  const axiosConfig = {
    ...API_CONFIG,
    ...config,
  };

  // 创建实例
  const instance = axios.create(axiosConfig);

  // 设置拦截器
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);

  return instance;
};

// 创建默认实例
const http = createHttpClient();

/**
 * 生成请求ID
 * @param {Object} config 请求配置
 * @returns {string} 请求ID
 */
const generateRequestId = (config) => {
  const { url, method, params, data } = config;
  return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(
    data || {}
  )}`;
};

/**
 * 添加取消令牌
 * @param {Object} config 请求配置
 * @returns {Object} 更新后的配置
 */
const addCancelToken = (config) => {
  // 生成请求ID
  const requestId = config.requestId || generateRequestId(config);

  // 如果已存在相同请求，则取消之前的请求
  if (cancelTokenSources.has(requestId)) {
    const source = cancelTokenSources.get(requestId);
    source.cancel(`请求被取消: ${requestId}`);
    cancelTokenSources.delete(requestId);
  }

  // 创建新的取消令牌源
  const source = axios.CancelToken.source();
  cancelTokenSources.set(requestId, source);

  // 添加取消令牌和请求ID
  return {
    ...config,
    cancelToken: source.token,
    requestId,
  };
};

/**
 * 移除取消令牌
 * @param {string} requestId 请求ID
 */
const removeCancelToken = (requestId) => {
  if (cancelTokenSources.has(requestId)) {
    cancelTokenSources.delete(requestId);
  }
};

/**
 * 取消请求
 * @param {string} requestId 请求ID，如果不提供则取消所有请求
 */
export const cancelRequest = (requestId) => {
  if (requestId) {
    if (cancelTokenSources.has(requestId)) {
      const source = cancelTokenSources.get(requestId);
      source.cancel(`请求被取消: ${requestId}`);
      cancelTokenSources.delete(requestId);
    }
  } else {
    // 取消所有请求
    for (const [id, source] of cancelTokenSources.entries()) {
      source.cancel(`所有请求被取消`);
      cancelTokenSources.delete(id);
    }
  }
};

/**
 * 发送请求
 * @param {Object} config 请求配置
 * @returns {Promise} 请求Promise
 */
export const request = async (config) => {
  // 添加取消令牌
  const configWithToken = addCancelToken(config);

  try {
    // 检查是否需要使用 CORS 代理
    if (
      configWithToken.headers &&
      configWithToken.headers["X-Need-CORS-Proxy"] === "true"
    ) {
      // 删除标记头
      delete configWithToken.headers["X-Need-CORS-Proxy"];

      // 构建完整 URL
      const fullUrl = configWithToken.baseURL
        ? `${configWithToken.baseURL}${configWithToken.url}`
        : configWithToken.url;

      // 转换 Axios 配置为 fetch 选项
      const fetchOptions = {
        method: configWithToken.method.toUpperCase(),
        headers: configWithToken.headers,
        body: configWithToken.data
          ? JSON.stringify(configWithToken.data)
          : undefined,
      };

      // 使用 CORS 代理发送请求
      const response = await fetchWithCorsProxy(fullUrl, fetchOptions);
      const data = await response.json();

      // 移除取消令牌
      removeCancelToken(configWithToken.requestId);

      // 返回数据
      return data;
    }

    // 正常发送请求
    const response = await http(configWithToken);
    removeCancelToken(configWithToken.requestId);
    // 直接返回响应数据，因为拦截器已经处理了标准响应格式
    return response;
  } catch (error) {
    removeCancelToken(configWithToken.requestId);
    throw error;
  }
};

/**
 * GET 请求
 * @param {string} url 请求URL
 * @param {Object} params 查询参数
 * @param {Object} config 其他配置
 * @returns {Promise} 请求Promise
 */
export const get = (url, params = {}, config = {}) => {
  return request({
    method: "get",
    url,
    params,
    ...config,
  });
};

/**
 * POST 请求
 * @param {string} url 请求URL
 * @param {Object} data 请求数据
 * @param {Object} config 其他配置
 * @returns {Promise} 请求Promise
 */
export const post = (url, data = {}, config = {}) => {
  return request({
    method: "post",
    url,
    data,
    ...config,
  });
};

/**
 * PUT 请求
 * @param {string} url 请求URL
 * @param {Object} data 请求数据
 * @param {Object} config 其他配置
 * @returns {Promise} 请求Promise
 */
export const put = (url, data = {}, config = {}) => {
  return request({
    method: "put",
    url,
    data,
    ...config,
  });
};

/**
 * DELETE 请求
 * @param {string} url 请求URL
 * @param {Object} params 查询参数
 * @param {Object} config 其他配置
 * @returns {Promise} 请求Promise
 */
export const del = (url, params = {}, config = {}) => {
  return request({
    method: "delete",
    url,
    params,
    ...config,
  });
};

/**
 * PATCH 请求
 * @param {string} url 请求URL
 * @param {Object} data 请求数据
 * @param {Object} config 其他配置
 * @returns {Promise} 请求Promise
 */
export const patch = (url, data = {}, config = {}) => {
  return request({
    method: "patch",
    url,
    data,
    ...config,
  });
};

/**
 * 上传文件
 * @param {string} url 请求URL
 * @param {FormData} formData 表单数据
 * @param {Object} config 其他配置
 * @param {Function} onProgress 进度回调
 * @returns {Promise} 请求Promise
 */
export const upload = (url, formData, config = {}, onProgress) => {
  return request({
    method: "post",
    url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress
      ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted, progressEvent);
        }
      : undefined,
    ...config,
  });
};

/**
 * 下载文件
 * @param {string} url 请求URL
 * @param {Object} params 查询参数
 * @param {Object} config 其他配置
 * @param {Function} onProgress 进度回调
 * @returns {Promise} 请求Promise
 */
export const download = (url, params = {}, config = {}, onProgress) => {
  return request({
    method: "get",
    url,
    params,
    responseType: "blob",
    onDownloadProgress: onProgress
      ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted, progressEvent);
        }
      : undefined,
    ...config,
  });
};

// 导出默认实例
export default {
  request,
  get,
  post,
  put,
  del,
  patch,
  upload,
  download,
  cancelRequest,
  createHttpClient,
};
