<template>
  <div ref="rootRef" class="dp-wrapper" :class="{ 'dp-wrapper--error': !!error, 'dp-wrapper--disabled mfs-disabled': disabled }">
    <label v-if="label" class="dp-label mfs-text">
      {{ label }}
      <span v-if="required" class="dp-required mfs-text-danger">*</span>
    </label>

    <div class="dp-container">
      <button
        type="button"
        class="dp-trigger mfs-surface mfs-rounded mfs-shadow-inset"
        :disabled="disabled"
        :aria-expanded="isOpen"
        :aria-invalid="!!error"
        @click="isOpen = !isOpen"
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dp-icon">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span class="dp-value" :class="{ 'dp-value--placeholder': !formattedValue }">
          {{ formattedValue || placeholder }}
        </span>
      </button>

      <Transition name="dp-pop">
        <div v-if="isOpen" class="dp-popover mfs-surface mfs-rounded mfs-blur mfs-shadow" role="dialog" aria-label="Calendar">
          <div class="dp-header">
            <button type="button" class="dp-nav mfs-surface-subtle mfs-rounded-md mfs-interactive" aria-label="Previous month" @click="shiftMonth(-1)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span class="dp-month-year">{{ monthLabel }} {{ viewYear }}</span>
            <button type="button" class="dp-nav mfs-surface-subtle mfs-rounded-md mfs-interactive" aria-label="Next month" @click="shiftMonth(1)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div class="dp-weekdays">
            <span v-for="d in weekdays" :key="d" class="dp-weekday">{{ d }}</span>
          </div>

          <Transition name="dp-fade" mode="out-in">
            <div :key="`${viewYear}-${viewMonth}`" class="dp-grid">
              <button
                v-for="cell in calendarCells"
                :key="cell.key"
                type="button"
                class="dp-day"
                :class="{
                  'dp-day--muted': !cell.inMonth,
                  'dp-day--selected': isDaySelected(cell.date),
                  'dp-day--in-range': isInRange(cell.date),
                  'dp-day--today': isSameDay(cell.date, today)
                }"
                :disabled="isDisabledDay(cell.date)"
                @click="selectDate(cell.date)"
              >
                {{ cell.date.getDate() }}
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <p v-if="error" class="dp-msg dp-msg--error mfs-text-danger">{{ error }}</p>
    <p v-else-if="hint" class="dp-msg mfs-caption">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type DateInput = Date | string

const props = withDefaults(
  defineProps<{
    modelValue?: DateInput | [DateInput, DateInput] | null
    range?: boolean
    min?: DateInput
    max?: DateInput
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    range: false,
    placeholder: 'Select date',
    required: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | [Date, Date] | null): void
  (e: 'change', value: Date | [Date, Date] | null): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const today = new Date()

const toDate = (v?: DateInput | null): Date | null => {
  if (!v) return null
  const d = v instanceof Date ? new Date(v.getTime()) : new Date(v)
  return Number.isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const initialRef = computed(() => {
  if (Array.isArray(props.modelValue)) return toDate(props.modelValue[0]) || today
  return toDate(props.modelValue) || today
})

const viewYear = ref(initialRef.value.getFullYear())
const viewMonth = ref(initialRef.value.getMonth())
const rangeStart = ref<Date | null>(null)

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthLabel = computed(() => months[viewMonth.value])

const shiftMonth = (delta: number) => {
  const next = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = next.getFullYear()
  viewMonth.value = next.getMonth()
}

const calendarCells = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const startOffset = firstDay.getDay()
  const cells: { key: string; date: Date; inMonth: boolean }[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(viewYear.value, viewMonth.value, 1 - startOffset + i)
    cells.push({
      key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      date: d,
      inMonth: d.getMonth() === viewMonth.value
    })
  }
  return cells
})

const isSameDay = (a: Date | null, b: Date | null) =>
  Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate())

const minDate = computed(() => toDate(props.min))
const maxDate = computed(() => toDate(props.max))

const isDisabledDay = (d: Date) => {
  if (minDate.value && d < minDate.value) return true
  if (maxDate.value && d > maxDate.value) return true
  return false
}

