<template>
  <div
    class="mfs-chart mfs-surface mfs-rounded mfs-shadow-card mfs-blur mfs-flex mfs-flex-col mfs-gap-3 mfs-p-4"
    :style="chartFilterVars"
    :aria-busy="loading || undefined"
  >
    <div
      class="mfs-chart__canvas mfs-relative mfs-w-full"
      :style="loading && isEmpty ? { minHeight: `${height}px` } : undefined"
    >
      <div v-if="loading" class="mfs-loading-overlay" role="status" aria-live="polite">
        <slot name="loading">
          <span class="mfs-spinner" aria-hidden="true" />
        </slot>
      </div>

      <div
        v-if="!loading && isEmpty"
        class="mfs-empty-state"
        :style="{ minHeight: `${height}px` }"
      >
        <slot name="empty">{{ emptyText }}</slot>
      </div>

      <svg
        v-else
        class="mfs-chart__svg"
        :viewBox="`0 0 ${W} ${H}`"
        role="img"
        :aria-label="`${type} chart`"
      >
        <defs>
          <!-- Claymorphism 3D puffy filter (outer soft shadow + inner top-left highlight + inner bottom-right shade) -->
          <filter :id="clayFilterId" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="dropBlur" />
            <feOffset dx="2" dy="5" in="dropBlur" result="dropOffset" />
            <feFlood flood-color="#4c1d95" flood-opacity="0.24" result="dropColor" />
            <feComposite in="dropColor" in2="dropOffset" operator="in" result="dropShadow" />

            <feOffset dx="2" dy="2.5" in="SourceAlpha" result="hlOffset" />
            <feGaussianBlur stdDeviation="2" in="hlOffset" result="hlBlur" />
            <feComposite operator="out" in="SourceAlpha" in2="hlBlur" result="hlEdge" />
            <feFlood flood-color="#ffffff" flood-opacity="0.72" result="hlColor" />
            <feComposite operator="in" in="hlColor" in2="hlEdge" result="innerHighlight" />

            <feOffset dx="-2" dy="-2.5" in="SourceAlpha" result="shOffset" />
            <feGaussianBlur stdDeviation="2.2" in="shOffset" result="shBlur" />
            <feComposite operator="out" in="SourceAlpha" in2="shBlur" result="shEdge" />
            <feFlood flood-color="#1e1b4b" flood-opacity="0.28" result="shColor" />
            <feComposite operator="in" in="shColor" in2="shEdge" result="innerShade" />

            <feMerge>
              <feMergeNode in="dropShadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="innerShade" />
              <feMergeNode in="innerHighlight" />
            </feMerge>
          </filter>

          <!-- Tighter 3D clay filter for smaller line points & strokes -->
          <filter :id="clayPointFilterId" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="dropBlur" />
            <feOffset dx="1.5" dy="2.5" in="dropBlur" result="dropOffset" />
            <feFlood flood-color="#4c1d95" flood-opacity="0.26" result="dropColor" />
            <feComposite in="dropColor" in2="dropOffset" operator="in" result="dropShadow" />

            <feOffset dx="1.2" dy="1.4" in="SourceAlpha" result="hlOffset" />
            <feGaussianBlur stdDeviation="1.1" in="hlOffset" result="hlBlur" />
            <feComposite operator="out" in="SourceAlpha" in2="hlBlur" result="hlEdge" />
            <feFlood flood-color="#ffffff" flood-opacity="0.8" result="hlColor" />
            <feComposite operator="in" in="hlColor" in2="hlEdge" result="innerHighlight" />

            <feOffset dx="-1.2" dy="-1.4" in="SourceAlpha" result="shOffset" />
            <feGaussianBlur stdDeviation="1.2" in="shOffset" result="shBlur" />
            <feComposite operator="out" in="SourceAlpha" in2="shBlur" result="shEdge" />
            <feFlood flood-color="#1e1b4b" flood-opacity="0.3" result="shColor" />
            <feComposite operator="in" in="shColor" in2="shEdge" result="innerShade" />

            <feMerge>
              <feMergeNode in="dropShadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="innerShade" />
              <feMergeNode in="innerHighlight" />
            </feMerge>
          </filter>

          <!-- Glossy top-left sheen gradient for clay overlays -->
          <linearGradient :id="clayGlossId" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
            <stop offset="55%" stop-color="#ffffff" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>

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
            v-for="(label, idx) in labels"
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
          <template v-for="(ds, dsIdx) in datasets" :key="dsIdx">
            <g v-for="(val, idx) in ds.data" :key="idx">
              <rect
                :x="getBarX(idx, dsIdx)"
                :y="getY(val)"
                :width="barWidth"
                :height="Math.max(2, H - PAD_B - getY(val))"
                :fill="ds.color || palette[dsIdx % palette.length]"
                rx="4"
                class="mfs-chart__bar"
                @mouseenter="showTip($event, `${labels[idx] ?? idx}: ${val}`)"
                @mouseleave="tip = null"
              />
              <rect
                :x="getBarX(idx, dsIdx) + 2"
                :y="getY(val) + 2"
                :width="Math.max(0, barWidth - 4)"
                :height="Math.max(0, Math.min(14, (H - PAD_B - getY(val)) * 0.45))"
                :fill="`url(#${clayGlossId})`"
                rx="4"
                class="mfs-chart__clay-gloss"
              />
            </g>
          </template>
        </template>

        <!-- Line Chart -->
        <template v-else-if="type === 'line'">
          <template v-for="(ds, dsIdx) in datasets" :key="dsIdx">
            <polyline
              fill="none"
              :stroke="ds.color || palette[dsIdx % palette.length]"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              :points="getLinePoints(ds.data)"
              class="mfs-chart__line"
            />
            <g v-for="(val, idx) in ds.data" :key="idx">
              <circle
                :cx="getX(idx)"
                :cy="getY(val)"
                r="5"
                :fill="ds.color || palette[dsIdx % palette.length]"
                class="mfs-chart__point"
                @mouseenter="showTip($event, `${labels[idx] ?? idx}: ${val}`)"
                @mouseleave="tip = null"
              />
              <circle
                :cx="getX(idx) - 1.5"
                :cy="getY(val) - 1.5"
                r="1.6"
                fill="#ffffff"
                fill-opacity="0.7"
                class="mfs-chart__clay-gloss"
              />
            </g>
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
            <path
              v-for="(seg, idx) in pieSegments"
              :key="`gloss-${idx}`"
              :d="seg.d"
              :fill="`url(#${clayGlossId})`"
              class="mfs-chart__clay-gloss"
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

    <div v-if="!isEmpty && legendItems.length > 0" class="mfs-chart__legend mfs-flex mfs-flex-wrap mfs-gap-3 mfs-justify-center">
      <span
        v-for="(item, idx) in legendItems"
        :key="idx"
        class="mfs-chart__legend-item mfs-caption mfs-inline-flex mfs-items-center mfs-gap-1-5"
      >
        <span class="mfs-chart__swatch mfs-rounded-full" :style="{ backgroundColor: item.color }" />
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
    data?: ChartData | null
    height?: number
    loading?: boolean
    emptyText?: string
  }>(),
  {
    type: 'bar',
    data: null,
    height: 240,
    loading: false,
    emptyText: 'No chart data'
  }
)

