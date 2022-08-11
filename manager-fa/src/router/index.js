import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Welcome from "../views/Welcome.vue";
import Login from "../views/Login.vue";
import User from "../views/User.vue";

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
                name: "/welcome",
                path: "welcome",
                meta: {
                    title: "欢迎",
                },
                component: Welcome,
            },
            {
                name: "/user",
                path: "user",
                meta: {
                    title: "用户",
                },
                component: User,
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