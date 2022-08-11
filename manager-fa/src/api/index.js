import request from "../utils/request";

export default {
    login(opt) {
        return request({
            url: "/login",
            method: "post",
            isMock: true,
            data: opt.data,
        });
    },

    getMenuList() {
        return request({
            url: "/menu/list",
        });
    },
    getUsersList(params) {
        return request({
            url: "/users/list",
            params,
        });
    },
    getUserAllList() {
        return request({
            url: "/users/all/list",
        });
    },
    userSubmit(params) {
        return request({
            url: "/users/operate",
            params,
        });
    },
    delUsers(data) {
        // 删除用户
        return request({
            url: "/users/delete",
            data,
        });
    },
};