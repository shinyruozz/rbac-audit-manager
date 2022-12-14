import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import { router } from "./router/index.js";
import store from "./store";
import api from "./api/index";
import storage from "./utils/storage";
import "./assets/styles/index.scss";
import { vHas } from "./directive";

import "./config/index.js";

const app = createApp(App).use(router).use(store).use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

vHas(app); //directive 定义

app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;

app.mount("#app");