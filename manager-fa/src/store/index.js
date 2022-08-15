// vuex 状态管理
import { createStore } from "vuex";
import mutations from "./mitations";
import storeage from "../utils/storage";

const state = {
    userInfo: storeage.getStorage("userInfo") || {}, // 登录的用户信息
    auditCount: 0, //要审核的人数
    actionList: [], //按钮权限
    menuList: [], //菜单权限
};

export default createStore({
    state,
    mutations,
});