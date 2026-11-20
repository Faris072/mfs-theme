<template>
  <div
    :class="[
      'divider',
      'mfs-text-muted',
      `divider--${orientation}`,
      `divider--align-${align}`,
      { 'divider--dashed': dashed, 'divider--with-text': hasLabel }
    ]"
    role="separator"
    :aria-orientation="orientation"
  >
    <span v-if="hasLabel && orientation === 'horizontal'" class="divider__label mfs-caption">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    align?: 'left' | 'center' | 'right'
    dashed?: boolean
  }>(),
  {
    orientation: 'horizontal',
    align: 'center',
    dashed: false
  }
)

const slots = useSlots()
const hasLabel = computed(() => Boolean(slots.default))
</script>

<style scoped>
.divider {
  --divider-color: var(--border, rgba(148, 163, 184, 0.35));
  display: flex;
  align-items: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
}

.divider--horizontal {
  width: 100%;
  margin: 16px 0;
}

.divider--horizontal::before,
.divider--horizontal::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--divider-color);
}

.divider--dashed.divider--horizontal::before,
.divider--dashed.divider--horizontal::after {
  border-top-style: dashed;
}

.divider--horizontal:not(.divider--with-text)::after {
  display: none;
}

.divider--align-left::before {
  flex: 0 0 24px;
}

.divider--align-right::after {
  flex: 0 0 24px;
}

.divider__label {
  padding: 0 12px;
  white-space: nowrap;
}

.divider--vertical {
  display: inline-flex;
  height: 1.25em;
  min-height: 16px;
  margin: 0 10px;
  border-left: 1px solid var(--divider-color);
  vertical-align: middle;
}

.divider--dashed.divider--vertical {
  border-left-style: dashed;
}

[data-theme="clay"] .divider--horizontal::before,
[data-theme="clay"] .divider--horizontal::after {
  border-top-width: 2px;
}

[data-theme="glass"] .divider {
  --divider-color: rgba(255, 255, 255, 0.28);
}

[data-theme="neo"] .divider--horizontal::before,
[data-theme="neo"] .divider--horizontal::after {
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
}
</style>
