<!--
  重定向组件

  功能说明：
  这是一个用于页面重定向的中间组件，主要用于解决Vue Router在某些情况下
  无法正确刷新页面的问题。当需要强制刷新当前路由时，可以先跳转到这个
  重定向页面，然后再跳转回目标页面，从而实现页面的重新加载。

  使用场景：
  1. 当前页面需要强制刷新时
  2. 路由参数变化但组件没有重新渲染时
  3. 需要重新触发路由守卫和生命周期钩子时

  工作原理：
  1. 接收路由参数中的目标路径和查询参数
  2. 在组件挂载前立即重定向到目标路径
  3. 保持原有的查询参数不变
-->
<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 获取当前路由信息
const route = useRoute()
// 获取路由器实例用于导航
const router = useRouter()

/**
 * 在组件挂载前执行重定向逻辑
 * 这样可以避免组件实际渲染，直接进行路由跳转
 */
onBeforeMount(() => {
  // 从当前路由中解构出参数和查询字符串
  const { params, query } = route
  // 获取目标路径参数
  const { path } = params

  // 执行重定向
  router.replace({
    // 构建目标路径
    // 如果path是数组（多级路径），则用'/'连接；否则直接使用
    path: `/${Array.isArray(path) ? path.join('/') : path}`,
    // 保持原有的查询参数
    query,
  })
})
</script>

<template>
  <!--
    空的div元素，因为这个组件的作用只是重定向
    实际上用户不会看到这个组件的内容，因为会立即跳转
  -->
  <div></div>
</template>
