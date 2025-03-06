/**
 * API 服务模块导出
 */
import userService, { createUserService } from "./userService";
import productService, { createProductService } from "./productService";
import http from "../http";

/**
 * 创建所有服务
 * @param {Object} httpClient HTTP客户端实例
 * @returns {Object} 所有服务对象
 */
export const createServices = (httpClient = http) => {
  return {
    user: createUserService(httpClient),
    product: createProductService(httpClient),
  };
};

// 导出默认服务实例
export const services = {
  user: userService,
  product: productService,
};

// 导出服务创建函数
export { createUserService, createProductService };

// 默认导出所有服务
export default services;
