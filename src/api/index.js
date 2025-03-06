/**
 * API 模块导出
 */
import http, {
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
} from "./http";
import { clearCache } from "./interceptors";
import { API_CONFIG, CURRENT_ENV, ENVIRONMENTS } from "./config";
import { handleApiError, ERROR_TYPES } from "./errorHandler";
import services, {
  createUserService,
  createProductService,
  createServices,
} from "../services";

// 导出API服务
export const apiService = services;

// 导出HTTP方法
export {
  // HTTP方法
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

  // 缓存相关
  clearCache,

  // 服务创建函数
  createUserService,
  createProductService,
  createServices,

  // 错误处理
  handleApiError,
  ERROR_TYPES,

  // 配置
  API_CONFIG,
  CURRENT_ENV,
  ENVIRONMENTS,
};

// 默认导出
export default {
  // 服务
  service: apiService,

  // HTTP客户端
  http,

  // 配置
  config: API_CONFIG,
  env: CURRENT_ENV,
  environments: ENVIRONMENTS,

  // 错误类型
  errorTypes: ERROR_TYPES,
};
