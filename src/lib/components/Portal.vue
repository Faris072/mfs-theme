<template>
  <Teleport :to="appendTo" :disabled="disabled">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    appendTo?: string | HTMLElement
    disabled?: boolean
  }>(),
  {
    appendTo: 'body',
    disabled: false
  }
)
</script>
