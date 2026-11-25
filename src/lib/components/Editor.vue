<template>
  <div class="ed-wrapper mfs-surface mfs-rounded mfs-shadow-inset" :class="{ 'ed-wrapper--disabled mfs-disabled': disabled }">
    <div v-if="!readonly" class="ed-toolbar mfs-surface-subtle" role="toolbar" aria-label="Formatting">
      <button type="button" class="ed-btn mfs-text" title="Bold" aria-label="Bold" @mousedown.prevent="exec('bold')">
        <strong>B</strong>
      </button>
      <button type="button" class="ed-btn mfs-text" title="Italic" aria-label="Italic" @mousedown.prevent="exec('italic')">
        <em>I</em>
      </button>
      <button type="button" class="ed-btn mfs-text" title="Underline" aria-label="Underline" @mousedown.prevent="exec('underline')">
        <u>U</u>
      </button>
      <button type="button" class="ed-btn mfs-text" title="Strikethrough" aria-label="Strikethrough" @mousedown.prevent="exec('strikeThrough')">
        <s>S</s>
      </button>
      <span class="ed-sep" />
      <button type="button" class="ed-btn mfs-text" title="Bullet List" aria-label="Bullet List" @mousedown.prevent="exec('insertUnorderedList')">
        • List
      </button>
      <button type="button" class="ed-btn mfs-text" title="Numbered List" aria-label="Numbered List" @mousedown.prevent="exec('insertOrderedList')">
        1. List
      </button>
      <button type="button" class="ed-btn mfs-text-muted" title="Clear Formatting" aria-label="Clear Formatting" @mousedown.prevent="exec('removeFormat')">
        Clear
      </button>
    </div>

    <div
      ref="editorRef"
      class="ed-content mfs-text"
      :contenteditable="!disabled && !readonly"
      :data-placeholder="placeholder"
      :style="{ minHeight }"
      role="textbox"
      aria-multiline="true"
      @input="onInput"
      @paste="onPaste"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { sanitizeHtml, sanitizeHtmlToNodes } from '../utils/sanitize'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    readonly?: boolean
    disabled?: boolean
    minHeight?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Write something...',
    readonly: false,
    disabled: false,
    minHeight: '140px'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)

const syncContent = (html: string) => {
  const cleanHtml = sanitizeHtml(html)
  if (!editorRef.value || editorRef.value.innerHTML === cleanHtml) return
  editorRef.value.replaceChildren(...sanitizeHtmlToNodes(cleanHtml))
}

onMounted(() => syncContent(props.modelValue))
watch(() => props.modelValue, (val) => syncContent(val))

const onInput = () => {
  if (!editorRef.value) return
  emit('update:modelValue', sanitizeHtml(editorRef.value.innerHTML))
}

const onPaste = (e: ClipboardEvent) => {
  if (props.disabled || props.readonly) return
  e.preventDefault()
  const html = e.clipboardData?.getData('text/html')
  if (html) {
    document.execCommand('insertHTML', false, sanitizeHtml(html))
  } else {
    const text = e.clipboardData?.getData('text/plain') ?? ''
    document.execCommand('insertText', false, text)
  }
  onInput()
}

const exec = (cmd: string) => {
  if (props.disabled || props.readonly) return
  editorRef.value?.focus()
  document.execCommand(cmd, false)
  onInput()
}
</script>

<style scoped>
.ed-wrapper { display: flex; flex-direction: column; width: 100%; overflow: hidden; }
.ed-wrapper--disabled { opacity: 0.6; pointer-events: none; }
.ed-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; padding: 8px 12px; border: none; border-bottom: 1px solid var(--border); }
.ed-btn { border: none; background: transparent; padding: 5px 9px; border-radius: var(--radius-sm, 8px); font-family: inherit; font-size: 0.85rem; cursor: pointer; }
.ed-btn:hover { background-color: var(--surface); color: var(--primary); }
.ed-sep { width: 1px; height: 18px; background-color: var(--border); margin: 0 4px; }
.ed-content { padding: 16px 20px; outline: none; font-size: 0.95rem; line-height: 1.6; overflow-y: auto; }
.ed-content:empty::before { content: attr(data-placeholder); color: var(--text-muted); opacity: 0.7; pointer-events: none; }
.ed-content :deep(ul), .ed-content :deep(ol) { padding-left: 1.5rem; margin: 0.45rem 0; list-style-position: outside; }
.ed-content :deep(ul) { list-style-type: disc; }
.ed-content :deep(ol) { list-style-type: decimal; }
.ed-content :deep(li) { margin: 0.2rem 0; }
.ed-content :deep(p) { margin: 0 0 0.5rem; }
.ed-content :deep(p:last-child), .ed-content :deep(ul:last-child), .ed-content :deep(ol:last-child) { margin-bottom: 0; }
</style>
