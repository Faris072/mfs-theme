<template>
  <div class="num-wrapper mfs-flex mfs-flex-col mfs-gap-1-5 mfs-w-full" :class="{ 'num-wrapper--error': !!error, 'num-wrapper--disabled mfs-disabled': disabled }">
    <label v-if="label" :for="inputId" class="num-label mfs-text mfs-text-sm mfs-font-semibold mfs-flex mfs-items-center mfs-gap-1">
      {{ label }}
      <span v-if="required" class="num-required mfs-text-danger">*</span>
    </label>

    <div class="num-box mfs-surface mfs-rounded mfs-shadow-inset mfs-flex mfs-items-center mfs-gap-1-5">
      <button
        type="button"
        class="num-btn mfs-surface-subtle mfs-rounded-md mfs-shadow mfs-interactive mfs-inline-flex mfs-items-center mfs-justify-center mfs-shrink-0 mfs-border-none mfs-text"
        aria-label="Decrease value"
        :disabled="disabled || readonly || isAtMin"
        @click="stepBy(-1)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div class="num-input-area mfs-flex-1 mfs-flex mfs-items-center mfs-gap-1 mfs-px-1">
        <span v-if="prefix" class="num-prefix mfs-shrink-0 mfs-text-muted mfs-font-semibold mfs-select-none">{{ prefix }}</span>
        <input
          :id="inputId"
          type="text"
          inputmode="decimal"
          :value="displayValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :aria-invalid="!!error"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="modelValue ?? undefined"
          role="spinbutton"
          class="num-field mfs-font-mono mfs-w-full mfs-bg-transparent mfs-border-none mfs-outline-none mfs-text-center mfs-text mfs-py-2"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @keydown.up.prevent="stepBy(1)"
          @keydown.down.prevent="stepBy(-1)"
        />
      </div>

      <button
        type="button"
        class="num-btn mfs-surface-subtle mfs-rounded-md mfs-shadow mfs-interactive mfs-inline-flex mfs-items-center mfs-justify-center mfs-shrink-0 mfs-border-none mfs-text"
        aria-label="Increase value"
        :disabled="disabled || readonly || isAtMax"
        @click="stepBy(1)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>

    <p v-if="error" class="num-msg num-msg--error mfs-text-danger mfs-font-medium mfs-m-0">{{ error }}</p>
    <p v-else-if="hint" class="num-msg mfs-caption mfs-m-0">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    id?: string
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    min?: number
    max?: number
    step?: number
    decimals?: number
    prefix?: string
  }>(),
  {
    modelValue: null,
    placeholder: '0',
    required: false,
    disabled: false,
    readonly: false,
    step: 1,
    decimals: 0
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'change', value: number | null): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id || `mfs-num-${fallbackId}`)
const isFocused = ref(false)
const draft = ref('')

const clamp = (val: number): number => {
  let next = val
  if (props.min !== undefined) next = Math.max(props.min, next)
  if (props.max !== undefined) next = Math.min(props.max, next)
  const factor = Math.pow(10, props.decimals)
  return Math.round(next * factor) / factor
}

const isAtMin = computed(() => props.min !== undefined && props.modelValue !== null && props.modelValue <= props.min)
const isAtMax = computed(() => props.max !== undefined && props.modelValue !== null && props.modelValue >= props.max)

const displayValue = computed(() => {
  if (isFocused.value) return draft.value
  if (props.modelValue === null || props.modelValue === undefined || Number.isNaN(props.modelValue)) return ''
  return props.decimals > 0 ? props.modelValue.toFixed(props.decimals) : String(props.modelValue)
})

const handleFocus = () => {
  isFocused.value = true
  draft.value = props.modelValue !== null && props.modelValue !== undefined ? String(props.modelValue) : ''
}

const handleInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value
  draft.value = raw
  if (raw.trim() === '' || raw === '-') {
    if (raw.trim() === '') emit('update:modelValue', null)
    return
  }
  const parsed = Number(raw)
  if (!Number.isNaN(parsed)) {
    emit('update:modelValue', parsed)
  }
}

const handleBlur = () => {
  isFocused.value = false
  if (draft.value.trim() === '') {
    emit('update:modelValue', null)
    emit('change', null)
    return
  }
  const parsed = Number(draft.value)
  if (Number.isNaN(parsed)) {
    emit('update:modelValue', null)
    emit('change', null)
    return
  }
  const clamped = clamp(parsed)
  emit('update:modelValue', clamped)
  emit('change', clamped)
}

const stepBy = (dir: 1 | -1) => {
  if (props.disabled || props.readonly) return
  const base = props.modelValue ?? (props.min !== undefined ? props.min : 0)
  const next = clamp(base + dir * props.step)
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<style scoped>
.num-box {
  box-sizing: border-box;
  width: 100%;
  min-width: fit-content;
  padding: 4px 6px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.num-input-area {
  min-width: 5ch;
}

.num-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow);
}

.num-wrapper--error .num-box {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.25), var(--input-shadow);
}

.num-wrapper--disabled .num-box {
  opacity: 0.6;
  cursor: not-allowed;
}

.num-btn {
  width: 34px;
  height: 34px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.num-btn:hover:not(:disabled) {
  box-shadow: var(--clay-shadow-hover);
  color: var(--primary);
}

.num-btn:active:not(:disabled) {
  transform: scale(0.94);
  box-shadow: var(--clay-shadow-active);
}

.num-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.num-prefix {
  font-size: 0.9rem;
}

.num-field {
  flex: 1 1 0%;
  min-width: 4ch;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 0.95rem;
  font-variant-numeric: tabular-nums;
}

.num-field::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.num-msg {
  font-size: 0.8rem;
}

[data-theme="clay"] .num-btn {
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.08), inset 2px 2px 4px rgba(255, 255, 255, 0.8);
}

[data-theme="glass"] .num-box {
  border: 1px solid rgba(255, 255, 255, 0.22);
}

[data-theme="glass"] .num-btn {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .num-btn {
  box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.55), -3px -3px 6px rgba(255, 255, 255, 0.85);
}
</style>
