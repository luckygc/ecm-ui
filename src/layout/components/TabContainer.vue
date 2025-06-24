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
    <ElTabs :model-value="route.fullPath"
            type="border-card"
            closable
            @tab-click="({paneName})=> router.push(paneName as string)"
            @tab-remove="name => pageStore.closePage(name as string)">
      <ElTabPane v-for="page in pageStore.pages"
                 :key="page.fullPath"
                 :label="page.meta?.['title'] as string"
                 :name="page.fullPath">
      </ElTabPane>
    </ElTabs>

    <!-- 操作按钮 -->
    <div class="tabs-actions">
      <el-tooltip content="刷新" :auto-close="1000">
        <ElButton text
                  @click="pageStore.refreshPage()"
                  class="refresh-btn"
                  :disabled="pageStore.pages.length === 0"
        >
          <ElIcon>
            <Refresh/>
          </ElIcon>
        </ElButton>
      </el-tooltip>

      <!-- 下拉操作菜单 -->
      <ElDropdown trigger="click">
        <ElButton text :disabled="pageStore.pages.length === 0">
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
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-tabs--border-card) {
  border: none;
}

:deep(.el-tabs--border-card>.el-tabs__header) {
  border-bottom: none;
}

:deep(.el-tabs--border-card>.el-tabs__content) {
  padding: 0;
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item) {
  border: none;
  background-color: var(--el-bg-color-overlay);
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active) {
  border-left: none;
  border-right: none;
}

/* 激活状态下的底部边框 */
:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: var(--el-color-primary);
  width: 100%;
}
</style>
