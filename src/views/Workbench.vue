<script setup lang="ts">
import {useRouter} from "vue-router";
import Page from "@/components/page/Page.vue";

const router = useRouter();
const randomPage = () => {
  router.push(`/workbench?a=${Math.random()}`)
}

defineOptions({
  name: 'Workbench'
})
</script>

<template>
  <Page>
    <div class="inner-container">
      首页
      <button @click="randomPage">按钮</button>
      <input type="text"/>
      <div style="height: 1900px">中间内容区域（很长的内容用于测试滚动）</div>
      <div>底部内容</div>
    </div>

    <template #toolbar>
      <div style="display: flex; gap: 20px; align-items: center;justify-content: end;">
        <button>操作1</button>
        <button>操作2</button>
        <button>操作3</button>
      </div>
    </template>
  </Page>
</template>

<style scoped>
.inner-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>