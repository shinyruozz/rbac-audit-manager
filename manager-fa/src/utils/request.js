import axios from "axios";
import router from "../router";
import config from "../config/index";
import CODE_INFO from "../config/code";
import storage from "./storage";
import { ElMessage } from "element-plus";

const http = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,
});
//请求额拦截
http.interceptors.request.use((req) => {
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
    if (code == 200) {
        return data;
    } else if (code == 50001) {
        ElMessage.error(CODE_INFO.TOKEN_ERR);
        setTimeout(() => {
            router.push("/login");
        }, 1000);
        return Promise.reject(CODE_INFO.TOKEN_ERR);
    } else {
        ElMessage.error(msg || CODE_INFO.NETWORK_ERROR);
        return Promise.reject(msg || CODE_INFO.NETWORK_ERROR);
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