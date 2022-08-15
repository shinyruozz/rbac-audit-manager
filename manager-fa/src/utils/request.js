import axios from "axios";
import { router } from "../router";
import config from "../config/index";
import CODE_INFO from "../config/code";
import storage from "./storage";
import { ElMessage, ElLoading } from "element-plus";

let loading;
const http = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,
});
//请求额拦截
http.interceptors.request.use((req) => {
    loading = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, .1)",
    });
    const auth = req.headers.Authorization;
    //添加token
    if (!auth) {
        const { token = "" } = storage.getStorage("userInfo") || {};
        req.headers.Authorization = "Bearer " + token;
    }
    return req;
});
//响应拦截
http.interceptors.response.use((res) => {
    const { code, data, msg } = res.data;
    setTimeout(() => {
        loading.close();
    }, 300);
    if (code == 200) {
        return data;
    } else if (code == 50001) {
        ElMessage.error(CODE_INFO.TOKEN_ERR);
        setTimeout(() => {
            router.push("/login");
        }, 500);
        return Promise.reject(CODE_INFO.TOKEN_ERR);
    } else {
        ElMessage.error(msg || CODE_INFO.NETWORK_ERR);
        return Promise.reject(msg || CODE_INFO.NETWORK_ERR);
    }
});

function request(options) {
    if (!options.method) {
        options.method = "get";
    }
    if (options.method.toLowerCase() == "get") {
        options.params = options.data;
    }
    // api 自身的mock 优先于 全局配置的mock配置
    let isMock = options.isMock ? true : config.isMock;
    http.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    return http(options);
}

export default request;