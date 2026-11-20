<template>
  <component :is="tag" :class="['fluid', { 'fluid--padded': padded }]">
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
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.fluid--padded {
  padding-inline: 16px;
}

[data-theme="clay"] .fluid,
[data-theme="glass"] .fluid,
[data-theme="neo"] .fluid {
  color: var(--text);
}
</style>
