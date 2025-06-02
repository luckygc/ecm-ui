import Layout from "@/layout/Layout.vue";
import type { RouteRecordRaw } from "vue-router";

// 系统管理路由模块
export const systemRoutes: Array<RouteRecordRaw> = [
  {
    path: "/system",
    component: Layout,
    name: "System",
    meta: { title: "系统管理", icon: "Setting", menu: true },
    children: [
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/UserManagement.vue"),
        meta: { title: "用户管理", icon: "User", menu: true },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/RoleManagement.vue"),
        meta: { title: "角色管理", icon: "UserFilled", menu: true },
      },
      {
        path: "page-manager",
        name: "PageManager",
        component: () => import("@/components/PageManager/PageManager.vue"),
        meta: { title: "页面管理", icon: "Document", menu: true },
      },
      {
        path: "route-test",
        name: "RouteTest",
        component: () => import("@/views/test/route-test.vue"),
        meta: { title: "路由测试", icon: "Tools", menu: true },
      },

      {
        path: "no-cache-test",
        name: "NoCacheTest",
        component: () => import("@/views/test/no-cache-test.vue"),
        meta: {
          title: "不缓存测试页",
          icon: "Warning",
          keepalive: false,
          menu: true,
        },
      },
      {
        path: "form-test",
        name: "FormTest",
        component: () => import("@/views/test/form-test.vue"),
        meta: {
          title: "表单测试页",
          icon: "Edit",
          formComponent: true,
          allowMultiple: true,
          menu: true,
        },
      },
      {
        path: "modal-test",
        name: "ModalTest",
        component: () => import("@/views/test/modal-test.vue"),
        meta: {
          title: "弹窗测试页",
          icon: "Monitor",
          modalComponent: true,
          menu: true,
        },
      },
      {
        path: "page-manager-test",
        name: "PageManagerTest",
        component: () => import("@/views/test/page-manager-test.vue"),
        meta: {
          title: "页面管理测试",
          icon: "Grid",
          menu: true,
        },
      },
      {
        path: "single-instance-test",
        name: "SingleInstanceTest",
        component: () => import("@/views/test/single-instance-test.vue"),
        meta: {
          title: "单实例测试页",
          icon: "Document",
          allowMultiple: false,
          menu: true,
        },
      },
    ],
  },
];
