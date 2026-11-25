<template>
  <label class="switch mfs-text" :class="{ 'switch--disabled mfs-disabled': disabled }">
    <input
      type="checkbox"
      class="switch__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="switch__track mfs-pill mfs-shadow-inset">
      <span class="switch__thumb mfs-shadow"></span>
    </span>
    <span v-if="label || $slots.default" class="switch__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}
</script>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 0.95rem;
  font-weight: 500;
}

.switch--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch__track {
  position: relative;
  width: 52px;
  height: 28px;
  background-color: var(--surface);
  border: var(--border-width, 1px) solid var(--border, transparent);
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
  display: flex;
  align-items: center;
  padding: 2px;
}

.switch__thumb {
  position: absolute;
  left: 3px;
  width: 22px;
  height: 22px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: left 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.switch__input:checked + .switch__track {
  background-color: var(--primary);
}

.switch__input:checked + .switch__track .switch__thumb {
  left: 27px;
  background-color: #ffffff;
}

[data-theme="clay"] .switch__input:checked + .switch__track {
  box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.22), inset -2px -2px 4px rgba(255, 255, 255, 0.3);
}

[data-theme="brutalism"] .switch__thumb {
  border: 2px solid var(--border);
  box-shadow: 1px 1px 0 var(--border);
}
</style>