const labels = computed(() => props.data?.labels ?? [])
const datasets = computed(() => props.data?.datasets ?? [])
const isEmpty = computed(() => {
  if (datasets.value.length === 0) return true
  return datasets.value.every((d) => !d.data || d.data.length === 0)
})

const W = 480
const H = computed(() => props.height)
const PAD_L = 24
const PAD_R = 24
const PAD_T = 20
const PAD_B = 30

const chartInstanceId = Math.random().toString(36).slice(2, 8)
const clayFilterId = `mfs-chart-clay-${chartInstanceId}`
const clayPointFilterId = `mfs-chart-clay-pt-${chartInstanceId}`
const clayGlossId = `mfs-chart-clay-gloss-${chartInstanceId}`
const chartFilterVars = {
  '--mfs-clay-filter': `url(#${clayFilterId})`,
  '--mfs-clay-point-filter': `url(#${clayPointFilterId})`
}

const palette = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#38bdf8']
const tip = ref<{ x: number; y: number; text: string } | null>(null)

const maxVal = computed(() => {
  const all = datasets.value.flatMap((d) => d.data)
  return Math.max(1, ...all)
})

const getX = (idx: number) => {
  const count = Math.max(1, labels.value.length)
  const plotW = W - PAD_L - PAD_R
  if (count === 1) return PAD_L + plotW / 2
  return PAD_L + (plotW * (idx + 0.5)) / count
}

const getY = (val: number) => {
  const plotH = H.value - PAD_T - PAD_B
  return PAD_T + plotH - (val / maxVal.value) * plotH
}

const barWidth = computed(() => {
  const count = Math.max(1, labels.value.length)
  const dsCount = Math.max(1, datasets.value.length)
  const groupW = (W - PAD_L - PAD_R) / count
  return Math.max(6, Math.min(34, (groupW * 0.68) / dsCount))
})

