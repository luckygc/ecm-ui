<script setup lang="ts">
import Page from '~/components/page/Page.vue'
</script>

<template>
  <Page layout="fixed">
    <el-table>
      <el-table-column label="元数据名称" prop="name" />
      <el-table-column label="元数据类型" prop="type" />
      <el-table-column label="元数据描述" prop="description" />
    </el-table>
    <div style="height: 1900px;background: black;">
      中间内容区域（很长的内容用于测试滚动）
    </div>
  </Page>
</template>

<style scoped>

</style>
