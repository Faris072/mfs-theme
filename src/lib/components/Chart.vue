<template>
  <div class="mfs-chart mfs-surface mfs-rounded mfs-shadow-card mfs-blur">
    <div class="mfs-chart__canvas">
      <svg
        class="mfs-chart__svg"
        :viewBox="`0 0 ${W} ${H}`"
        role="img"
        :aria-label="`${type} chart`"
      >
        <!-- Gridlines for bar / line -->
        <template v-if="type === 'bar' || type === 'line'">
          <line
            v-for="tick in 4"
            :key="tick"
            :x1="PAD_L"
            :x2="W - PAD_R"
            :y1="PAD_T + ((H - PAD_T - PAD_B) * (tick - 1)) / 3"
            :y2="PAD_T + ((H - PAD_T - PAD_B) * (tick - 1)) / 3"
            class="mfs-chart__grid"
          />

          <!-- X Labels -->
          <text
            v-for="(label, idx) in data.labels"
            :key="idx"
            :x="getX(idx)"
            :y="H - 8"
            text-anchor="middle"
            class="mfs-chart__label"
          >
            {{ label }}
          </text>
        </template>

        <!-- Bar Chart -->
        <template v-if="type === 'bar'">
          <template v-for="(ds, dsIdx) in data.datasets" :key="dsIdx">
            <rect
              v-for="(val, idx) in ds.data"
              :key="idx"
              :x="getBarX(idx, dsIdx)"
              :y="getY(val)"
              :width="barWidth"
              :height="Math.max(2, H - PAD_B - getY(val))"
              :fill="ds.color || palette[dsIdx % palette.length]"
              rx="4"
              class="mfs-chart__bar"
              @mouseenter="showTip($event, `${data.labels[idx] ?? idx}: ${val}`)"
              @mouseleave="tip = null"
            />
          </template>
        </template>

        <!-- Line Chart -->
        <template v-else-if="type === 'line'">
          <template v-for="(ds, dsIdx) in data.datasets" :key="dsIdx">
            <polyline
              fill="none"
              :stroke="ds.color || palette[dsIdx % palette.length]"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              :points="getLinePoints(ds.data)"
            />
            <circle
              v-for="(val, idx) in ds.data"
              :key="idx"
              :cx="getX(idx)"
              :cy="getY(val)"
              r="5"
              :fill="ds.color || palette[dsIdx % palette.length]"
              class="mfs-chart__point"
              @mouseenter="showTip($event, `${data.labels[idx] ?? idx}: ${val}`)"
              @mouseleave="tip = null"
            />
          </template>
        </template>

        <!-- Pie / Doughnut Chart -->
        <template v-else>
          <g :transform="`translate(${W / 2}, ${H / 2})`">
            <path
              v-for="(seg, idx) in pieSegments"
              :key="idx"
              :d="seg.d"
              :fill="seg.color"
              class="mfs-chart__slice"
              @mouseenter="showTip($event, `${seg.label}: ${seg.value}`)"
              @mouseleave="tip = null"
            />
          </g>
        </template>
      </svg>

      <div
        v-if="tip"
        class="mfs-chart__tooltip mfs-rounded-sm"
        :style="{ left: `${tip.x}px`, top: `${tip.y}px` }"
      >
        {{ tip.text }}
      </div>
    </div>

    <div v-if="legendItems.length > 0" class="mfs-chart__legend">
      <span v-for="(item, idx) in legendItems" :key="idx" class="mfs-chart__legend-item mfs-text-muted">
        <span class="mfs-chart__swatch" :style="{ backgroundColor: item.color }" />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface ChartDataset {
  label?: string
  data: number[]
  color?: string
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

const props = withDefaults(
  defineProps<{
    type?: 'bar' | 'line' | 'pie' | 'doughnut'
    data: ChartData
    height?: number
  }>(),
  {
    type: 'bar',
    height: 240
  }
)

const W = 480
const H = computed(() => props.height)
const PAD_L = 24
const PAD_R = 24
const PAD_T = 20
const PAD_B = 30

const palette = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#38bdf8']
const tip = ref<{ x: number; y: number; text: string } | null>(null)

const maxVal = computed(() => {
  const all = props.data.datasets.flatMap((d) => d.data)
  return Math.max(1, ...all)
})

const getX = (idx: number) => {
  const count = Math.max(1, props.data.labels.length)
  const plotW = W - PAD_L - PAD_R
  if (count === 1) return PAD_L + plotW / 2
  return PAD_L + (plotW * (idx + 0.5)) / count
}

const getY = (val: number) => {
  const plotH = H.value - PAD_T - PAD_B
  return PAD_T + plotH - (val / maxVal.value) * plotH
}

const barWidth = computed(() => {
  const count = Math.max(1, props.data.labels.length)
  const dsCount = Math.max(1, props.data.datasets.length)
  const groupW = (W - PAD_L - PAD_R) / count
  return Math.max(6, Math.min(34, (groupW * 0.68) / dsCount))
})

const getBarX = (idx: number, dsIdx: number) => {
  const dsCount = Math.max(1, props.data.datasets.length)
  const totalW = dsCount * barWidth.value + (dsCount - 1) * 4
  return getX(idx) - totalW / 2 + dsIdx * (barWidth.value + 4)
}

const getLinePoints = (values: number[]) =>
  values.map((v, i) => `${getX(i)},${getY(v)}`).join(' ')

const pieSegments = computed(() => {
  const ds = props.data.datasets[0]
  if (!ds) return []
  const total = ds.data.reduce((a, b) => a + Math.max(0, b), 0) || 1
  const outerR = Math.min(W, H.value) * 0.4
  const innerR = props.type === 'doughnut' ? outerR * 0.55 : 0
  let angle = -Math.PI / 2

  return ds.data.map((val, idx) => {
    const slice = (Math.max(0, val) / total) * Math.PI * 2
    const end = angle + slice
    const large = slice > Math.PI ? 1 : 0
    const x1 = Math.cos(angle) * outerR
    const y1 = Math.sin(angle) * outerR
    const x2 = Math.cos(end) * outerR
    const y2 = Math.sin(end) * outerR

    let d = ''
    if (innerR > 0) {
      const ix1 = Math.cos(end) * innerR
      const iy1 = Math.sin(end) * innerR
      const ix2 = Math.cos(angle) * innerR
      const iy2 = Math.sin(angle) * innerR
      d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`
    } else {
      d = `M 0 0 L ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} Z`
    }
    angle = end
    return {
      d,
      value: val,
      label: props.data.labels[idx] ?? `Item ${idx + 1}`,
      color: palette[idx % palette.length]
    }
  })
})

const legendItems = computed(() => {
  if (props.type === 'pie' || props.type === 'doughnut') {
    return props.data.labels.map((label, idx) => ({
      label,
      color: palette[idx % palette.length]
    }))
  }
  return props.data.datasets.map((ds, idx) => ({
    label: ds.label ?? `Series ${idx + 1}`,
    color: ds.color ?? palette[idx % palette.length]
  }))
})

const showTip = (e: MouseEvent, text: string) => {
  const target = (e.currentTarget as SVGElement).closest('.mfs-chart__canvas') as HTMLElement | null
  if (!target) return
  const rect = target.getBoundingClientRect()
  tip.value = {
    x: e.clientX - rect.left + 10,
    y: e.clientY - rect.top - 28,
    text
  }
}
</script>

<style scoped>
.mfs-chart {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mfs-chart__canvas {
  position: relative;
  width: 100%;
}

.mfs-chart__svg {
  width: 100%;
  height: auto;
  display: block;
}

.mfs-chart__grid {
  stroke: var(--border, rgba(100, 116, 139, 0.2));
  stroke-dasharray: 4 4;
}

.mfs-chart__label {
  fill: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
}

.mfs-chart__bar,
.mfs-chart__point,
.mfs-chart__slice {
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.mfs-chart__bar:hover,
.mfs-chart__point:hover,
.mfs-chart__slice:hover {
  opacity: 0.82;
}

.mfs-chart__tooltip {
  position: absolute;
  pointer-events: none;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  background-color: #0f172a;
  color: #f8fafc;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.mfs-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.mfs-chart__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.mfs-chart__swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

[data-theme="neo"] .mfs-chart {
  border: none;
}
</style>
