<template>
  <div class="pwd-wrapper mfs-flex mfs-flex-col mfs-w-full" :class="{ 'pwd-wrapper--error': !!error, 'pwd-wrapper--disabled mfs-disabled': disabled }">
    <label v-if="label" :for="inputId" class="pwd-label mfs-text mfs-text-sm mfs-font-semibold mfs-flex mfs-items-center mfs-gap-1">
      {{ label }}
      <span v-if="required" class="mfs-text-danger">*</span>
    </label>

    <div class="pwd-box mfs-flex mfs-items-center mfs-surface mfs-rounded mfs-shadow-inset">
      <input
        :id="inputId"
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="!!error"
        class="pwd-field mfs-flex-1 mfs-border-none mfs-text"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />

      <button
        type="button"
        class="pwd-toggle mfs-inline-flex mfs-items-center mfs-justify-center mfs-border-none mfs-rounded-sm mfs-text-muted"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        :aria-pressed="visible"
        :disabled="disabled"
        @click="visible = !visible"
      >
        <svg v-if="visible" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>

    <div v-if="showStrength && modelValue" class="pwd-strength mfs-flex mfs-items-center mfs-gap-2" aria-live="polite">
      <div class="pwd-bars mfs-flex-1">
        <span
          v-for="idx in 4"
          :key="idx"
          class="pwd-bar mfs-pill"
          :class="{ 'pwd-bar--active': idx <= strength.score }"
          :style="{ backgroundColor: idx <= strength.score ? strength.color : undefined }"
        />
      </div>
      <span class="pwd-strength-label mfs-text-xs mfs-font-semibold mfs-text-right" :style="{ color: strength.color }">{{ strength.label }}</span>
    </div>

    <p v-if="error" class="pwd-msg pwd-msg--error mfs-text-danger">{{ error }}</p>
    <p v-else-if="hint" class="pwd-msg mfs-caption">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    id?: string
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    showStrength?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    required: false,
    disabled: false,
    readonly: false,
    showStrength: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id || `mfs-pwd-${fallbackId}`)
const visible = ref(false)

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const strength = computed(() => {
  const val = props.modelValue || ''
  let score = 0
  if (val.length >= 6) score++
  if (val.length >= 10) score++
  if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++
  if (/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++
  score = Math.max(1, Math.min(4, score))

  const map: Record<number, { label: string; color: string }> = {
    1: { label: 'Weak', color: 'var(--danger, #f43f5e)' },
    2: { label: 'Fair', color: 'var(--warning, #f59e0b)' },
    3: { label: 'Good', color: 'var(--primary)' },
    4: { label: 'Strong', color: 'var(--success, #10b981)' }
  }
  return { score, ...map[score] }
})
</script>

<style scoped>
.pwd-wrapper {
  gap: 6px;
}

.pwd-box {
  padding: 2px 8px 2px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.pwd-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow);
}

.pwd-wrapper--error .pwd-box {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.25), var(--input-shadow);
}

.pwd-wrapper--disabled .pwd-box {
  opacity: 0.6;
  cursor: not-allowed;
}

.pwd-field {
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  padding: 10px 4px;
  min-width: 0;
}

.pwd-field::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.pwd-toggle {
  width: 34px;
  height: 34px;
  background: transparent;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.pwd-toggle:hover:not(:disabled) {
  color: var(--text);
  background-color: var(--surface-subtle, rgba(128, 128, 128, 0.1));
}

.pwd-toggle:disabled {
  cursor: not-allowed;
}

.pwd-bars {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.pwd-bar {
  height: 6px;
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.3));
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.pwd-strength-label {
  min-width: 44px;
}

.pwd-msg {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.pwd-msg--error {
  color: var(--danger);
  font-weight: 500;
}

[data-theme="clay"] .pwd-box {
  box-shadow: var(--input-shadow);
}

[data-theme="glass"] .pwd-box {
  border: 1px solid rgba(255, 255, 255, 0.22);
}

[data-theme="neo"] .pwd-box {
  box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

[data-theme="clay"] .pwd-bar {
  height: 8px;
  box-shadow: var(--input-shadow);
}

[data-theme="clay"] .pwd-bar--active {
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.14), inset 0 2px 3px rgba(255, 255, 255, 0.45), inset 0 -1px 2px rgba(0, 0, 0, 0.14);
}

[data-theme="neo"] .pwd-bar {
  height: 7px;
  box-shadow: inset 2px 2px 4px rgba(163, 177, 198, 0.5), inset -2px -2px 4px rgba(255, 255, 255, 0.8);
}

[data-theme="neo"] .pwd-bar--active {
  box-shadow: 2px 2px 4px rgba(163, 177, 198, 0.45), -1px -1px 3px rgba(255, 255, 255, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.35);
}

[data-theme="glass"] .pwd-bar {
  border: 1px solid rgba(255, 255, 255, 0.16);
}

[data-theme="brutalism"] .pwd-bar {
  height: 8px;
  border-radius: var(--radius, 4px);
  border: 2px solid var(--border);
}

[data-theme="brutalism"] .pwd-bar--active {
  box-shadow: 2px 2px 0 var(--border);
}
</style>
