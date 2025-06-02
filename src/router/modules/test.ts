import Layout from "@/layout/Layout.vue";
import type { RouteRecordRaw } from "vue-router";

// 测试路由模块 - 用于测试带参数的路由多开功能
export const testRoutes: Array<RouteRecordRaw> = [
  {
    path: "/test",
    component: Layout,
    name: "Test",
    meta: { title: "测试页面", icon: "Experiment", sideBar: true },
    children: [
      {
        path: ":id",
        name: "TestDetail",
        component: () => import("@/views/test/TestDetail.vue"),
        meta: { 
          title: "测试详情", 
          icon: "Document", 
          sideBar: false, // 不在侧边栏显示，只能通过编程方式访问
          keepAlive: true,
          allowMultiple: true // 允许多实例
        },
      },
    ],
  },
];
