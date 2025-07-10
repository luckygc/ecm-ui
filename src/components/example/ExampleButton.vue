<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'default',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    class="example-button" :class="[
      `example-button--${type}`,
      `example-button--${size}`,
      { 'example-button--disabled': disabled },
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
// 使用Element Plus的BEM mixins
@include b('example-button') {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition: all $transition-duration-fast ease-in-out;
  user-select: none;
  outline: none;

  // 默认样式
  background-color: $background-color-base;
  border-color: $border-color-base;
  color: $text-color-regular;

  &:hover {
    background-color: $background-color-light;
    border-color: $primary-color;
    color: $primary-color;
  }

  &:active {
    transform: translateY(1px);
  }

  // 尺寸变体
  @include m('large') {
    padding: 12px 20px;
    font-size: $font-size-large;
  }

  @include m('small') {
    padding: 6px 12px;
    font-size: $font-size-small;
  }

  // 类型变体
  @include m('primary') {
    background-color: $primary-color;
    border-color: $primary-color;
    color: white;

    &:hover {
      background-color: lighten($primary-color, 10%);
      border-color: lighten($primary-color, 10%);
      color: white;
    }
  }

  @include m('success') {
    background-color: $success-color;
    border-color: $success-color;
    color: white;

    &:hover {
      background-color: lighten($success-color, 10%);
      border-color: lighten($success-color, 10%);
      color: white;
    }
  }

  @include m('warning') {
    background-color: $warning-color;
    border-color: $warning-color;
    color: white;

    &:hover {
      background-color: lighten($warning-color, 10%);
      border-color: lighten($warning-color, 10%);
      color: white;
    }
  }

  @include m('danger') {
    background-color: $danger-color;
    border-color: $danger-color;
    color: white;

    &:hover {
      background-color: lighten($danger-color, 10%);
      border-color: lighten($danger-color, 10%);
      color: white;
    }
  }

  @include m('info') {
    background-color: $info-color;
    border-color: $info-color;
    color: white;

    &:hover {
      background-color: lighten($info-color, 10%);
      border-color: lighten($info-color, 10%);
      color: white;
    }
  }

  // 禁用状态
  @include m('disabled') {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      background-color: inherit;
      border-color: inherit;
      color: inherit;
      transform: none;
    }
  }

  // 响应式设计
  @include res('xs') {
    width: 100%;
    margin-bottom: $spacing-sm;
  }
}
</style>
