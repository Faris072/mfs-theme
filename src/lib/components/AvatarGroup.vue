<template>
  <div
    :class="['mfs-avatar-group', `mfs-avatar-group--${size}`, 'mfs-inline-flex', 'mfs-items-center']"
    role="group"
  >
    <template v-if="items?.length">
      <Avatar
        v-for="(item, index) in visibleItems"
        :key="index"
        :src="item.src"
        :label="item.label"
        :size="size"
      />
      <Avatar
        v-if="overflowCount > 0"
        :size="size"
        :label="`+${overflowCount} more`"
        class="mfs-avatar-group__overflow"
      >
        +{{ overflowCount }}
      </Avatar>
    </template>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Avatar from './Avatar.vue'

export interface AvatarGroupItem {
  label?: string
  src?: string
}

const props = withDefaults(
  defineProps<{
    max?: number
    size?: 'sm' | 'md' | 'lg'
    items?: AvatarGroupItem[]
  }>(),
  {
    size: 'md'
  }
)

const visibleItems = computed(() => {
  if (!props.items) return []
  if (props.max !== undefined && props.max >= 0 && props.items.length > props.max) {
    return props.items.slice(0, props.max)
  }
  return props.items
})

const overflowCount = computed(() => {
  if (!props.items || props.max === undefined || props.max < 0) return 0
  return Math.max(0, props.items.length - props.max)
})
</script>

<style scoped>
.mfs-avatar-group :deep(> *) {
  border: 2px solid var(--surface);
  transition: transform 0.2s ease, z-index 0.2s ease;
}

.mfs-avatar-group--sm :deep(> *:not(:first-child)) {
  margin-left: -8px;
}

.mfs-avatar-group--md :deep(> *:not(:first-child)) {
  margin-left: -12px;
}

.mfs-avatar-group--lg :deep(> *:not(:first-child)) {
  margin-left: -16px;
}

.mfs-avatar-group :deep(> *:hover) {
  z-index: 2;
  transform: translateY(-2px);
}
</style>
