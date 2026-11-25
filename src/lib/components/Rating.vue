<template>
  <div class="rating-wrapper" :class="{ 'rating-wrapper--disabled mfs-disabled': disabled, 'rating-wrapper--readonly': readonly }">
    <span v-if="label" class="rating-label mfs-text">{{ label }}</span>

    <div
      class="rating-stars mfs-surface mfs-pill mfs-shadow mfs-focus-ring"
      role="slider"
      tabindex="0"
      :aria-label="label || 'Rating'"
      :aria-valuemin="0"
      :aria-valuemax="stars"
      :aria-valuenow="modelValue"
      @mouseleave="hoverValue = null"
      @keydown="onKeydown"
    >
      <button
        v-for="idx in stars"
        :key="idx"
        type="button"
        class="rating-star"
        :disabled="disabled"
        :aria-label="`Rate ${idx} of ${stars}`"
        @mousemove="onMouseMove(idx, $event)"
        @click="onClick(idx, $event)"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" class="rating-svg">
          <defs>
            <linearGradient :id="`${gradPrefix}-${idx}`" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stop-color="var(--warning, #f59e0b)" />
              <stop offset="50%" stop-color="transparent" />
            </linearGradient>
          </defs>
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            :fill="starFill(idx)"
            :stroke="starStroke(idx)"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    stars?: number
    allowHalf?: boolean
    readonly?: boolean
    disabled?: boolean
    label?: string
  }>(),
  {
    modelValue: 0,
    stars: 5,
    allowHalf: false,
    readonly: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const gradPrefix = `mfs-star-${useId()}`
const hoverValue = ref<number | null>(null)
const displayVal = computed(() => (hoverValue.value !== null ? hoverValue.value : props.modelValue))

const computeVal = (idx: number, e: MouseEvent) => {
  if (!props.allowHalf) return idx
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  return e.clientX - rect.left < rect.width / 2 ? idx - 0.5 : idx
}

const onMouseMove = (idx: number, e: MouseEvent) => {
  if (props.disabled || props.readonly) return
  hoverValue.value = computeVal(idx, e)
}

const onClick = (idx: number, e: MouseEvent) => {
  if (props.disabled || props.readonly) return
  const val = computeVal(idx, e)
  emit('update:modelValue', val)
  emit('change', val)
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled || props.readonly) return
  const step = props.allowHalf ? 0.5 : 1
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    const next = Math.min(props.stars, props.modelValue + step)
    emit('update:modelValue', next)
    emit('change', next)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    const next = Math.max(0, props.modelValue - step)
    emit('update:modelValue', next)
    emit('change', next)
  }
}

const starFill = (idx: number) => {
  const v = displayVal.value
  if (v >= idx) return 'var(--warning, #f59e0b)'
  if (props.allowHalf && v >= idx - 0.5) return `url(#${gradPrefix}-${idx})`
  return 'transparent'
}

const starStroke = (idx: number) => {
  const v = displayVal.value
  return v >= idx - 0.5 ? 'var(--warning, #f59e0b)' : 'var(--text-muted, #94a3b8)'
}
</script>

<style scoped>
.rating-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
}

.rating-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
}

.rating-stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--surface);
  border: var(--border-width, 1px) solid var(--border, transparent);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.rating-stars:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.rating-star {
  background: transparent;
  border: none;
  padding: 2px;
  cursor: pointer;
  display: inline-flex;
  transition: color 0.18s cubic-bezier(0.2, 0, 0, 1), opacity 0.18s cubic-bezier(0.2, 0, 0, 1);
}

.rating-wrapper--readonly .rating-star {
  cursor: default;
}

.rating-wrapper--disabled {
  opacity: 0.55;
  pointer-events: none;
}

[data-theme="clay"] .rating-stars {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .rating-stars {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .rating-stars {
  box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.55), -4px -4px 8px rgba(255, 255, 255, 0.85);
}
</style>
