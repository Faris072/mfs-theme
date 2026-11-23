<template>
  <component :is="tag" :class="['fluid', 'mfs-w-full', { 'mfs-px-4': padded }]">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string
    padded?: boolean
  }>(),
  {
    tag: 'div',
    padded: false
  }
)
</script>

<style scoped>
.fluid {
  display: block;
  max-width: 100%;
  box-sizing: border-box;
}

[data-theme="clay"] .fluid,
[data-theme="glass"] .fluid,
[data-theme="neo"] .fluid {
  color: var(--text);
}
</style>
