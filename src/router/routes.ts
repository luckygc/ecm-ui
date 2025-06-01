import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  // 仪表盘路由 - 首页
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    meta: { title: "首页", icon: "HomeFilled" },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "仪表盘", icon: "Odometer", affix: true },
      },
    ],
  },
  // 系统管理路由
  {
    path: "/system",
    component: Layout,
    name: "System",
    meta: { title: "系统管理", icon: "Setting" },
    children: [
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "用户管理", icon: "User" },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/index.vue"),
        meta: { title: "角色管理", icon: "UserFilled" },
      },
    ],
  },
  // 多级菜单路由 - 演示嵌套菜单功能
  {
    path: "/nested",
    component: Layout,
    name: "Nested",
    meta: { title: "多级菜单", icon: "Menu" },
    children: [
      {
        path: "menu1",
        name: "Menu1",
        component: () => import("@/views/nested/menu1/index.vue"),
        meta: { title: "菜单1", icon: "Document" },
      },
      {
        path: "menu2",
        name: "Menu2",
        component: () => import("@/views/nested/menu2/index.vue"),
        meta: { title: "菜单2", icon: "Folder" },
        children: [
          {
            path: "menu2-1",
            name: "Menu2-1",
            component: () => import("@/views/nested/menu2/menu2-1/index.vue"),
            meta: { title: "菜单2-1", icon: "Document" },
          },
          {
            path: "menu2-2",
            name: "Menu2-2",
            component: () => import("@/views/nested/menu2/menu2-2/index.vue"),
            meta: { title: "菜单2-2", icon: "Document" },
          },
          {
            path: "menu2-3",
            name: "Menu2-3",
            component: () => import("@/views/nested/menu2/menu2-3/index.vue"),
            meta: { title: "菜单2-3", icon: "Document" },
          },
        ],
      },
    ],
  },
  // 错误页面路由 - 隐藏在侧边栏中
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true },
  },
  // 通配符路由 - 处理未匹配的路径，重定向到404页面
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    meta: { hidden: true },
  },
];
