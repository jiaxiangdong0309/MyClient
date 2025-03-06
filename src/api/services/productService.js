/**
 * 产品服务模块
 */
import http from "../http";

/**
 * 创建产品服务
 * @param {Object} httpClient HTTP客户端实例
 * @returns {Object} 产品服务对象
 */
export const createProductService = (httpClient = http) => {
  return {
    /**
     * 获取产品列表
     * @param {Object} params 查询参数
     * @returns {Promise} 产品列表
     */
    getProducts: (params) => {
      return httpClient.get("/products", params);
    },

    /**
     * 获取产品详情
     * @param {string} productId 产品ID
     * @returns {Promise} 产品详情
     */
    getProductDetail: (productId) => {
      return httpClient.get(`/products/${productId}`);
    },

    /**
     * 创建产品
     * @param {Object} productData 产品数据
     * @returns {Promise} 创建结果
     */
    createProduct: (productData) => {
      return httpClient.post("/products", productData);
    },

    /**
     * 更新产品
     * @param {string} productId 产品ID
     * @param {Object} productData 产品数据
     * @returns {Promise} 更新结果
     */
    updateProduct: (productId, productData) => {
      return httpClient.put(`/products/${productId}`, productData);
    },

    /**
     * 删除产品
     * @param {string} productId 产品ID
     * @returns {Promise} 删除结果
     */
    deleteProduct: (productId) => {
      return httpClient.del(`/products/${productId}`);
    },

    /**
     * 获取产品分类
     * @returns {Promise} 产品分类列表
     */
    getCategories: () => {
      return httpClient.get("/products/categories");
    },

    /**
     * 获取产品评论
     * @param {string} productId 产品ID
     * @param {Object} params 查询参数
     * @returns {Promise} 产品评论列表
     */
    getProductReviews: (productId, params) => {
      return httpClient.get(`/products/${productId}/reviews`, params);
    },
  };
};

// 创建默认产品服务实例
const productService = createProductService();

// 导出默认实例
export default productService;
