<template>
  <div class="mfs-progress">
    <div
      class="mfs-progress__track mfs-surface-subtle mfs-pill mfs-shadow-inset"
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : clampedValue"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="{ height }"
    >
      <div
        class="mfs-progress__bar mfs-pill"
        :class="[
          `mfs-progress__bar--${variant}`,
          { 'mfs-progress__bar--indeterminate': indeterminate }
        ]"
        :style="indeterminate ? undefined : { width: `${clampedValue}%` }"
      />
    </div>
    <span v-if="showValue && !indeterminate" class="mfs-progress__label mfs-caption">
      {{ Math.round(clampedValue) }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: number
    indeterminate?: boolean
    showValue?: boolean
    variant?: 'primary' | 'success' | 'warning' | 'danger'
    height?: string
  }>(),
  {
    value: 0,
    indeterminate: false,
    showValue: false,
    variant: 'primary',
    height: '10px'
  }
)

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<style scoped>
.mfs-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.mfs-progress__track {
  flex: 1;
  width: 100%;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--surface-subtle);
  box-shadow: var(--input-shadow);
  overflow: hidden;
  position: relative;
}

.mfs-progress__bar {
  height: 100%;
  border-radius: var(--radius-pill, 9999px);
  transition: width 0.3s ease;
  background-color: var(--primary);
}

.mfs-progress__bar--primary { background-color: var(--primary); }
.mfs-progress__bar--success { background-color: var(--success); }
.mfs-progress__bar--warning { background-color: var(--warning); }
.mfs-progress__bar--danger { background-color: var(--danger); }

.mfs-progress__bar--indeterminate {
  width: 40%;
  position: absolute;
  top: 0;
  left: 0;
  animation: mfs-progress-slide 1.4s ease-in-out infinite;
}

.mfs-progress__label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  min-width: 38px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

@keyframes mfs-progress-slide {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(120%);
  }
  100% {
    transform: translateX(260%);
  }
}

/* Theme Overrides */
[data-theme="clay"] .mfs-progress__bar {
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.4);
}

[data-theme="glass"] .mfs-progress__track {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

[data-theme="neo"] .mfs-progress__track {
  box-shadow: var(--input-shadow);
}
</style>
