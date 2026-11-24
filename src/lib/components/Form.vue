<template>
  <form class="mfs-form mfs-flex mfs-flex-col mfs-gap-4" novalidate @submit.prevent="handleSubmit">
    <slot
      :values="values"
      :errors="errors"
      :submitting="submitting"
      :reset="reset"
      :validate="validate"
    />
  </form>
</template>

<script setup lang="ts">
import { computed, provide, reactive, watch, type ComputedRef } from 'vue'

export interface MfsFormSubmitPayload {
  values: Record<string, unknown>
  valid: boolean
  errors: Record<string, string>
}

export interface MfsFormContext {
  values: Record<string, unknown>
  errors: Record<string, string | string[]>
  submitting: ComputedRef<boolean>
  setFieldValue: (name: string, value: unknown) => void
  setFieldError: (name: string, error: string | string[] | undefined) => void
  clearErrors: (name?: string) => void
  reset: () => void
}

const props = withDefaults(
  defineProps<{
    initialValues?: Record<string, unknown>
    errors?: Record<string, string | string[]>
    resolver?: (values: Record<string, unknown>) => Record<string, string | undefined>
    submitting?: boolean
    validateOnSubmit?: boolean
  }>(),
  {
    submitting: false,
    validateOnSubmit: true
  }
)

const emit = defineEmits<{
  (e: 'submit', payload: MfsFormSubmitPayload): void
  (e: 'reset'): void
}>()

const values = reactive<Record<string, unknown>>({ ...(props.initialValues ?? {}) })
const errors = reactive<Record<string, string | string[]>>({})

const setErrors = (nextErrors: Record<string, string | string[]>) => {
  for (const key of Object.keys(errors)) {
    delete errors[key]
  }
  for (const [key, value] of Object.entries(nextErrors)) {
    if (Array.isArray(value) ? value.length > 0 : Boolean(value)) {
      errors[key] = value
    }
  }
}

watch(
  () => props.errors,
  (next) => {
    setErrors(next ?? {})
  },
  { immediate: true, deep: true }
)

const setFieldValue = (name: string, value: unknown) => {
  values[name] = value
  if (name in errors) {
    delete errors[name]
  }
}

const setFieldError = (name: string, error: string | string[] | undefined) => {
  if (Array.isArray(error) ? error.length > 0 : Boolean(error)) {
    errors[name] = error as string | string[]
  } else {
    delete errors[name]
  }
}

const clearErrors = (name?: string) => {
  if (name !== undefined) {
    delete errors[name]
    return
  }
  for (const key of Object.keys(errors)) {
    delete errors[key]
  }
}

const validate = (): boolean => {
  clearErrors()
  if (!props.resolver) {
    return true
  }
  const resolved = props.resolver({ ...values })
  for (const [key, message] of Object.entries(resolved)) {
    if (message) {
      errors[key] = message
    }
  }
  return Object.keys(errors).length === 0
}

const reset = () => {
  const initial = props.initialValues ?? {}
  for (const key of Object.keys(values)) {
    if (!(key in initial)) {
      delete values[key]
    }
  }
  for (const [key, value] of Object.entries(initial)) {
    values[key] = value
  }
  clearErrors()
  emit('reset')
}

const normalizeErrors = (): Record<string, string> => {
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(errors)) {
    const first = Array.isArray(value) ? value[0] : value
    if (first) {
      normalized[key] = first
    }
  }
  return normalized
}

const handleSubmit = () => {
  const valid = props.validateOnSubmit ? validate() : true
  emit('submit', {
    values: { ...values },
    valid,
    errors: normalizeErrors()
  })
}

provide<MfsFormContext>('mfsFormContext', {
  values,
  errors,
  submitting: computed(() => props.submitting),
  setFieldValue,
  setFieldError,
  clearErrors,
  reset
})

defineExpose({
  values,
  errors,
  validate,
  reset,
  setErrors
})
</script>
