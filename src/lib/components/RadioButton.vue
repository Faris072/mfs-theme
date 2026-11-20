<template>
  <label class="radio mfs-text" :class="{ 'radio--disabled': disabled }">
    <input
      :id="id"
      type="radio"
      class="radio__input"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="radio__circle mfs-surface mfs-shadow" :class="{ 'radio__circle--checked': isChecked }">
      <span class="radio__dot" />
    </span>
    <span v-if="label || $slots.default" class="radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: any
    value: any
    name?: string
    label?: string
    disabled?: boolean
    id?: string
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>

<style scoped>
.radio {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 0.95rem;
  color: var(--text);
  font-weight: 500;
  min-height: 28px;
}

.radio--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio__circle {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--clay-shadow);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.radio__input:focus-visible + .radio__circle {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.radio__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary-text, #ffffff);
  transform: scale(0);
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.radio__circle--checked {
  background-color: var(--primary);
  border-color: var(--primary);
  box-shadow: var(--clay-shadow-hover);
}

.radio__circle--checked .radio__dot {
  transform: scale(1);
}

[data-theme="clay"] .radio__circle {
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.08), inset 2px 2px 4px rgba(255, 255, 255, 0.85);
}

[data-theme="clay"] .radio__circle--checked {
  box-shadow: 3px 5px 12px rgba(124, 58, 237, 0.35), inset 2px 2px 4px rgba(255, 255, 255, 0.45);
}

[data-theme="glass"] .radio__circle {
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: var(--backdrop-blur, blur(8px));
}

[data-theme="neo"] .radio__circle {
  box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.55), -3px -3px 6px rgba(255, 255, 255, 0.85);
}

[data-theme="neo"] .radio__circle--checked {
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2), 2px 2px 6px rgba(163, 177, 198, 0.4);
}
</style>
