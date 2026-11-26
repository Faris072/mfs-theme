<template>
  <div class="input-wrapper" :class="{ 'input-wrapper--error': !!error, 'input-wrapper--disabled is-disabled': disabled }">
    <label v-if="label" class="input-label mfs-text">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>

    <div class="input-box mfs-surface mfs-rounded mfs-shadow-inset" :class="{ 'mfs-disabled': disabled }">
      <span v-if="$slots.prepend" class="input-affix mfs-text-muted input-affix--prepend">
        <slot name="prepend" />
      </span>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="input-field mfs-text"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />

      <span v-if="$slots.append" class="input-affix mfs-text-muted input-affix--append">
        <slot name="append" />
      </span>
    </div>

    <p v-if="error" class="input-msg input-msg--error mfs-text-danger">{{ error }}</p>
    <p v-else-if="hint" class="input-msg mfs-caption">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string | number
    id?: string
    type?: string
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
    readonly: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-required {
  color: var(--danger);
}

.input-box {
  display: flex;
  align-items: center;
  box-shadow: var(--input-shadow);
  padding: 2px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.input-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow);
}

.input-wrapper--error .input-box {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.25), var(--input-shadow);
}

.input-wrapper--disabled {
  cursor: not-allowed;
}

.input-wrapper--disabled .input-label {
  opacity: 0.72;
}

.input-wrapper--disabled .input-field {
  color: var(--text-muted);
}

.input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  padding: 10px 4px;
  width: 100%;
}

.input-field::placeholder {
  color: var(--text-muted, #64748b);
  opacity: 1;
}

.input-affix {
  display: inline-flex;
  align-items: center;
}

.input-msg {
  font-size: 0.8rem;
  margin-top: 2px;
}

.input-msg--error {
  color: var(--danger);
  font-weight: 500;
}
</style>
