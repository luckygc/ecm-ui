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
  </div>
</template>

<style scoped>
.outer-container {
  padding: 10px;
  height: auto;
  width: 100%;
}

.inner-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>