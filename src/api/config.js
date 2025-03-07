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
  // 开发环境使用相对路径，通过代理转发请求
  [ENV.DEV]: "/api",
  [ENV.TEST]: "https://myserver-egzl.onrender.com/api",
  [ENV.PROD]: "https://myserver-egzl.onrender.com/api",
};

// 导出配置
export const API_CONFIG = {
  // 基础URL
  baseURL: BASE_URLS[currentEnv],

  // 超时时间 (ms) - 增加到30秒，因为Render免费版可能启动较慢
  timeout: 30000,

  // 请求头
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // 重试配置
  retry: {
    maxRetries: 3,
    retryDelay: 2000, // 增加重试延迟
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
  },

  // 缓存配置
  cache: {
    enable: false, // 默认关闭缓存
    maxAge: 5 * 60 * 1000, // 减少缓存时间到5分钟
    exclude: [
      "/auth/login",
      "/auth/logout",
      "/auth/register",
      "/users", // 添加用户列表接口
      "/users/", // 添加用户相关接口
      "/api/users", // 添加带前缀的用户接口
    ],
  },

  // 是否启用请求/响应日志
  enableLog: true, // 始终启用日志以便调试
};

// 导出当前环境
export const CURRENT_ENV = currentEnv;

// 导出环境常量
export const ENVIRONMENTS = ENV;
