<script setup lang="ts">
import { ArrowDown, CircleClose, FolderDelete, Refresh } from '@element-plus/icons-vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import { usePageStore } from '~/store/modules/page/page-store'
import routeMetaUtils from '~/utils/route/route-meta-utils'

const pageStore = usePageStore()
const layoutStore = useLayoutStore()
const route = useRoute()
const router = useRouter()

watch(() => pageStore.pages, (newVal) => {
  if (newVal.length === 0 && layoutStore.isPageMaximized) {
    layoutStore.togglePageMaximized()
  }
})
</script>

<template>
  <div class="ecm-tab-bar">
    <ElTabs
      :model-value="route.fullPath" type="card" closable
      style="flex: 1;min-width:0"
      @tab-click="({ paneName }) => router.push(String(paneName))" @tab-remove="name => pageStore.closePage(String(name))"
    >
      <ElTabPane
        v-for="page in pageStore.pages" :key="page.fullPath" :label="routeMetaUtils.getTitle(page)"
        :name="page.fullPath"
      />
    </ElTabs>

    <!-- 操作按钮 -->
    <div class="ecm-tab-bar__actions">
      <el-tooltip content="刷新">
        <ElButton circle text :disabled="pageStore.pages.length === 0" @click="pageStore.refreshCurrentPage()">
          <ElIcon>
            <Refresh />
          </ElIcon>
        </ElButton>
      </el-tooltip>

      <el-tooltip :content="layoutStore.isPageMaximized ? '还原' : '最大化'">
        <ElButton
          circle text :disabled="pageStore.pages.length === 0" icon="FullScreen"
          @click="layoutStore.togglePageMaximized()"
        />
      </el-tooltip>

      <!-- 下拉操作菜单 -->
      <ElDropdown trigger="click">
        <ElButton text :disabled="pageStore.pages.length === 0">
          <ElIcon>
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

<style>
.ecm-tab-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  height: var(--ecm-tab-bar-height);
  background-color: transparent;
  /* border-bottom: 1px solid var(--el-border-color-lighter); */
}

.ecm-tab-bar__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.ecm-tab-bar .el-tabs {
  flex: 1;
  min-width: 0;
  --el-tabs-header-height: 32px;
}

.ecm-tab-bar .el-tabs__header {
  margin: 0;
}

.ecm-tab-bar .el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
</style>
