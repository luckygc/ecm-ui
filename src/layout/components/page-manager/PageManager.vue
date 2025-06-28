<script setup lang="ts">
import {ArrowDown, CircleClose, FolderDelete, FullScreen, Refresh} from '@element-plus/icons-vue'
import {ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElTabPane, ElTabs,} from 'element-plus'
import {usePageStore} from '@/store/modules/page-store.ts'
import {useRoute, useRouter} from "vue-router";
import {useLayoutStore} from '@/store/modules/layout-store.ts';

const pageStore = usePageStore();
const layoutStore = useLayoutStore();
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="page-manager">
    <ElTabs :model-value="route.fullPath" type="border-card" closable
            @tab-click="({ paneName }) => router.push(paneName as string)"
            @tab-remove="name => pageStore.closePage(name as string)" style="flex: 1;min-width:0"
    >
      <ElTabPane v-for="page in pageStore.pages" :key="page.fullPath" :label="page.meta?.['title'] as string"
                 :name="page.fullPath">
      </ElTabPane>
    </ElTabs>

    <!--    <el-divider direction="vertical"></el-divider>-->

    <!-- 操作按钮 -->
    <div class="page-actions">
      <el-tooltip content="刷新">
        <ElButton circle text @click="pageStore.refreshPage()" :disabled="pageStore.pages.length === 0">
          <ElIcon>
            <Refresh/>
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
.page-manager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 0 10px;
  background-color: #fff;
}

.page-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.el-tabs {
  --el-tabs-header-height: 30px;
}

:deep(.el-tabs--border-card) {
  border: none;
}

:deep(.el-tabs__nav){
  column-gap: 6px;
}

:deep(.el-tabs__item){
  padding: 0 8px;
}

:deep(.el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2)){
  padding-left: 8px;
}

:deep(.el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child){
  padding-right: 8px;
}

:deep(.el-tabs__nav-wrap) {
  margin-bottom: 0;
}

:deep(.el-tabs__nav-next){
  line-height: 34px;
}

:deep(.el-tabs__nav-prev) {
  line-height: 34px;
}

:deep(.el-tabs--border-card>.el-tabs__header) {
  border-bottom: none;
  margin: 0;
  background-color: #fff;
}

:deep(.el-tabs--border-card>.el-tabs__content) {
  display: none;
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item) {
  border: none;
  margin-top: 0;
  background-color: var(--el-fill-color-light);
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item:hover) {
  background-color: rgba(var(--el-color-primary-rgb), 0.08);
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active) {
  border-left: none;
  border-right: none;
  background-color: rgba(var(--el-color-primary-rgb), 0.1);
}

:deep( .el-tabs--border-card>.el-tabs__header .el-tabs__item:first-child) {
  margin-left: 0;
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item+.el-tabs__item){
  margin-left: 0;
}
</style>
