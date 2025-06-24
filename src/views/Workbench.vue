<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
const randomPage = () => {
  router.push(`/workbench?a=${Math.random()}`)
}
</script>

<template>
  <div class="outer-container">
    <div class="inner-container">
      首页
      <button @click="randomPage">按钮</button>
      <input type="text" />
      <div style="height: 1900px">中间</div>
      <div>底部</div>
    </div>
    <div class="toolbar">
      <button>操作1</button>
      <button>操作2</button>
      <button>操作3</button>
    </div>
  </div>
</template>

<style scoped>
.outer-container {
  height: 100%;
  width: 100%;
  padding: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.inner-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px; /* 与 toolbar 保持间距 */
}

.toolbar {
  position: sticky;
  bottom: 0;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 8px;
  flex-shrink: 0; /* 防止被压缩 */
}
</style>