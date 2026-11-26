<template>
  <div class="mfs-form-field mfs-w-full mfs-min-w-0 mfs-flex mfs-flex-col mfs-gap-1-5">
    <label
      v-if="label"
      :for="name"
      class="mfs-form-field__label mfs-text mfs-text-sm mfs-font-semibold mfs-flex mfs-items-center mfs-gap-1"
    >
      {{ label }}
      <span v-if="required" class="mfs-text-danger">*</span>
    </label>

    <slot :value="fieldValue" :error="resolvedError" :set-value="setValue" />

    <p v-if="resolvedError" class="mfs-form-field__msg mfs-text-danger mfs-text-xs mfs-font-medium mfs-m-0">
      {{ resolvedError }}
    </p>
    <p v-else-if="hint" class="mfs-form-field__msg mfs-caption mfs-m-0">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { MfsFormContext } from './Form.vue'

const props = withDefaults(
  defineProps<{
    name: string
    label?: string
    hint?: string
    error?: string
    required?: boolean
  }>(),
  {
    required: false
  }
)

const formContext = inject<MfsFormContext | null>('mfsFormContext', null)

const fieldValue = computed(() => formContext?.values[props.name])

const resolvedError = computed<string | undefined>(() => {
  if (props.error) {
    return props.error
  }
  const raw = formContext?.errors[props.name]
  if (Array.isArray(raw)) {
    return raw[0] || undefined
  }
  return raw || undefined
})

const setValue = (value: unknown) => {
  formContext?.setFieldValue(props.name, value)
}
</script>
