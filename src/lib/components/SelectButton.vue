<template>
  <div class="sb-group mfs-surface mfs-rounded mfs-shadow-inset" role="group" :class="{ 'sb-group--disabled mfs-disabled': disabled }">
    <button
      v-for="(opt, idx) in normalizedOptions"
      :key="String(opt.value) + idx"
      type="button"
      class="sb-btn mfs-text mfs-focus-ring"
      :class="{ 'sb-btn--active mfs-shadow': isSelected(opt.value) }"
      :disabled="disabled || opt.disabled"
      :aria-pressed="isSelected(opt.value)"
      @click="toggle(opt)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface SelectButtonOption {
  label: string
  value: any
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: any | any[]
    options?: Array<string | SelectButtonOption>
    multiple?: boolean
    disabled?: boolean
  }>(),
  {
    options: () => [],
    multiple: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const normalizedOptions = computed<SelectButtonOption[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)

const isSelected = (val: any) => {
  if (props.multiple && Array.isArray(props.modelValue)) return props.modelValue.includes(val)
  return props.modelValue === val
}

const toggle = (opt: SelectButtonOption) => {
  if (props.disabled || opt.disabled) return
  if (props.multiple) {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : []
    const next = arr.includes(opt.value) ? arr.filter((v) => v !== opt.value) : [...arr, opt.value]
    emit('update:modelValue', next)
    emit('change', next)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
  }
}
</script>

<style scoped>
.sb-group { display: inline-flex; flex-wrap: wrap; gap: 4px; padding: 4px; }
.sb-group--disabled { opacity: 0.55; pointer-events: none; }
.sb-btn { border: none; background: transparent; padding: 8px 16px; border-radius: calc(var(--radius, 14px) - 4px); font-family: inherit; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.sb-btn:hover:not(:disabled):not(.sb-btn--active) { background-color: var(--surface-subtle); }
.sb-btn--active { background-color: var(--primary); color: var(--primary-text, #ffffff); }
.sb-btn:disabled { opacity: 0.45; cursor: not-allowed; }

[data-theme="clay"] .sb-btn--active { box-shadow: 3px 5px 12px rgba(124, 58, 237, 0.35), inset 2px 2px 4px rgba(255, 255, 255, 0.4); }
[data-theme="glass"] .sb-group { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .sb-group { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
[data-theme="neo"] .sb-btn--active { box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.55), -3px -3px 6px rgba(255, 255, 255, 0.85); }
</style>
