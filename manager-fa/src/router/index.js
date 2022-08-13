import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Welcome from "../views/Welcome.vue";
import Login from "../views/Login.vue";
import User from "../views/User.vue";
import Menu from "../views/Menu.vue";
import Role from "../views/Role.vue";
import Dept from "../views/Dept.vue";

const routes = [{
        path: "/",
        component: Home,
        redirect: "/system/welcome",
    },
    {
        name: "system",
        path: "/system",
        meta: {
            title: "首页",
        },
        redirect: "/system/welcome",

        component: Home,
        children: [{
                name: "welcome",
                path: "welcome",
                meta: {
                    title: "欢迎",
                },
                component: Welcome,
            },
            {
                name: "user",
                path: "user",
                meta: {
                    title: "用户列表",
                },
                component: User,
            },
            {
                name: "menu",
                path: "menu",
                meta: {
                    title: "菜单列表",
                },
                component: Menu,
            },
            {
                name: "role",
                path: "role",
                meta: {
                    title: "角色列表",
                },
                component: Role,
            },
            {
                name: "dept",
                path: "dept",
                meta: {
                    title: "部门列表",
                },
                component: Dept,
            },
        ],
    },
    {
        name: "Login",
        path: "/login",
        meta: {
            title: "登录",
        },
        component: Login,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;