/**
 * 菜单配置
 */
import UserList from "../components/UserList.vue";
import HelloWorld from "../components/HelloWorld.vue";

export const menuConfig = [
  {
    key: "users",
    title: "用户管理",
    icon: "user-outlined",
    component: UserList,
  },
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
    key: "about",
    title: "关于系统",
    icon: "info-circle-outlined",
    component: HelloWorld,
    props: {
      msg: "关于管理系统",
    },
  },
];

export default menuConfig;