const selectedSingle = computed(() => (!props.range && !Array.isArray(props.modelValue) ? toDate(props.modelValue) : null))
const selectedRange = computed<[Date | null, Date | null]>(() => {
  if (!props.range) return [null, null]
  if (rangeStart.value) return [rangeStart.value, null]
  if (Array.isArray(props.modelValue)) return [toDate(props.modelValue[0]), toDate(props.modelValue[1])]
  return [null, null]
})

const isDaySelected = (d: Date) => {
  if (!props.range) return isSameDay(d, selectedSingle.value)
  const [s, e] = selectedRange.value
  return isSameDay(d, s) || isSameDay(d, e)
}

const isInRange = (d: Date) => {
  if (!props.range) return false
  const [s, e] = selectedRange.value
  return Boolean(s && e && d > s && d < e)
}

const fmt = (d: Date | null) =>
  d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : ''

const formattedValue = computed(() => {
  if (!props.range) return fmt(selectedSingle.value)
  if (Array.isArray(props.modelValue)) {
    const s = fmt(toDate(props.modelValue[0]))
    const e = fmt(toDate(props.modelValue[1]))
    return s && e ? `${s} – ${e}` : s
  }
  return ''
})

const selectDate = (d: Date) => {
  if (isDisabledDay(d)) return
  if (!props.range) {
    emit('update:modelValue', d)
    emit('change', d)
    isOpen.value = false
    return
  }
  if (!rangeStart.value) {
    rangeStart.value = d
  } else {
    const pair: [Date, Date] = d < rangeStart.value ? [d, rangeStart.value] : [rangeStart.value, d]
    rangeStart.value = null
    emit('update:modelValue', pair)
    emit('change', pair)
    isOpen.value = false
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) isOpen.value = false
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.dp-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.dp-wrapper--disabled {
  opacity: 0.55;
  pointer-events: none;
}

.dp-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 4px;
}

.dp-required {
  color: var(--danger);
}

.dp-container {
  position: relative;
}

.dp-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  border-radius: var(--radius, 14px);
  box-shadow: var(--input-shadow);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  backdrop-filter: var(--backdrop-blur, none);
}

.dp-wrapper--error .dp-trigger {
  border-color: var(--danger);
}

.dp-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.dp-value--placeholder {
  color: var(--text-muted);
  opacity: 0.75;
}

.dp-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 45;
  width: min(300px, 92vw);
  padding: 12px;
  border-radius: var(--radius, 16px);
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--clay-shadow-hover);
  backdrop-filter: var(--backdrop-blur, blur(14px));
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dp-month-year {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
}

.dp-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-sm, 10px);
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.14));
  color: var(--text);
  cursor: pointer;
}

.dp-weekdays,
.dp-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.dp-weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 4px 0;
}

.dp-day {
  min-width: 36px;
  min-height: 36px;
  border: none;
  border-radius: var(--radius-sm, 10px);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.dp-day:hover:not(:disabled) {
  background-color: var(--surface-subtle, rgba(139, 92, 246, 0.14));
}

.dp-day--muted {
  color: var(--text-muted);
  opacity: 0.45;
}

.dp-day--today {
  border: 1px solid var(--primary);
}

.dp-day--in-range {
  background-color: rgba(139, 92, 246, 0.16);
}

.dp-day--selected {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
  font-weight: 700;
}

.dp-day:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.dp-msg {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.dp-msg--error {
  color: var(--danger);
  font-weight: 500;
}

.dp-pop-enter-active,
.dp-pop-leave-active,
.dp-fade-enter-active,
.dp-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.dp-pop-enter-from,
.dp-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.dp-fade-enter-from,
.dp-fade-leave-to {
  opacity: 0;
}

[data-theme="clay"] .dp-day--selected {
  box-shadow: 2px 4px 8px rgba(124, 58, 237, 0.35);
}

[data-theme="glass"] .dp-trigger,
[data-theme="glass"] .dp-popover {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .dp-trigger {
  box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}
</style>
