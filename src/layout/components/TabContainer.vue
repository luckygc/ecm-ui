<script setup lang="ts">
import {ArrowDown, CircleClose, FolderDelete, Refresh} from '@element-plus/icons-vue'
import {ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElTabPane, ElTabs,} from 'element-plus'
import {usePageStore} from '@/stores/modules/page-store.ts'
import {useRoute, useRouter} from "vue-router";

const pageStore = usePageStore();

const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="tab-bar-container">
    <ElTabs :model-value="route.fullPath" type="card" closable class="tab-bar-tabs"
            @tab-click="({paneName})=> router.push(paneName as string)"
            @tab-remove="(name) => pageStore.closePage(name as string)">
      <ElTabPane v-for="page in pageStore.pages" :key="page.fullPath"
                 :label="page.meta?.['title'] as string" :name="page.fullPath"
      >
      </ElTabPane>
    </ElTabs>

    <!-- 操作按钮 -->
    <div v-if="pageStore.pages.length > 0" class="tabs-actions">
      <!-- 刷新按钮 -->
      <ElButton text @click="pageStore.refreshPage()" class="refresh-btn">
        <ElIcon>
          <Refresh/>
        </ElIcon>
        <span>刷新</span>
      </ElButton>

      <!-- 下拉操作菜单 -->
      <ElDropdown trigger="click">
        <ElButton text>
          操作
          <ElIcon class="el-icon--right">
            <ArrowDown/>
          </ElIcon>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="pageStore.closeOtherPage()">
              <ElIcon>
                <CircleClose/>
              </ElIcon>
              <span>关闭其他</span>
            </ElDropdownItem>
            <ElDropdownItem @click="pageStore.closeAllPage()">
              <ElIcon>
                <FolderDelete/>
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
  width: 100%;
  height: 100%;
  box-shadow: none;
  border-bottom: none;
  background-color: #fff;
}

.tab-bar-tabs {
  flex: 1;
  min-width: 0;
  /* 确保内容可以正确收缩 */
}

.tabs-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn {
  margin-right: 4px;
}

:deep(.el-tabs__nav-wrap) {
  margin-bottom: 0;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs--card>.el-tabs__header) {
  border-left: none;
  border-right: none;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__nav) {
  border-radius: 0;
  border: none;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item) {
  border: none;
}

:deep(.el-tabs__nav-prev) {
  border-right: 1px solid var(--el-border-color-light)
}


:deep(.el-tabs__nav-next) {
  border-left: 1px solid var(--el-border-color-light)
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable) {
  border-bottom: 2px solid var(--el-color-primary);
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item:hover) {
  background-color: var(--el-color-primary-light-9);
}
</style>
