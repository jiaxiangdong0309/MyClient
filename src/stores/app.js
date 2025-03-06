import { defineStore } from "pinia";

// 初始化主题
const initTheme = () => {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

export const useAppStore = defineStore("app", {
  state: () => ({
    theme: initTheme(),
    collapsed: localStorage.getItem("collapsed") === "true",
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
    notifications: [],
  }),

  getters: {
    isDarkTheme: (state) => state.theme === "dark",
    isLoggedIn: (state) => !!state.userInfo,
    unreadNotificationCount: (state) =>
      state.notifications.filter((n) => !n.read).length,
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", this.theme);

      // 设置HTML的data-theme属性
      document.documentElement.setAttribute("data-theme", this.theme);
    },

    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      localStorage.setItem("collapsed", this.collapsed);
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },

    logout() {
      this.userInfo = null;
      localStorage.removeItem("userInfo");
    },

    addNotification(notification) {
      this.notifications.push({
        id: Date.now(),
        read: false,
        time: new Date().toISOString(),
        ...notification,
      });
    },

    markNotificationAsRead(id) {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },

    clearNotifications() {
      this.notifications = [];
    },
  },
});
