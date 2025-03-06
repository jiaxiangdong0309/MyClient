/**
 * API 请求配置
 */

// 环境变量
const ENV = {
  DEV: "development",
  TEST: "test",
  PROD: "production",
};

// 当前环境
const currentEnv = process.env.NODE_ENV || ENV.DEV;

// 不同环境的基础URL
const BASE_URLS = {
  [ENV.DEV]: "http://localhost:3000/api",
  [ENV.TEST]: "http://test-api.example.com/api",
  [ENV.PROD]: "https://api.example.com/api",
};

// 导出配置
export const API_CONFIG = {
  // 基础URL
  baseURL: BASE_URLS[currentEnv],

  // 超时时间 (ms)
  timeout: 10000,

  // 请求头
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // 重试配置
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
  },

  // 缓存配置
  cache: {
    enable: true,
    maxAge: 10 * 60 * 1000, // 10分钟
    exclude: ["/auth/login", "/auth/logout"],
  },

  // 是否启用请求/响应日志
  enableLog: currentEnv !== ENV.PROD,
};

// 导出当前环境
export const CURRENT_ENV = currentEnv;

// 导出环境常量
export const ENVIRONMENTS = ENV;
