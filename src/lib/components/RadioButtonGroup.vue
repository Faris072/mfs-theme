<template>
  <div
    class="mfs-radio-group"
    :class="[
      direction === 'column' ? 'mfs-flex mfs-flex-col mfs-gap-2' : 'mfs-row',
      {
        'mfs-radio-group--disabled mfs-disabled': disabled,
        'mfs-radio-group--invalid': invalid
      }
    ]"
    role="radiogroup"
    :aria-invalid="invalid || undefined"
  >
    <slot
      :model-value="modelValue"
      :name="resolvedName"
      :disabled="disabled"
      :invalid="invalid"
      :select-value="selectValue"
    >
      <RadioButton
        v-for="(option, index) in options"
        :key="index"
        :model-value="modelValue"
        :value="option.value"
        :name="resolvedName"
        :label="option.label"
        :disabled="disabled || option.disabled"
        @update:model-value="selectValue"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue'

export interface RadioGroupOption {
  label: string
  value: unknown
  disabled?: boolean
}

export interface RadioButtonGroupContext {
  modelValue: ComputedRef<unknown>
  name: ComputedRef<string>
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  selectValue: (value: unknown) => void
}

export const radioButtonGroupKey: InjectionKey<RadioButtonGroupContext> = Symbol('RadioButtonGroup')
</script>

<script setup lang="ts">
import { computed, provide, useId } from 'vue'
import RadioButton from './RadioButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: unknown
    name?: string
    direction?: 'row' | 'column'
    disabled?: boolean
    invalid?: boolean
    options?: RadioGroupOption[]
  }>(),
  {
    direction: 'row',
    disabled: false,
    invalid: false,
    options: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}>()

const fallbackName = `mfs-radio-group-${useId()}`
const resolvedName = computed(() => props.name || fallbackName)

const selectValue = (value: unknown) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}

provide(radioButtonGroupKey, {
  modelValue: computed(() => props.modelValue),
  name: resolvedName,
  disabled: computed(() => props.disabled),
  invalid: computed(() => props.invalid),
  selectValue
})
</script>

<style scoped>
.mfs-radio-group--invalid {
  outline: 1px solid var(--danger);
  outline-offset: 4px;
  border-radius: var(--radius-sm, 8px);
}
</style>
