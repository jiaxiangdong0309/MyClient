/**
 * 用户服务模块
 */
import http from "../api/http";

/**
 * 创建用户服务
 * @param {Object} httpClient HTTP客户端实例
 * @returns {Object} 用户服务对象
 */
export const createUserService = (httpClient = http) => {
  return {
    /**
     * 获取所有用户
     * @param {Object} params 查询参数
     * @param {Object} config 请求配置
     * @returns {Promise} 返回包含所有用户的列表，每个用户包含id、name和phone字段
     */
    getUsers: (params = {}, config = {}) => {
      return httpClient.get("/users", "", {
        // 添加特定的重试配置
        // retry: {
        //   maxRetries: 3,
        //   retryDelay: 2000,
        //   retryStatusCodes: [408, 429, 500, 502, 503, 504],
        // },
        ...config,
      });
    },

    /**
     * 创建新用户
     * @param {Object} userData 用户数据，包含name和phone字段
     * @returns {Promise} 创建结果
     */
    createUser: (userData) => {
      return httpClient.post("/users", userData);
    },

    /**
     * 删除用户
     * @param {string} userId 用户ID
     * @returns {Promise} 删除结果
     */
    deleteUser: (userId) => {
      return httpClient.del(`/users/${userId}`);
    },
  };
};

// 创建默认用户服务实例
const userService = createUserService();

// 导出默认实例
export default userService;
