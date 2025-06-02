import Layout from "@/layout/Layout.vue";
import type { RouteRecordRaw } from "vue-router";

// 多级菜单路由模块
export const nestedRoutes: Array<RouteRecordRaw> = [
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
];
