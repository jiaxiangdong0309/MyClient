<template>
  <div class="user-list">
    <!-- 添加用户表单 -->
    <div class="add-user">
      <form @submit.prevent="submitUser">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="newUser.username"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">手机号</label>
          <input id="phone" v-model="newUser.phone" type="text" required />
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="submitting">
            {{ submitting ? "提交中..." : "添加用户" }}
          </button>
        </div>
      </form>
    </div>
    <div class="list-header">
      <div class="user-list-title">当前用户列表</div>
      <button
        class="refresh-btn"
        @click="fetchUsers(currentPage)"
        :disabled="loading"
      >
        {{ loading ? "刷新中..." : "刷新" }}
      </button>
    </div>
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">
      <p>加载失败: {{ error.message }}</p>
      <button @click="fetchUsers">重试</button>
    </div>

    <!-- 用户列表 -->
    <div v-if="!loading && !error" class="users">
      <div v-if="users.length === 0" class="empty">
        暂无用户数据 ({{ loading ? "加载中" : "空列表" }})
      </div>

      <ul v-else>
        <li
          v-for="(user, index) in users"
          :key="user.id || index"
          class="user-item"
        >
          <div class="user-info">
            <h3>{{ user.username }}</h3>
            <p>{{ user.phone }}</p>
          </div>
          <div class="user-actions">
            <button @click="viewUser(user.id)">查看</button>
            <button @click="editUser(user.id)">编辑</button>
            <button @click="deleteUser(user.id)" class="delete">删除</button>
          </div>
        </li>
      </ul>

      <!-- 分页 -->
      <div class="pagination">
        <button
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from "vue";
import { apiService, cancelRequest } from "../api";

export default {
  name: "UserList",

  setup() {
    // 状态
    const users = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const submitting = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = 10;

    // 新用户表单
    const newUser = reactive({
      username: "",
      phone: "",
    });

    // 获取用户列表
    const fetchUsers = async (page = 1) => {
      loading.value = true;
      error.value = null;

      try {
        const result = await apiService.user.getUsers(
          {
            page,
            limit: pageSize,
            _t: Date.now(),
          },
          {
            cache: {
              enable: false,
            },
            requestId: `getUsers_${Date.now()}`,
          }
        );

        if (!result) {
          console.warn("API返回结果为空");
          return;
        }

        // 确保 result 是数组
        if (Array.isArray(result)) {
          users.value = [...result];
        } else if (result && Array.isArray(result.data)) {
          users.value = [...result.data];
          totalPages.value = Math.ceil((result.total || 0) / pageSize);
        } else {
          console.error("返回的数据格式不正确:", result);
          users.value = [];
        }

        currentPage.value = page;
      } catch (err) {
        console.error("获取用户列表失败:", err);
        if (err.type !== "CANCEL_ERROR") {
          error.value = err;
        }
      } finally {
        loading.value = false;
      }
    };

    // 切换页码
    const changePage = (page) => {
      // 取消之前的请求
      cancelRequest("fetch-users");
      fetchUsers(page);
    };

    // 查看用户
    const viewUser = async (userId) => {
      try {
        const userDetail = await apiService.user.getUserInfo(userId);
        alert(`用户详情: ${JSON.stringify(userDetail)}`);
      } catch (err) {
        alert(`获取用户详情失败: ${err.message}`);
      }
    };

    // 编辑用户
    const editUser = (userId) => {
      alert(`编辑用户: ${userId}`);
      // 实际应用中可能会打开编辑表单或导航到编辑页面
    };

    // 删除用户
    const deleteUser = async (userId) => {
      if (!confirm("确定要删除此用户吗？")) {
        return;
      }

      try {
        await apiService.user.deleteUser(userId);
        // 删除成功后刷新列表
        fetchUsers(currentPage.value);
      } catch (err) {
        alert(`删除失败: ${err.message}`);
      }
    };

    // 提交新用户
    const submitUser = async () => {
      submitting.value = true;

      try {
        const result = await apiService.user.createUser(newUser);

        // 重置表单
        newUser.username = "";
        newUser.phone = "";

        // 延迟500ms后刷新用户列表
        await new Promise((resolve) => setTimeout(resolve, 500));
        await fetchUsers(currentPage.value);

        alert("用户添加成功！");
      } catch (err) {
        console.error("添加用户失败:", err);
        alert(`添加用户失败: ${err.message}`);
      } finally {
        submitting.value = false;
      }
    };

    // 组件挂载时获取用户列表
    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      loading,
      error,
      submitting,
      currentPage,
      totalPages,
      newUser,
      fetchUsers,
      changePage,
      viewUser,
      editUser,
      deleteUser,
      submitUser,
    };
  },
};
</script>

<style scoped>
.user-list {
  margin: 0 auto;
  padding: 0px;
}

.user-list-title {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid #eee;
}

.loading,
.error,
.empty {
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  border-radius: 4px;
}

.loading {
  background-color: #f5f5f5;
}

.error {
  background-color: #ffebee;
  color: #d32f2f;
}

.users ul {
  list-style: none;
  padding: 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.user-info h3 {
  margin: 0 0 5px 0;
}

.user-info p {
  margin: 0;
  color: #666;
}

.user-actions button {
  margin-left: 8px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #e0e0e0;
  cursor: pointer;
}

.user-actions button.delete {
  background-color: #ffcdd2;
  color: #c62828;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 15px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  background-color: #e0e0e0;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-user {
  padding: 0px;
}

.add-user form {
  display: flex;
  align-items: center;
  gap: 20px;
}

.form-group {
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  width: auto;
}

.form-group input {
  width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  margin-top: 0;
  display: flex;
  align-items: flex-end;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

.form-actions button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.refresh-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  background-color: #e0e0e0;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
