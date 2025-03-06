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
     * 用户登录
     * @param {Object} credentials 登录凭证
     * @returns {Promise} 登录结果
     */
    login: (credentials) => {
      return httpClient.post("/auth/login", credentials);
    },

    /**
     * 用户注册
     * @param {Object} userData 用户数据
     * @returns {Promise} 注册结果
     */
    register: (userData) => {
      return httpClient.post("/auth/register", userData);
    },

    /**
     * 获取用户信息
     * @param {string} userId 用户ID
     * @returns {Promise} 用户信息
     */
    getUserInfo: (userId) => {
      return httpClient.get(`/users/${userId}`);
    },

    /**
     * 更新用户信息
     * @param {string} userId 用户ID
     * @param {Object} userData 用户数据
     * @returns {Promise} 更新结果
     */
    updateUserInfo: (userId, userData) => {
      return httpClient.put(`/users/${userId}`, userData);
    },

    /**
     * 获取所有用户
     * @returns {Promise} 返回包含所有用户的列表，每个用户包含id、name和phone字段
     */
    getUsers: () => {
      return httpClient.get("/api/users");
    },

    /**
     * 创建新用户
     * @param {Object} userData 用户数据，包含name和phone字段
     * @returns {Promise} 创建结果
     */
    createUser: (userData) => {
      return httpClient.post("/api/users", userData);
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
