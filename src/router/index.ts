import { createRouter, createWebHashHistory } from "vue-router";
import { allRoutes } from "./modules";

const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes,
});

export default router;
