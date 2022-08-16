import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Welcome from "../views/Welcome.vue";
import Login from "../views/Login.vue";
import User from "../views/User.vue";
import Menu from "../views/Menu.vue";
import Role from "../views/Role.vue";
import Dept from "../views/Dept.vue";
import Leave from "../views/Leave.vue";
import Approve from "../views/Approve.vue";
import Error404 from "../views/404.vue";

import storage from "../utils/storage";
import $api from "../api/index";
import store from "../store/index";
import { ElMessage } from "element-plus";
const routes = [{
        name: "home",
        path: "/",
        redirect: "/home/welcome",
        component: Home,
        children: [{
            name: "welcome",
            path: "/home/welcome",
            meta: {
                title: "首页",
            },

            component: Welcome,
        }, ],
    },

    // {

    //     children: [{
    //             name: "welcome",
    //             path: "welcome",
    //             meta: {
    //                 title: "欢迎",
    //             },
    //             component: Welcome,
    //         },
    //         {
    //             name: "user",
    //             path: "user",
    //             meta: {
    //                 title: "用户列表",
    //             },
    //             component: User,
    //         },
    //         {
    //             name: "menu",
    //             path: "menu",
    //             meta: {
    //                 title: "菜单列表",
    //             },
    //             component: Menu,
    //         },
    //         {
    //             name: "role",
    //             path: "role",
    //             meta: {
    //                 title: "角色列表",
    //             },
    //             component: Role,
    //         },
    //         {
    //             name: "dept",
    //             path: "dept",
    //             meta: {
    //                 title: "部门列表",
    //             },
    //             component: Dept,
    //         },
    //     ],
    // },
    // {
    //     name: "audit",
    //     path: "/audit",
    //     component: Home,
    //     mate: {
    //         title: "首页",
    //     },
    //     children: [{
    //             name: "leave",
    //             path: "leave",
    //             meta: {
    //                 title: "休假审批",
    //             },
    //             component: Leave,
    //         },
    //         {
    //             name: "approve",
    //             path: "approve",
    //             meta: {
    //                 title: "待我审批",
    //             },
    //             component: Approve,
    //         },
    //     ],
    // },
    {
        name: "Login",
        path: "/login",
        meta: {
            title: "登录",
        },
        component: Login,
    },
    {
        name: "404",
        path: "/404",
        mate: {
            title: "找不到页面",
        },
        component: Error404,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

//动态加载路由
async function syncLoadRoutes() {
    const userInfo = storage.getStorage("userInfo") || {};
    if (userInfo.token) {
        const { menuList, action } = await $api.getUserPermission();
        store.commit("saveActionList", action);
        store.commit("saveMenuList", menuList);
        generateRotes(menuList, router);
        // router.addRoute("system", {
        //     name: "welcome",
        //     component: () =>
        //         import ("../views/Welcome.vue"),
        //     path: "welcome",
        //     meta: {
        //         title: "欢迎",
        //     },
        // });
    }

    function generateRotes(menuRoutes, router) {
        //最外一层父路由
        menuRoutes.map((menuItem) => {
            let routeName = menuItem.path.substr(1);
            let url = "../views/" + menuItem.component + ".vue";
            if (menuItem.parentId && menuItem.parentId.length == 0) {
                router.addRoute({
                    name: routeName,
                    component: () => {
                        return import (url);
                    },
                    path: menuItem.path,
                    meta: {
                        title: "首页",
                    },
                });
            } else {
                let pRoute = menuItem.path.match(/\/(.+?)\//)[1];
                router.addRoute(pRoute, {
                    name: routeName,
                    component: () => {
                        return import (url);
                    },
                    path: menuItem.path,
                    meta: {
                        title: menuItem.menuName,
                    },
                });
            }

            if (!menuItem.action) {
                generateRotes(menuItem.children, router);
            }
        });
    }
}

await syncLoadRoutes();

router.beforeEach((to, from, next) => {
    const userInfo = storage.getStorage("userInfo");
    if (to.path == "/login") {
        return next();
    }
    if (!userInfo.token) {
        ElMessage.error("请先登录");
        next("/login");
        return;
    }
    if (!router.hasRoute(to.name)) {
        next("/404");
        return;
    }
    next();
});

export { router, syncLoadRoutes };