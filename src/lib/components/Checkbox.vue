<template>
  <label class="checkbox mfs-text" :class="{ 'checkbox--disabled mfs-disabled': disabled }">
    <input
      ref="inputRef"
      :id="id"
      type="checkbox"
      class="checkbox__input"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="checkbox__box mfs-surface mfs-shadow-inset" :class="{ 'checkbox__box--checked': isChecked || indeterminate }">
      <svg v-if="indeterminate" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="checkbox__icon">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <svg v-else-if="isChecked" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="checkbox__icon">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean | any[]
    value?: any
    indeterminate?: boolean
    label?: string
    disabled?: boolean
    id?: string
  }>(),
  {
    modelValue: false,
    indeterminate: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | any[]): void
  (e: 'change', value: boolean | any[]): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return Boolean(props.modelValue)
})

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
})

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
})

const handleChange = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  let next: boolean | any[]
  if (Array.isArray(props.modelValue)) {
    next = checked
      ? [...props.modelValue, props.value]
      : props.modelValue.filter((item) => item !== props.value)
  } else {
    next = checked
  }
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<style scoped>
.checkbox {
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

.checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox__box {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm, 8px);
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--input-shadow);
  color: var(--primary-text, #ffffff);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.checkbox__input:focus-visible + .checkbox__box {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.checkbox__box--checked {
  background-color: var(--primary);
  border-color: var(--primary);
  box-shadow: var(--clay-shadow);
  transform: scale(1.04);
}

.checkbox__icon {
  animation: check-bounce 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes check-bounce {
  0% { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

[data-theme="clay"] .checkbox__box--checked {
  box-shadow: 3px 5px 12px rgba(124, 58, 237, 0.35), inset 2px 2px 4px rgba(255, 255, 255, 0.5);
}

[data-theme="glass"] .checkbox__box {
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: var(--backdrop-blur, blur(8px));
}

[data-theme="neo"] .checkbox__box {
  box-shadow: inset 2px 2px 4px rgba(163, 177, 198, 0.55), inset -2px -2px 4px rgba(255, 255, 255, 0.8);
}

[data-theme="neo"] .checkbox__box--checked {
  box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.55), -3px -3px 6px rgba(255, 255, 255, 0.8);
}
</style>
