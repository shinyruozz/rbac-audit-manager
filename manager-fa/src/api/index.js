import request from "../utils/request";

export default {
    login(opt) {
        return request({
            url: "/users/login",
            method: "post",
            isMock: false,
            data: opt.data,
        });
    },

    getMenuList(data) {
        return request({
            url: "/menu/list",
            method: "post",
            data,
            isMock: false,
        });
    },

    operateMenu(data) {
        return request({
            url: "/menu/operate",
            method: "post",
            data,
        });
    },

    getUsersList(data) {
        return request({
            url: "/users/list",
            method: "post",
            data,
            isMock: false,
        });
    },
    getUserAllList() {
        return request({
            url: "/users/all/list",
            isMock: false,
        });
    },
    userSubmit(data) {
        return request({
            url: "/users/operate",
            method: "post",
            data,
            isMock: false,
        });
    },
    delUsers(data) {
        // 删除用户
        return request({
            url: "/users/delete",
            method: "post",
            data,
            isMock: false,
        });
    },

    //获取所有角色数列表
    getAllRolesList(params) {
        // 删除用户
        return request({
            url: "/roles/allList",
            params,
            isMock: true,
        });
    },

    //获取部门列表
    getDeptList(params) {
        return request({
            url: "/dept/list",
            params,
            isMock: true,
        });
    },
};