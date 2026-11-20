<template>
  <div class="pwd-wrapper" :class="{ 'pwd-wrapper--error': !!error, 'pwd-wrapper--disabled mfs-disabled': disabled }">
    <label v-if="label" :for="inputId" class="pwd-label mfs-text">
      {{ label }}
      <span v-if="required" class="pwd-required mfs-text-danger">*</span>
    </label>

    <div class="pwd-box mfs-surface mfs-rounded mfs-shadow-inset">
      <input
        :id="inputId"
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="!!error"
        class="pwd-field"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />

      <button
        type="button"
        class="pwd-toggle"
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

    <div v-if="showStrength && modelValue" class="pwd-strength" aria-live="polite">
      <div class="pwd-bars">
        <span
          v-for="idx in 4"
          :key="idx"
          class="pwd-bar"
          :class="{ 'pwd-bar--active': idx <= strength.score }"
          :style="{ backgroundColor: idx <= strength.score ? strength.color : undefined }"
        />
      </div>
      <span class="pwd-strength-label" :style="{ color: strength.color }">{{ strength.label }}</span>
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
    3: { label: 'Good', color: 'var(--primary, #8b5cf6)' },
    4: { label: 'Strong', color: 'var(--success, #10b981)' }
  }
  return { score, ...map[score] }
})
</script>

<style scoped>
.pwd-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.pwd-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 4px;
}

.pwd-required {
  color: var(--danger);
}

.pwd-box {
  display: flex;
  align-items: center;
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  border-radius: var(--radius, 14px);
  box-shadow: var(--input-shadow);
  padding: 2px 8px 2px 14px;
  transition: all 0.25s ease;
  backdrop-filter: var(--backdrop-blur, none);
}

.pwd-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow);
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
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text);
  padding: 10px 4px;
  min-width: 0;
}

.pwd-field::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.pwd-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-sm, 10px);
  background: transparent;
  color: var(--text-muted);
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

.pwd-strength {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pwd-bars {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.pwd-bar {
  height: 5px;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.3));
  transition: background-color 0.25s ease;
}

.pwd-strength-label {
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 44px;
  text-align: right;
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
</style>
