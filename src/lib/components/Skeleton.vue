<template>
  <div
    class="mfs-skeleton-group"
    :class="{ 'mfs-skeleton-group--lines': variant === 'text' && lineCount > 1 }"
    aria-hidden="true"
  >
    <div
      v-for="n in lineCount"
      :key="n"
      class="mfs-skeleton"
      :class="[
        `mfs-skeleton--${variant}`,
        variant === 'text' ? 'mfs-rounded-sm' : variant === 'circle' ? 'mfs-pill' : 'mfs-rounded',
        { 'mfs-skeleton--animated': animated }
      ]"
      :style="getLineStyle(n)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'text' | 'circle' | 'rect'
    width?: string
    height?: string
    lines?: number
    animated?: boolean
  }>(),
  {
    variant: 'text',
    lines: 1,
    animated: true
  }
)

const lineCount = computed(() => {
  if (props.variant !== 'text') return 1
  return Math.max(1, Math.floor(props.lines))
})

const getLineStyle = (index: number) => {
  const isLastMultiLine = props.variant === 'text' && lineCount.value > 1 && index === lineCount.value
  const defaultWidth = props.variant === 'circle' ? '48px' : isLastMultiLine ? '72%' : '100%'
  const defaultHeight =
    props.variant === 'circle'
      ? props.width ?? '48px'
      : props.variant === 'text'
        ? '14px'
        : '80px'

  return {
    width: isLastMultiLine && !props.width ? '72%' : props.width ?? defaultWidth,
    height: props.height ?? defaultHeight
  }
}
</script>

<style scoped>
.mfs-skeleton-group {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}

.mfs-skeleton-group--lines {
  gap: 8px;
}

.mfs-skeleton {
  --sk-base: rgba(100, 116, 139, 0.16);
  --sk-highlight: rgba(255, 255, 255, 0.45);
  position: relative;
  overflow: hidden;
  background-color: var(--sk-base);
}

.mfs-skeleton--text {
  border-radius: var(--radius-sm, 8px);
}

.mfs-skeleton--rect {
  border-radius: var(--radius, 14px);
}

.mfs-skeleton--circle {
  border-radius: 50%;
  flex-shrink: 0;
}

.mfs-skeleton--animated::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent 0%, var(--sk-highlight) 50%, transparent 100%);
  animation: mfs-shimmer 1.5s infinite;
}

@keyframes mfs-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Theme Overrides */
[data-theme="clay"] .mfs-skeleton {
  --sk-base: rgba(139, 92, 246, 0.12);
  --sk-highlight: rgba(255, 255, 255, 0.75);
  box-shadow: inset 2px 2px 4px rgba(109, 40, 217, 0.08);
}

[data-theme="glass"] .mfs-skeleton {
  --sk-base: rgba(255, 255, 255, 0.08);
  --sk-highlight: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme="neo"] .mfs-skeleton {
  --sk-base: #dce3ee;
  --sk-highlight: rgba(255, 255, 255, 0.65);
  box-shadow: var(--input-shadow);
}
</style>
