<template>
  <div class="mfs-upload mfs-surface mfs-rounded mfs-shadow-card mfs-blur mfs-p-4 mfs-flex mfs-flex-col mfs-gap-3">
    <div
      class="mfs-upload__dropzone mfs-surface-subtle mfs-rounded mfs-focus-ring mfs-relative mfs-text-center mfs-cursor-pointer"
      :class="{
        'mfs-upload__dropzone--dragging': isDragging,
        'mfs-upload__dropzone--disabled mfs-disabled': disabled
      }"
      role="button"
      tabindex="0"
      aria-label="Upload files"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="inputRef"
        type="file"
        class="mfs-upload__input"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="onFileChange"
      />

      <span class="mfs-upload__icon mfs-inline-flex mfs-text-primary mfs-mb-2" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
      </span>
      <p class="mfs-upload__title mfs-title mfs-m-0 mfs-font-semibold">
        Drag &amp; drop files here or <span class="mfs-upload__link mfs-text-primary">browse</span>
      </p>
      <p v-if="accept || maxFileSize" class="mfs-upload__hint mfs-caption mfs-m-0">
        <span v-if="accept">Accepted: {{ accept }}</span>
        <span v-if="accept && maxFileSize"> · </span>
        <span v-if="maxFileSize">Max: {{ formatSize(maxFileSize) }}</span>
      </p>
    </div>

    <div v-if="typeof progress === 'number' && progress > 0" class="mfs-upload__progress-wrap mfs-flex mfs-items-center mfs-gap-2-5">
      <div class="mfs-upload__progress-track mfs-pill mfs-shadow-inset mfs-flex-1 mfs-overflow-hidden">
        <div class="mfs-upload__progress-bar mfs-pill mfs-h-full mfs-bg-primary" :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }" />
      </div>
      <span class="mfs-upload__progress-text mfs-text-muted mfs-font-bold">{{ Math.round(progress) }}%</span>
    </div>

    <ul v-if="files.length > 0" class="mfs-upload__list mfs-m-0 mfs-p-0 mfs-flex mfs-flex-col mfs-gap-2">
      <li v-for="(file, idx) in files" :key="`${file.name}-${file.size}-${idx}`" class="mfs-upload__item mfs-surface-subtle mfs-rounded-sm mfs-flex mfs-items-center mfs-justify-between mfs-gap-2-5 mfs-py-2 mfs-px-3">
        <div class="mfs-upload__file-info mfs-flex mfs-flex-col mfs-min-w-0">
          <span class="mfs-upload__file-name mfs-text mfs-font-semibold mfs-truncate">{{ file.name }}</span>
          <span class="mfs-upload__file-size mfs-caption">{{ formatSize(file.size) }}</span>
        </div>
        <button
          type="button"
          class="mfs-upload__remove mfs-pill mfs-focus-ring mfs-shrink-0 mfs-border-none mfs-bg-transparent mfs-text-muted mfs-inline-flex mfs-items-center mfs-justify-center mfs-cursor-pointer"
          aria-label="Remove file"
          @click="removeFile(idx)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    maxFileSize?: number
    disabled?: boolean
    progress?: number
  }>(),
  {
    multiple: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'select', files: File[]): void
  (e: 'remove', file: File): void
  (e: 'error', message: string): void
  (e: 'clear'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const isDragging = ref(false)

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function matchesAccept(file: File, acceptStr?: string): boolean {
  if (!acceptStr) return true
  const tokens = acceptStr.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const mime = file.type.toLowerCase()
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return mime.startsWith(token.slice(0, -1))
    return mime === token
  })
}

function processFiles(fileList: FileList | null) {
  if (!fileList || props.disabled) return
  const valid: File[] = []
  for (const file of Array.from(fileList)) {
    if (!matchesAccept(file, props.accept)) {
      emit('error', `Invalid file type: ${file.name}`)
      continue
    }
    if (props.maxFileSize && file.size > props.maxFileSize) {
      emit('error', `File too large: ${file.name} (max ${formatSize(props.maxFileSize)})`)
      continue
    }
    valid.push(file)
  }
  if (valid.length === 0) return
  files.value = props.multiple ? [...files.value, ...valid] : [valid[0]]
  emit('select', files.value)
}

const openPicker = () => {
  if (!props.disabled) inputRef.value?.click()
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  processFiles(target.files)
  target.value = ''
}

const onDragOver = () => {
  if (!props.disabled) isDragging.value = true
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  processFiles(e.dataTransfer?.files ?? null)
}

const removeFile = (idx: number) => {
  const [removed] = files.value.splice(idx, 1)
  if (removed) emit('remove', removed)
  if (files.value.length === 0) emit('clear')
}
</script>

<style scoped>
.mfs-upload__dropzone {
  padding: 26px 16px;
  border: 2px dashed var(--border, rgba(100, 116, 139, 0.3));
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.mfs-upload__dropzone--dragging {
  border-color: var(--primary);
  transform: scale(1.01);
}

.mfs-upload__dropzone--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.mfs-upload__input {
  display: none;
}

.mfs-upload__icon {
  width: 34px;
  height: 34px;
}

.mfs-upload__icon svg {
  width: 100%;
  height: 100%;
}

.mfs-upload__title {
  font-size: 0.92rem;
}

.mfs-upload__link {
  text-decoration: underline;
}

.mfs-upload__hint {
  margin-top: 4px;
  font-size: 0.78rem;
}

.mfs-upload__progress-track {
  height: 8px;
  background-color: var(--surface-subtle);
}

.mfs-upload__progress-bar {
  transition: width 0.25s ease;
}

.mfs-upload__progress-text {
  font-size: 0.78rem;
}

.mfs-upload__list {
  list-style: none;
}

.mfs-upload__file-name {
  font-size: 0.86rem;
}

.mfs-upload__file-size {
  font-size: 0.75rem;
}

.mfs-upload__remove {
  width: 26px;
  height: 26px;
}

.mfs-upload__remove svg {
  width: 15px;
  height: 15px;
}

.mfs-upload__remove:hover {
  color: var(--danger);
}

[data-theme="neo"] .mfs-upload {
  border: none;
}
</style>
