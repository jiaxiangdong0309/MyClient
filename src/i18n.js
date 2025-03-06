import { createI18n } from "vue-i18n";
import messages from "./locales";

// 获取浏览器语言
const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.includes("zh") ? "zh-CN" : "en-US";
};

// 获取本地存储的语言或浏览器语言
const getLocale = () => {
  return localStorage.getItem("locale") || getBrowserLanguage();
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: getLocale(),
  fallbackLocale: "zh-CN",
  messages,
});

// 切换语言
export const setLocale = (locale) => {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
  document.querySelector("html").setAttribute("lang", locale);
};

export default i18n;
