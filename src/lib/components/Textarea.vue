<template>
  <div class="textarea-wrapper mfs-flex mfs-flex-col mfs-w-full" :class="{ 'textarea-wrapper--error': !!error, 'textarea-wrapper--disabled is-disabled': disabled }">
    <label v-if="label" :for="inputId" class="textarea-label mfs-text mfs-text-sm mfs-font-semibold mfs-flex mfs-items-center mfs-gap-1">
      {{ label }}
      <span v-if="required" class="mfs-text-danger">*</span>
    </label>

    <div class="textarea-box mfs-flex mfs-surface mfs-rounded mfs-shadow-inset" :class="{ 'mfs-disabled': disabled }">
      <textarea
        ref="textareaRef"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxlength"
        :aria-invalid="!!error"
        class="textarea-field mfs-flex-1 mfs-w-full mfs-border-none mfs-text"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </div>

    <div v-if="error || hint || showCount || maxlength !== undefined" class="textarea-footer mfs-flex mfs-items-center mfs-justify-between mfs-gap-2">
      <p v-if="error" class="textarea-msg textarea-msg--error mfs-text-danger">{{ error }}</p>
      <p v-else-if="hint" class="textarea-msg mfs-caption">{{ hint }}</p>
      <span v-else class="textarea-spacer mfs-flex-1" />

      <span v-if="showCount || maxlength !== undefined" class="textarea-count mfs-caption">
        {{ currentLength }}<template v-if="maxlength !== undefined"> / {{ maxlength }}</template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'

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
    rows?: number
    maxlength?: number
    showCount?: boolean
    autoResize?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    required: false,
    disabled: false,
    readonly: false,
    rows: 3,
    showCount: false,
    autoResize: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id || `mfs-textarea-${fallbackId}`)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const currentLength = computed(() => (props.modelValue ?? '').length)

const resize = () => {
  const el = textareaRef.value
  if (!el || !props.autoResize) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  nextTick(resize)
}

watch(() => props.modelValue, () => nextTick(resize))
onMounted(resize)
</script>

<style scoped>
.textarea-wrapper {
  gap: 6px;
}

.textarea-box {
  padding: 10px 14px;
  transition: all 0.25s ease;
}

.textarea-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow);
}

.textarea-wrapper--error .textarea-box {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.25), var(--input-shadow);
}

.textarea-wrapper--disabled {
  cursor: not-allowed;
}

.textarea-wrapper--disabled .textarea-label {
  opacity: 0.72;
}

.textarea-wrapper--disabled .textarea-field {
  color: var(--text-muted);
}

.textarea-field {
  background: transparent;
  outline: none;
  resize: none;
  overflow-y: hidden;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
}

.textarea-field::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.textarea-field:disabled {
  cursor: not-allowed;
}

.textarea-msg {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.textarea-msg--error {
  color: var(--danger);
  font-weight: 500;
}

.textarea-count {
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

[data-theme="clay"] .textarea-box:focus-within {
  box-shadow: inset 3px 3px 6px rgba(46, 16, 101, 0.14), inset -2px -2px 5px rgba(255, 255, 255, 0.7), 0 0 0 3px rgba(139, 92, 246, 0.25);
}

[data-theme="glass"] .textarea-box {
  background-color: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

[data-theme="neo"] .textarea-box {
  box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}
</style>
