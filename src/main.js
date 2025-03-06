import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import "./assets/main.css";
import "./styles/variables.css";

const app = createApp(App);
const pinia = createPinia();

app.use(Antd);
app.use(router);
app.use(pinia);
app.mount("#app");
