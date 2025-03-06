/**
 * API 错误处理模块
 */
import { CURRENT_ENV, ENVIRONMENTS } from "./config";

// 错误类型
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT_ERROR",
  AUTH: "AUTH_ERROR",
  SERVER: "SERVER_ERROR",
  CLIENT: "CLIENT_ERROR",
  CANCEL: "CANCEL_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

/**
 * 错误码映射表
 */
const ERROR_CODE_MAP = {
  // 认证错误
  401: ERROR_TYPES.AUTH,
  403: ERROR_TYPES.AUTH,

  // 客户端错误
  400: ERROR_TYPES.CLIENT,
  404: ERROR_TYPES.CLIENT,
  405: ERROR_TYPES.CLIENT,
  422: ERROR_TYPES.CLIENT,

  // 服务器错误
  500: ERROR_TYPES.SERVER,
  502: ERROR_TYPES.SERVER,
  503: ERROR_TYPES.SERVER,
  504: ERROR_TYPES.SERVER,
};

/**
 * 获取错误类型
 * @param {Error} error Axios错误对象
 * @returns {string} 错误类型
 */
export const getErrorType = (error) => {
  if (error.response) {
    // 服务器返回了错误状态码
    const statusCode = error.response.status;
    return ERROR_CODE_MAP[statusCode] || ERROR_TYPES.UNKNOWN;
  } else if (error.request) {
    // 请求已发送但没有收到响应
    if (error.code === "ECONNABORTED") {
      return ERROR_TYPES.TIMEOUT;
    }
    return ERROR_TYPES.NETWORK;
  } else if (error.__CANCEL__) {
    // 请求被取消
    return ERROR_TYPES.CANCEL;
  }

  // 其他错误
  return ERROR_TYPES.UNKNOWN;
};

/**
 * 格式化错误信息
 * @param {Error} error Axios错误对象
 * @returns {Object} 格式化后的错误对象
 */
export const formatError = (error) => {
  const errorType = getErrorType(error);
  const baseError = {
    type: errorType,
    message: error.message || "未知错误",
    timestamp: new Date().toISOString(),
  };

  // 根据错误类型添加额外信息
  if (error.response) {
    return {
      ...baseError,
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      url: error.config.url,
      method: error.config.method.toUpperCase(),
    };
  } else if (error.request) {
    return {
      ...baseError,
      url: error.config.url,
      method: error.config.method.toUpperCase(),
    };
  }

  return baseError;
};

/**
 * 错误处理函数
 * @param {Error} error Axios错误对象
 * @returns {Object} 处理后的错误对象
 */
export const handleApiError = (error) => {
  const formattedError = formatError(error);

  // 在开发环境下打印错误信息
  if (CURRENT_ENV !== ENVIRONMENTS.PROD) {
    console.error("[API Error]", formattedError);
  }

  // 根据错误类型执行不同操作
  switch (formattedError.type) {
    case ERROR_TYPES.AUTH:
      // 处理认证错误，例如跳转到登录页
      // window.location.href = '/login';
      break;

    case ERROR_TYPES.NETWORK:
      // 处理网络错误，例如显示网络连接提示
      break;

    case ERROR_TYPES.TIMEOUT:
      // 处理超时错误
      break;

    case ERROR_TYPES.SERVER:
      // 处理服务器错误
      break;

    default:
      // 处理其他错误
      break;
  }

  return formattedError;
};

/**
 * 判断错误是否可以重试
 * @param {Error} error Axios错误对象
 * @param {Array<number>} retryStatusCodes 可重试的状态码
 * @returns {boolean} 是否可以重试
 */
export const isRetryable = (error, retryStatusCodes = []) => {
  // 网络错误或超时错误可以重试
  if (!error.response) {
    return true;
  }

  // 根据状态码判断是否可以重试
  return retryStatusCodes.includes(error.response.status);
};
