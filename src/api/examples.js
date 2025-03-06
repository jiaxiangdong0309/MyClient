/**
 * API 使用示例
 */
import { ref, reactive } from "vue";
import api, {
  apiService,
  get,
  post,
  cancelRequest,
  createServices,
} from "./index";

/**
 * 基本使用示例
 */
export const basicUsageExample = async () => {
  try {
    // 使用基本方法
    const users = await get("/users", { page: 1, limit: 10 });
    console.log("用户列表:", users);

    // 使用 POST 方法
    const newUser = await post("/users", {
      name: "张三",
      email: "zhangsan@example.com",
    });
    console.log("新用户:", newUser);

    // 使用服务
    const userInfo = await apiService.user.getUserInfo("123");
    console.log("用户信息:", userInfo);

    // 使用产品服务
    const products = await apiService.product.getProducts({
      category: "electronics",
    });
    console.log("产品列表:", products);
  } catch (error) {
    console.error("请求错误:", error);
  }
};

/**
 * 取消请求示例
 */
export const cancelRequestExample = async () => {
  // 发送请求
  const requestPromise = get(
    "/users",
    { page: 1 },
    {
      requestId: "get-users",
    }
  );

  // 取消请求
  cancelRequest("get-users");

  try {
    await requestPromise;
  } catch (error) {
    console.log("请求已取消:", error.message);
  }
};

/**
 * 上传文件示例
 */
export const uploadFileExample = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const result = await api.upload("/upload", formData, {}, (progress) => {
      console.log(`上传进度: ${progress}%`);
    });

    console.log("上传成功:", result);
    return result;
  } catch (error) {
    console.error("上传失败:", error);
    throw error;
  }
};

/**
 * 在 Vue 组件中使用的示例
 */
export const useUserApi = () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 获取用户列表
  const fetchUsers = async (params = { page: 1, limit: 10 }) => {
    loading.value = true;
    error.value = null;

    try {
      users.value = await apiService.user.getUsers(params);
    } catch (err) {
      error.value = err;
      users.value = [];
    } finally {
      loading.value = false;
    }
  };

  // 创建用户
  const createUser = async (userData) => {
    loading.value = true;
    error.value = null;

    try {
      const newUser = await apiService.user.register(userData);
      users.value = [...users.value, newUser];
      return newUser;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
  };
};

/**
 * 使用自定义配置创建实例
 */
export const createCustomApiExample = () => {
  // 创建自定义 HTTP 客户端
  const customHttp = api.createHttpClient({
    baseURL: "https://custom-api.example.com",
    timeout: 5000,
    headers: {
      "X-Custom-Header": "CustomValue",
    },
  });

  // 创建自定义服务
  const customServices = createServices(customHttp);

  return {
    customHttp,
    customServices,
  };
};
