<template>
  <div
    class="mfs-chips-wrapper"
    :class="{
      'mfs-chips-wrapper--disabled mfs-disabled': disabled,
      'mfs-chips-wrapper--invalid': invalid || !!error
    }"
  >
    <label v-if="label" :for="inputId" class="mfs-chips-label mfs-text">
      {{ label }}
    </label>

    <div
      class="mfs-chips-box mfs-inset mfs-rounded"
      :class="{ 'mfs-chips-box--disabled mfs-disabled': disabled }"
      @click="focusInput"
    >
      <Chip
        v-for="(item, index) in modelValue"
        :key="`${item}-${index}`"
        :label="item"
        :removable="!disabled"
        @remove="removeAt(index)"
      />

      <input
        :id="inputId"
        ref="inputRef"
        v-model="draft"
        type="text"
        class="mfs-chips-input mfs-text"
        :placeholder="isAtMax ? '' : placeholder"
        :disabled="disabled || isAtMax"
        :aria-invalid="invalid || !!error || undefined"
        @keydown="handleKeydown"
        @input="handleInput"
        @blur="handleBlur"
      />
    </div>

    <p v-if="error" class="mfs-chips-msg mfs-text-danger">{{ error }}</p>
    <p v-else-if="hint" class="mfs-chips-msg mfs-caption">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import Chip from './Chip.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    placeholder?: string
    separator?: string
    max?: number
    allowDuplicate?: boolean
    disabled?: boolean
    invalid?: boolean
    label?: string
    hint?: string
    error?: string
  }>(),
  {
    modelValue: () => [],
    placeholder: '',
    separator: ',',
    allowDuplicate: false,
    disabled: false,
    invalid: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'add', value: string): void
  (e: 'remove', value: string): void
}>()

const inputId = useId()
const inputRef = ref<HTMLInputElement | null>(null)
const draft = ref('')

const isAtMax = computed(() => props.max !== undefined && props.modelValue.length >= props.max)

const focusInput = () => {
  if (!props.disabled) {
    inputRef.value?.focus()
  }
}

const addTags = (raw: string) => {
  if (props.disabled) return
  const parts = props.separator ? raw.split(props.separator) : [raw]
  const next = [...props.modelValue]
  const added: string[] = []

  for (const part of parts) {
    const tag = part.trim()
    if (!tag) continue
    if (props.max !== undefined && next.length >= props.max) break
    if (!props.allowDuplicate && next.includes(tag)) continue
    next.push(tag)
    added.push(tag)
  }

  if (added.length > 0) {
    emit('update:modelValue', next)
    for (const tag of added) {
      emit('add', tag)
    }
  }
  draft.value = ''
}

const removeAt = (index: number) => {
  if (props.disabled) return
  const removed = props.modelValue[index]
  if (removed === undefined) return
  const next = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', next)
  emit('remove', removed)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return

  if (e.key === 'Enter' || (props.separator && e.key === props.separator)) {
    e.preventDefault()
    if (draft.value.trim()) {
      addTags(draft.value)
    }
    return
  }

  if (e.key === 'Backspace' && draft.value === '' && props.modelValue.length > 0) {
    e.preventDefault()
    removeAt(props.modelValue.length - 1)
  }
}

const handleInput = () => {
  if (props.separator && draft.value.includes(props.separator)) {
    addTags(draft.value)
  }
}

const handleBlur = () => {
  if (draft.value.trim()) {
    addTags(draft.value)
  }
}
</script>

<style scoped>
.mfs-chips-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.mfs-chips-label {
  font-size: 0.875rem;
  font-weight: 600;
}

.mfs-chips-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 6px 10px;
  cursor: text;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.mfs-chips-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow);
}

.mfs-chips-wrapper--invalid .mfs-chips-box {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.25), var(--input-shadow);
}

.mfs-chips-box--disabled {
  cursor: not-allowed;
}

.mfs-chips-input {
  flex: 1 1 100px;
  min-width: 80px;
  border: 0;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.925rem;
  padding: 4px 2px;
}

.mfs-chips-input::placeholder {
  color: var(--text-muted);
}

.mfs-chips-input:disabled {
  cursor: not-allowed;
  color: var(--text-muted);
}

.mfs-chips-msg {
  margin: 0;
  font-size: 0.8rem;
}
</style>
