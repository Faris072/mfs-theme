<template>
  <div class="meter-group mfs-card">
    <div
      class="meter-group__track mfs-inset mfs-pill"
      role="progressbar"
      :aria-valuenow="totalValue"
      aria-valuemin="0"
      :aria-valuemax="max"
    >
      <div
        v-for="(item, index) in values"
        :key="item.label"
        class="meter-group__segment"
        :style="{
          width: `${getPercent(item.value)}%`,
          backgroundColor: item.color || getDefaultColor(index)
        }"
        :title="`${item.label}: ${item.value}`"
      />
    </div>

    <ol v-if="showLegend" class="meter-group__legend">
      <li v-for="(item, index) in values" :key="item.label" class="meter-group__legend-item">
        <span
          class="meter-group__dot mfs-pill"
          :style="{ backgroundColor: item.color || getDefaultColor(index) }"
          aria-hidden="true"
        />
        <span class="meter-group__label mfs-text">{{ item.label }}</span>
        <span class="meter-group__value mfs-text-muted">{{ item.value }} ({{ Math.round(getPercent(item.value)) }}%)</span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface MeterItem {
  label: string
  value: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    values: MeterItem[]
    max?: number
    showLegend?: boolean
  }>(),
  {
    max: 100,
    showLegend: true
  }
)

const palette = [
  'var(--primary)',
  'var(--secondary)',
  'var(--success)',
  'var(--warning)',
  'var(--danger)'
]

const totalValue = computed(() =>
  props.values.reduce((sum, item) => sum + Math.max(0, item.value), 0)
)

function getPercent(val: number): number {
  const safeMax = props.max > 0 ? props.max : 100
  return Math.min(100, Math.max(0, (val / safeMax) * 100))
}

function getDefaultColor(index: number): string {
  return palette[index % palette.length]
}
</script>

<style scoped>
.meter-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.meter-group__track {
  display: flex;
  width: 100%;
  height: 14px;
  overflow: hidden;
  padding: 2px;
  gap: 2px;
}

.meter-group__segment {
  height: 100%;
  border-radius: var(--radius-pill, 9999px);
  transition: width 0.3s ease;
}

.meter-group__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.meter-group__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.meter-group__dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
}

.meter-group__label {
  font-weight: 600;
}

[data-theme="clay"] .meter-group__segment {
  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.45);
}

[data-theme="glass"] .meter-group__track {
  background: rgba(255, 255, 255, 0.06);
}

[data-theme="neo"] .meter-group__track {
  box-shadow: var(--input-shadow);
}
</style>
