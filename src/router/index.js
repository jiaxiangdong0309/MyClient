import { createRouter, createWebHashHistory } from "vue-router";
import menuConfig from "../config/menu";

// 根据菜单配置生成路由
const routes = menuConfig.map((item) => ({
  path: `/${item.key}`,
  name: item.key,
  component: item.component,
  meta: {
    title: item.title,
    icon: item.icon,
    props: item.props || {},
  },
}));

// 添加默认路由
routes.push({
  path: "/",
  redirect: "/users",
});

// 添加404路由
routes.push({
  path: "/:pathMatch(.*)*",
  redirect: "/users",
});

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 管理系统` : "管理系统";

  // 这里可以添加权限验证等逻辑

  next();
});

export default router;
