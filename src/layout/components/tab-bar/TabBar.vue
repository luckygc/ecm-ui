<script setup lang="ts">
import { ArrowDown, CircleClose, FolderDelete, FullScreen, Refresh } from '@element-plus/icons-vue'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElTabPane, ElTabs, } from 'element-plus'
import { usePageStore } from '@/store/modules/page-store.ts'
import { useRoute, useRouter } from "vue-router";
import { useLayoutStore } from '@/store/modules/layout-store';

const pageStore = usePageStore();
const layoutStore = useLayoutStore();
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="tab-bar-container">
    <ElTabs :model-value="route.fullPath" type="border-card" closable
            @tab-click="({ paneName }) => router.push(paneName as string)"
            @tab-remove="name => pageStore.closePage(name as string)" style="flex: 1;min-width:0"
    >
      <ElTabPane v-for="page in pageStore.pages" :key="page.fullPath" :label="page.meta?.['title'] as string"
                 :name="page.fullPath">
      </ElTabPane>
    </ElTabs>

    <!-- 操作按钮 -->
    <div class="tabs-actions">
      <el-tooltip content="刷新">
        <ElButton circle text @click="pageStore.refreshPage()" :disabled="pageStore.pages.length === 0">
          <ElIcon>
            <Refresh />
          </ElIcon>
        </ElButton>
      </el-tooltip>

      <el-tooltip :content="layoutStore.isPageMaximized ? '还原' : '最大化'">
        <ElButton circle text @click="layoutStore.togglePageMaximized()" :disabled="pageStore.pages.length === 0"
          icon="FullScreen">
        </ElButton>
      </el-tooltip>

      <!-- 下拉操作菜单 -->
      <ElDropdown trigger="click">
        <ElButton text :disabled="pageStore.pages.length === 0">
          操作
          <ElIcon class="el-icon--right">
            <ArrowDown />
          </ElIcon>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="pageStore.closeOtherPage()">
              <ElIcon>
                <CircleClose />
              </ElIcon>
              <span>关闭其他</span>
            </ElDropdownItem>
            <ElDropdownItem @click="pageStore.closeAllPage()">
              <ElIcon>
                <FolderDelete />
              </ElIcon>
              <span>关闭所有</span>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<style scoped>
.tab-bar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 100%;
  padding: 10px 10px 0 10px;
}

.tabs-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink:0;
}

:deep(.el-tabs--border-card) {
  border: none;
  background-color: transparent;
}

:deep(.el-tabs__nav-next:hover){
  background-color: #fff;
}

:deep(.el-tabs__nav-prev:hover){
  background-color: #fff;
}

:deep(.el-tabs--border-card>.el-tabs__header) {
  border-bottom: none;
  background-color: transparent;
  margin: 0;
}

:deep(.el-tabs--border-card>.el-tabs__content) {
  padding: 0;
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item) {
  border: none;
  background-color: transparent;
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item:hover) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active) {
  border-left: none;
  border-right: none;
  background-color: #fff;
}

/* 激活状态下的底部边框 */
/*:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active::after) {
  display: none;
}*/
</style>
