<template>
  <a-config-provider :locale="zhCN">
    <div class="app-container">
      <a-layout style="min-height: 100vh">
        <!-- 侧边栏 -->
        <a-layout-sider
          v-model:collapsed="appStore.collapsed"
          collapsible
          :trigger="null"
          :theme="appStore.theme"
        >
          <div class="logo">
            <img
              src="./assets/logo.png"
              alt="Logo"
              v-if="!appStore.collapsed"
            />
            <img src="./assets/logo-small.png" alt="Logo" v-else />
          </div>
          <a-menu
            v-model:selectedKeys="selectedKeys"
            :theme="appStore.theme"
            mode="inline"
          >
            <a-menu-item
              v-for="item in menuConfig"
              :key="item.key"
              @click="navigateTo(item.key)"
            >
              <template #icon>
                <component :is="item.icon"></component>
              </template>
              <span>{{ item.title }}</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>

        <a-layout>
          <!-- 头部 -->
          <a-layout-header class="header" :theme="appStore.theme">
            <div class="header-left">
              <a-button
                type="text"
                @click="appStore.toggleCollapsed"
                class="trigger-btn"
              >
                <menu-unfold-outlined v-if="appStore.collapsed" />
                <menu-fold-outlined v-else />
              </a-button>
              <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>{{
                  getCurrentPageTitle()
                }}</a-breadcrumb-item>
              </a-breadcrumb>
            </div>
          </a-layout-header>

          <!-- 内容区 -->
          <a-layout-content class="content">
            <div class="content-wrapper">
              <!-- 路由视图 -->
              <router-view v-slot="{ Component, route }">
                <a-card :title="route.meta.title">
                  <component :is="Component" v-bind="route.meta.props" />
                </a-card>
              </router-view>
            </div>
          </a-layout-content>

          <!-- 底部 -->
          <a-layout-footer class="footer">
            <div>管理系统 ©2023 Created by Your Company</div>
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { useAppStore } from "./stores/app";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import menuConfig from "./config/menu";
import {
  UserOutlined,
  SmileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  BulbOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "App",
  components: {
    UserOutlined,
    SmileOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    LogoutOutlined,
    BulbOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const appStore = useAppStore();

    // 侧边栏状态
    const selectedKeys = ref([route.name || "users"]);

    // 监听路由变化，更新选中的菜单项
    watch(
      () => route.name,
      (newName) => {
        if (newName) {
          selectedKeys.value = [newName];
        }
      }
    );

    // 加载状态
    const loading = ref(false);

    // 导航到指定路由
    const navigateTo = (key) => {
      router.push(`/${key}`);
    };

    // 处理退出登录
    const handleLogout = () => {
      appStore.logout();
      message.success("退出登录成功");
      router.push("/users");
    };

    // 获取当前页面标题
    const getCurrentPageTitle = () => {
      return route.meta.title || "管理系统";
    };

    // 模拟添加通知
    setTimeout(() => {
      appStore.addNotification({
        title: "系统通知",
        content: "欢迎使用管理系统",
      });
    }, 2000);

    return {
      zhCN,
      selectedKeys,
      loading,
      menuConfig,
      appStore,
      navigateTo,
      handleLogout,
      getCurrentPageTitle,
    };
  },
};
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
}

/* Logo样式 */
.logo {
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: var(--border-radius-lg);
}

.logo img {
  height: 32px;
}

/* 侧边栏样式覆盖 */
.ant-layout-sider.ant-layout-sider-dark {
  background: var(--component-background) !important;
}

.ant-menu.ant-menu-dark {
  background: var(--component-background) !important;
}

.ant-menu-dark .ant-menu-item-selected {
  background-color: var(--item-active-bg) !important;
}

/* 头部样式 */
.header {
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1;
  color: var(--text-color);
  background: var(--component-background) !important;
}

.header .ant-breadcrumb > span:last-child,
.header .ant-breadcrumb-link,
.header .ant-breadcrumb-separator,
.header .trigger-btn {
  color: var(--text-color);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.trigger-btn {
  font-size: 18px;
  margin-right: 16px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: var(--text-color);
}

/* 内容区样式 */
.content {
  margin: 16px;
  overflow: initial;
}

.content-wrapper {
  padding: 16px;
  background: var(--component-background);
  min-height: 280px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
}

/* 底部样式 */
.footer {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  padding: 16px 50px;
}

/* 表格操作按钮样式 */
.ant-table-tbody .ant-btn-link {
  padding: 0 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content {
    margin: 8px;
  }

  .content-wrapper {
    padding: 8px;
  }
}
</style>
