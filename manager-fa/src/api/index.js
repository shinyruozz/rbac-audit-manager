import request from "../utils/request";

export default {
    // 登录
    login(opt) {
        return request({
            url: "/users/login",
            method: "post",
            isMock: false,
            data: opt.data,
        });
    },
    // 获取菜单列表
    getMenuList(data) {
        return request({
            url: "/menu/list",
            method: "post",
            data,
            isMock: false,
        });
    },
    //获取所有菜单
    getAllMenuList() {
        return request({
            url: "/menu/allList",
            isMock: false,
        });
    },
    // 菜单操作
    operateMenu(data) {
        return request({
            url: "/menu/operate",
            method: "post",
            data,
        });
    },
    // 用户列表
    getUsersList(data) {
        return request({
            url: "/users/list",
            method: "post",
            data,
            isMock: false,
        });
    },
    // 所有用户
    getUserAllList() {
        return request({
            url: "/users/all/list",
            isMock: false,
        });
    },
    //用户提交
    userSubmit(data) {
        return request({
            url: "/users/operate",
            method: "post",
            data,
            isMock: false,
        });
    },
    // 删除用户
    delUsers(data) {
        // 删除用户
        return request({
            url: "/users/delete",
            method: "post",
            data,
            isMock: false,
        });
    },

    getRoleList(data) {
        return request({
            url: "/roles/list",
            data,
            isMock: false,
        });
    },

    getRoleAllList() {
        return request({
            url: "/roles/allList",
            isMock: false,
        });
    },
    //编辑用户权限
    roleEditPermission(data) {
        return request({
            url: "/roles/update/permission",
            method: "post",
            data,
            isMock: false,
        });
    },

    operateRole(data) {
        return request({
            url: "/roles/operate",
            method: "post",
            data,
            isMock: false,
        });
    },

    //获取部门列表
    getDeptList(data) {
        return request({
            url: "/dept/list",
            data,
            isMock: false,
        });
    },
    operateDept(data) {
        return request({
            url: "/dept/operate",
            method: "post",
            data,
            isMock: false,
        });
    },
};