<template>
  <div
    class="mfs-checkbox-group"
    :class="[
      direction === 'column' ? 'mfs-flex mfs-flex-col mfs-gap-2' : 'mfs-row',
      {
        'mfs-checkbox-group--disabled mfs-disabled': disabled,
        'mfs-checkbox-group--invalid': invalid
      }
    ]"
    role="group"
    :aria-invalid="invalid || undefined"
  >
    <slot
      :model-value="modelValue"
      :name="name"
      :disabled="disabled"
      :invalid="invalid"
      :toggle-value="toggleValue"
    >
      <Checkbox
        v-for="(option, index) in options"
        :key="index"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        :disabled="disabled || option.disabled"
        @update:model-value="handleOptionUpdate"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue'

export interface CheckboxGroupOption {
  label: string
  value: unknown
  disabled?: boolean
}

export interface CheckboxGroupContext {
  modelValue: ComputedRef<unknown[]>
  name: ComputedRef<string | undefined>
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  toggleValue: (value: unknown) => void
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('CheckboxGroup')
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import Checkbox from './Checkbox.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: unknown[]
    name?: string
    direction?: 'row' | 'column'
    disabled?: boolean
    invalid?: boolean
    options?: CheckboxGroupOption[]
  }>(),
  {
    modelValue: () => [],
    direction: 'row',
    disabled: false,
    invalid: false,
    options: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown[]): void
  (e: 'change', value: unknown[]): void
}>()

const toggleValue = (value: unknown) => {
  if (props.disabled) return
  const exists = props.modelValue.includes(value)
  const next = exists
    ? props.modelValue.filter((item) => item !== value)
    : [...props.modelValue, value]
  emit('update:modelValue', next)
  emit('change', next)
}

const handleOptionUpdate = (next: boolean | unknown[]) => {
  if (props.disabled || !Array.isArray(next)) return
  emit('update:modelValue', next)
  emit('change', next)
}

provide(checkboxGroupKey, {
  modelValue: computed(() => props.modelValue),
  name: computed(() => props.name),
  disabled: computed(() => props.disabled),
  invalid: computed(() => props.invalid),
  toggleValue
})
</script>

<style scoped>
.mfs-checkbox-group--invalid {
  outline: 1px solid var(--danger);
  outline-offset: 4px;
  border-radius: var(--radius-sm, 8px);
}
</style>
