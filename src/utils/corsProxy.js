/**
 * CORS 代理工具
 *
 * 如果直接请求后端 API 遇到跨域问题，可以使用此工具通过公共 CORS 代理服务发送请求
 */

// 公共 CORS 代理服务列表
const CORS_PROXIES = [
  "https://cors-anywhere.herokuapp.com/",
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

/**
 * 通过 CORS 代理发送请求
 * @param {string} url 原始 URL
 * @param {Object} options 请求选项
 * @param {number} proxyIndex 代理索引，默认为 0
 * @returns {Promise} 请求 Promise
 */
export const fetchWithCorsProxy = async (url, options = {}, proxyIndex = 0) => {
  // 确保 proxyIndex 在有效范围内
  const safeProxyIndex = proxyIndex % CORS_PROXIES.length;
  const proxy = CORS_PROXIES[safeProxyIndex];

  try {
    // 构建代理 URL
    const proxyUrl = `${proxy}${encodeURIComponent(url)}`;

    // 发送请求
    const response = await fetch(proxyUrl, options);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    // 如果当前代理失败，尝试下一个代理
    if (proxyIndex < CORS_PROXIES.length - 1) {
      console.warn(`CORS proxy ${proxy} failed, trying next proxy...`);
      return fetchWithCorsProxy(url, options, proxyIndex + 1);
    }

    // 所有代理都失败，抛出错误
    throw new Error(`All CORS proxies failed: ${error.message}`);
  }
};

/**
 * 检测是否需要使用 CORS 代理
 * @param {string} apiUrl API URL
 * @returns {boolean} 是否需要使用代理
 */
export const shouldUseCorsProxy = (apiUrl) => {
  // 如果是相对 URL，不需要代理
  if (apiUrl.startsWith("/")) {
    return false;
  }

  try {
    // 解析 URL
    const apiUrlObj = new URL(apiUrl);
    const currentUrlObj = new URL(window.location.href);

    // 如果域名相同，不需要代理
    return apiUrlObj.hostname !== currentUrlObj.hostname;
  } catch (error) {
    // URL 解析错误，默认不使用代理
    return false;
  }
};

export default {
  fetchWithCorsProxy,
  shouldUseCorsProxy,
};
