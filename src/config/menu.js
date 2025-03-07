/**
 * 菜单配置
 */
import UserList from "../components/UserList.vue";
import HelloWorld from "../components/HelloWorld.vue";
import Setting from "../components/Setting.vue";

export const menuConfig = [
  {
    key: "hello",
    title: "Hello",
    icon: "smile-outlined",
    component: HelloWorld,
    props: {
      msg: "欢迎使用管理系统",
    },
  },
  {
    key: "users",
    title: "用户管理",
    icon: "user-outlined",
    component: UserList,
  },
  {
    key: "about",
    title: "设置",
    icon: "info-circle-outlined",
    component: Setting,
    props: {
      msg: "设置",
    },
  },
];

export default menuConfig;
