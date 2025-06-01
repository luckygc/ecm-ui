<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const sidebarOpened = computed(() => appStore.getSidebarStatus)
const activeMenu = computed(() => route.path)

const routes = computed(() => {
  return router.options.routes.filter((route) => {
    return !(route.meta && route.meta.hidden)
  })
})

function toggleSidebar() {
  appStore.toggleSidebar()
}

// 路径解析函数
function resolvePath(basePath: string, routePath: string) {
  // 如果是绝对路径，直接返回
  if (routePath.startsWith('/')) {
    return routePath
  }

  // 简单的路径合并逻辑
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  const path = routePath.startsWith('/') ? routePath : `/${routePath}`

  // 确保路径格式正确
  return `${base}${path}`
}
</script>

<template>
  <div style="height: 100%">
    <ElMenu
      :default-active="activeMenu"
      :collapse="!sidebarOpened"
      mode="vertical"
      style="height: calc(100% - 40px)"
    >
      <template v-for="route in routes" :key="route.path">
        <!-- 没有子菜单或子菜单为空的路由 -->
        <ElMenuItem v-if="!route.children || route.children.length === 0" :index="route.path">
          <ElIcon v-if="route.meta && route.meta.icon">
            <component :is="route.meta.icon" />
          </ElIcon>
          <template #title>
            <span v-if="route.meta">{{ route.meta.title }}</span>
          </template>
        </ElMenuItem>

        <!-- 有子菜单的路由 -->
        <template v-else>
          <ElSubMenu :index="route.path">
            <template #title>
              <ElIcon v-if="route.meta && route.meta.icon">
                <component :is="route.meta.icon" />
              </ElIcon>
              <span v-if="route.meta">{{ route.meta.title }}</span>
            </template>

            <!-- 递归渲染子菜单 -->
            <template
              v-for="child in route.children.filter(child => !(child.meta && child.meta.hidden))"
              :key="child.path"
            >
              <!-- 没有子菜单的子路由 -->
              <ElMenuItem
                v-if="!child.children || child.children.length === 0"
                :index="resolvePath(route.path, child.path)"
              >
                <ElIcon v-if="child.meta && child.meta.icon">
                  <component :is="child.meta.icon" />
                </ElIcon>
                <template #title>
                  <span v-if="child.meta">{{ child.meta.title }}</span>
                </template>
              </ElMenuItem>

              <!-- 有子菜单的子路由 -->
              <ElSubMenu v-else :index="resolvePath(route.path, child.path)">
                <template #title>
                  <ElIcon v-if="child.meta && child.meta.icon">
                    <component :is="child.meta.icon" />
                  </ElIcon>
                  <span v-if="child.meta">{{ child.meta.title }}</span>
                </template>

                <!-- 渲染三级菜单 -->
                <ElMenuItem
                  v-for="grandChild in child.children.filter(gc => !(gc.meta && gc.meta.hidden))"
                  :key="grandChild.path"
                  :index="resolvePath(resolvePath(route.path, child.path), grandChild.path)"
                >
                  <ElIcon v-if="grandChild.meta && grandChild.meta.icon">
                    <component :is="grandChild.meta.icon" />
                  </ElIcon>
                  <template #title>
                    <span v-if="grandChild.meta">{{ grandChild.meta.title }}</span>
                  </template>
                </ElMenuItem>
              </ElSubMenu>
            </template>
          </ElSubMenu>
        </template>
      </template>
    </ElMenu>

    <div class="collapse-btn" @click="toggleSidebar">
      <ElIcon class="collapse-icon">
        <Fold v-if="sidebarOpened" />
        <Expand v-else />
      </ElIcon>
      <span v-if="sidebarOpened" class="collapse-text">折叠</span>
    </div>
  </div>
</template>

<style scoped>
.collapse-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid #e6e6e6;
}

.collapse-icon {
  margin-right: 5px;
}
</style>