const getBarX = (idx: number, dsIdx: number) => {
  const dsCount = Math.max(1, datasets.value.length)
  const totalW = dsCount * barWidth.value + (dsCount - 1) * 4
  return getX(idx) - totalW / 2 + dsIdx * (barWidth.value + 4)
}

const getLinePoints = (values: number[]) =>
  values.map((v, i) => `${getX(i)},${getY(v)}`).join(' ')

const pieSegments = computed(() => {
  const ds = datasets.value[0]
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
      label: labels.value[idx] ?? `Item ${idx + 1}`,
      color: palette[idx % palette.length]
    }
  })
})

const legendItems = computed(() => {
  if (props.type === 'pie' || props.type === 'doughnut') {
    return labels.value.map((label, idx) => ({
      label,
      color: palette[idx % palette.length]
    }))
  }
  return datasets.value.map((ds, idx) => ({
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
.mfs-chart__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
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
  transition: opacity 0.15s ease, transform 0.18s ease, filter 0.18s ease;
}

.mfs-chart__bar:hover,
.mfs-chart__point:hover,
.mfs-chart__slice:hover {
  opacity: 0.85;
}

.mfs-chart__clay-gloss {
  display: none;
  pointer-events: none;
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

.mfs-chart__legend-item {
  font-size: 0.8rem;
  font-weight: 600;
}

.mfs-chart__swatch {
  width: 10px;
  height: 10px;
}

/* Claymorphism: 3D puffy/tactile bars, slices, points & glossy highlight */
[data-theme="clay"] .mfs-chart__bar {
  rx: 8px;
  filter: var(--mfs-clay-filter);
}

[data-theme="clay"] .mfs-chart__slice {
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 1.25px;
  filter: var(--mfs-clay-filter);
}

[data-theme="clay"] .mfs-chart__line {
  stroke-width: 4px;
  filter: var(--mfs-clay-point-filter);
}

[data-theme="clay"] .mfs-chart__point {
  r: 6px;
  filter: var(--mfs-clay-point-filter);
}

[data-theme="clay"] .mfs-chart__clay-gloss {
  display: block;
}

[data-theme="clay"] .mfs-chart__swatch {
  box-shadow:
    1px 2px 4px rgba(109, 40, 217, 0.22),
    inset -1px -1px 2px rgba(30, 27, 75, 0.2),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* Glassmorphism: translucent frosted fills + crisp white border */
[data-theme="glass"] .mfs-chart__bar,
[data-theme="glass"] .mfs-chart__slice {
  fill-opacity: 0.76;
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 1.25px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.28));
}

[data-theme="glass"] .mfs-chart__point {
  fill-opacity: 0.85;
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 1.5px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
}

[data-theme="glass"] .mfs-chart__line {
  stroke-opacity: 0.9;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
}

/* Neumorphism: soft dual-shadow depth */
[data-theme="neo"] .mfs-chart {
  border: none;
}

[data-theme="neo"] .mfs-chart__bar,
[data-theme="neo"] .mfs-chart__slice,
[data-theme="neo"] .mfs-chart__point {
  filter: drop-shadow(3px 3px 5px rgba(163, 177, 198, 0.55))
    drop-shadow(-2px -2px 4px rgba(255, 255, 255, 0.85));
}

[data-theme="neo"] .mfs-chart__line {
  filter: drop-shadow(2px 2px 3px rgba(163, 177, 198, 0.5));
}

/* Neubrutalism: crisp dark stroke + hard offset drop shadow */
[data-theme="brutalism"] .mfs-chart__bar {
  rx: 0px;
  stroke: #0f172a;
  stroke-width: 2.25px;
  filter: drop-shadow(3px 3px 0px #0f172a);
}

[data-theme="brutalism"] .mfs-chart__slice,
[data-theme="brutalism"] .mfs-chart__point {
  stroke: #0f172a;
  stroke-width: 2px;
  filter: drop-shadow(2.5px 2.5px 0px #0f172a);
}

[data-theme="brutalism"] .mfs-chart__line {
  stroke-width: 3.5px;
  filter: drop-shadow(2px 2px 0px #0f172a);
}

/* Cyberpunk: subtle neon glow */
[data-theme="cyberpunk"] .mfs-chart__bar,
[data-theme="cyberpunk"] .mfs-chart__slice {
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 1px;
  filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.5));
}

[data-theme="cyberpunk"] .mfs-chart__point,
[data-theme="cyberpunk"] .mfs-chart__line {
  filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.55));
}
</style>
