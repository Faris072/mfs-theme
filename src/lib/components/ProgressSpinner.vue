<template>
  <span
    class="mfs-spinner mfs-text"
    :class="[`mfs-spinner--${variant}`]"
    :style="{ width: resolvedSize, height: resolvedSize }"
    role="status"
    aria-label="Loading"
  >
    <svg class="mfs-spinner__svg" viewBox="0 0 50 50">
      <circle
        class="mfs-spinner__track"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        :stroke-width="strokeWidth"
      />
      <circle
        class="mfs-spinner__ring"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | number
    strokeWidth?: number
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  }>(),
  {
    size: 'md',
    strokeWidth: 4,
    variant: 'primary'
  }
)

const sizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: '22px',
  md: '36px',
  lg: '52px'
}

const resolvedSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : sizeMap[props.size]
)
</script>

<style scoped>
.mfs-spinner {
  --spinner-color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mfs-spinner--primary { --spinner-color: var(--primary); }
.mfs-spinner--secondary { --spinner-color: var(--secondary); }
.mfs-spinner--success { --spinner-color: var(--success); }
.mfs-spinner--warning { --spinner-color: var(--warning); }
.mfs-spinner--danger { --spinner-color: var(--danger); }

.mfs-spinner__svg {
  width: 100%;
  height: 100%;
  animation: mfs-spinner-rotate 1.6s linear infinite;
}

.mfs-spinner__track {
  stroke: var(--surface-subtle);
  opacity: 0.7;
}

.mfs-spinner__ring {
  stroke: var(--spinner-color);
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: mfs-spinner-dash 1.4s ease-in-out infinite;
}

@keyframes mfs-spinner-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes mfs-spinner-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Theme Overrides */
[data-theme="glass"] .mfs-spinner__track {
  stroke: rgba(255, 255, 255, 0.14);
}

[data-theme="neo"] .mfs-spinner__track {
  stroke: #cbd5e1;
}
</style>
