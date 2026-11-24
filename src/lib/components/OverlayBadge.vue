<template>
  <span class="mfs-overlay-badge mfs-relative mfs-inline-flex">
    <slot />
    <Badge
      v-if="hasValue"
      :variant="variant"
      :size="size"
      class="mfs-overlay-badge__badge mfs-absolute mfs-top-0 mfs-right-0 mfs-z-1 mfs-pointer-events-none mfs-shadow"
    >
      {{ value }}
    </Badge>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from './Badge.vue'

const props = withDefaults(
  defineProps<{
    value?: string | number
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'primary',
    size: 'sm'
  }
)

const hasValue = computed(() => props.value !== undefined && props.value !== '')
</script>

<style scoped>
.mfs-overlay-badge__badge {
  transform: translate(40%, -40%);
}
</style>
