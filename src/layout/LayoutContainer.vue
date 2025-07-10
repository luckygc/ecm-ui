<script setup lang="ts">
import { useLayoutStore } from '~/store/modules/layout/layout-store'

const layoutStore = useLayoutStore()
</script>

<template>
  <component :is="layoutStore.layoutComponent" />
</template>

<style lang="scss">

</style>
