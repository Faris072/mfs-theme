<template>
  <div ref="rootRef" class="mfs-mentions mfs-flex mfs-flex-col mfs-w-full" :class="{ 'mfs-disabled': disabled }">
    <div ref="triggerRef" class="mfs-mentions__box mfs-surface mfs-rounded mfs-shadow-inset mfs-w-full">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="isOpen"
        class="mfs-mentions__textarea mfs-w-full mfs-border-none mfs-text"
        @input="onInput"
        @click="detectTrigger"
        @keyup="onKeyup"
        @keydown="onKeydown"
      />
    </div>

    <Teleport to="body">
      <Transition name="mfs-mentions-pop">
        <div
          v-if="isOpen"
          ref="overlayRef"
          :style="overlayStyle"
          role="listbox"
          class="mfs-mentions__dropdown mfs-surface mfs-overlay mfs-rounded mfs-blur mfs-shadow"
        >
          <div v-if="loading" class="mfs-mentions__loading mfs-flex mfs-items-center mfs-justify-center mfs-gap-2 mfs-p-3">
            <span class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
            <span class="mfs-text-muted mfs-text-sm">Loading...</span>
          </div>

          <ul v-else-if="filteredOptions.length" class="mfs-mentions__list">
            <li
              v-for="(option, idx) in filteredOptions"
              :key="`${option.value}-${idx}`"
              role="option"
              :aria-selected="idx === activeIndex"
              class="mfs-mentions__option mfs-flex mfs-flex-col mfs-rounded-sm mfs-cursor-pointer"
              :class="{ 'mfs-mentions__option--active': idx === activeIndex }"
              @mousedown.prevent="selectOption(option)"
              @mouseenter="activeIndex = idx"
            >
              <span class="mfs-mentions__label mfs-text mfs-text-sm mfs-font-medium">{{ option.label }}</span>
              <span v-if="option.description" class="mfs-mentions__desc mfs-text-muted mfs-text-xs">
                {{ option.description }}
              </span>
            </li>
          </ul>

          <div v-else class="mfs-empty-state" role="status">
            <slot name="empty">{{ emptyText }}</slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFloatingOverlay } from '../composables/useFloatingOverlay'

export interface MentionOption {
  label: string
  value: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: MentionOption[]
    triggers?: string[]
    remote?: boolean
    loading?: boolean
    emptyText?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    options: () => [],
    triggers: () => ['@'],
    remote: false,
    loading: false,
    emptyText: 'No matches found',
    placeholder: '',
    rows: 3,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', payload: { trigger: string; query: string }): void
  (e: 'select', option: MentionOption): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const isOpen = ref(false)
const activeIndex = ref(0)
const activeTrigger = ref('')
const triggerStartIndex = ref(-1)
const query = ref('')

const { overlayStyle, containsTarget } = useFloatingOverlay(triggerRef, overlayRef, isOpen, {
  matchWidth: true
})

const filteredOptions = computed<MentionOption[]>(() => {
  if (props.remote) return props.options
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(q) ||
      opt.value.toLowerCase().includes(q) ||
      (opt.description?.toLowerCase().includes(q) ?? false)
  )
})

watch(filteredOptions, (items) => {
  if (items.length === 0) {
    activeIndex.value = -1
  } else if (activeIndex.value < 0 || activeIndex.value >= items.length) {
    activeIndex.value = 0
  }
})

const findTriggerMatch = (text: string, caret: number): { trigger: string; start: number; query: string } | null => {
  const beforeCaret = text.slice(0, caret)
  const sortedTriggers = [...props.triggers].filter(Boolean).sort((a, b) => b.length - a.length)
  if (!sortedTriggers.length) return null

  for (let i = beforeCaret.length - 1; i >= 0; i--) {
    const ch = beforeCaret[i]
    if (/\s/.test(ch)) {
      return null
    }
    for (const trig of sortedTriggers) {
      const start = i - trig.length + 1
      if (start < 0) continue
      if (beforeCaret.slice(start, i + 1) === trig) {
        const charBefore = start === 0 ? '' : beforeCaret[start - 1]
        if (start === 0 || /\s/.test(charBefore)) {
          return {
            trigger: trig,
            start,
            query: beforeCaret.slice(i + 1)
          }
        }
      }
    }
  }
  return null
}

const detectTrigger = () => {
  const el = textareaRef.value
  if (!el || props.disabled) {
    isOpen.value = false
    return
  }
  const caret = el.selectionStart ?? (props.modelValue ?? '').length
  const match = findTriggerMatch(el.value, caret)
  if (match) {
    activeTrigger.value = match.trigger
    triggerStartIndex.value = match.start
    query.value = match.query
    isOpen.value = true
    activeIndex.value = filteredOptions.value.length ? 0 : -1
    emit('search', { trigger: match.trigger, query: match.query })
  } else {
    isOpen.value = false
    activeTrigger.value = ''
    triggerStartIndex.value = -1
    query.value = ''
  }
}

const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  detectTrigger()
}

const onKeyup = (e: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) return
  detectTrigger()
}

const selectOption = (option: MentionOption) => {
  const el = textareaRef.value
  const current = el ? el.value : props.modelValue ?? ''
  const caret = el?.selectionStart ?? current.length
  const start = triggerStartIndex.value >= 0 ? triggerStartIndex.value : caret
  const inserted = `${activeTrigger.value}${option.value} `
  const nextValue = current.slice(0, start) + inserted + current.slice(caret)
  const nextCaret = start + inserted.length

  emit('update:modelValue', nextValue)
  emit('select', option)
  isOpen.value = false
  activeTrigger.value = ''
  triggerStartIndex.value = -1
  query.value = ''

  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      textareaRef.value.setSelectionRange(nextCaret, nextCaret)
    }
  })
}

const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return
  const count = filteredOptions.value.length

  if (e.key === 'Escape') {
    e.preventDefault()
    isOpen.value = false
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (count > 0) {
      activeIndex.value = (activeIndex.value + 1) % count
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (count > 0) {
      activeIndex.value = (activeIndex.value - 1 + count) % count
    }
  } else if (e.key === 'Enter' && count > 0 && activeIndex.value >= 0) {
    e.preventDefault()
    const opt = filteredOptions.value[activeIndex.value]
    if (opt) selectOption(opt)
  }
}

const onClickOutside = (e: MouseEvent) => {
  if (!containsTarget(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.mfs-mentions__box {
  padding: 10px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.mfs-mentions__box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow);
}

.mfs-mentions__textarea {
  background: transparent;
  outline: none;
  resize: vertical;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
}

.mfs-mentions__textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.mfs-mentions__dropdown {
  padding: 6px;
  max-height: 240px;
  overflow-y: auto;
}

.mfs-mentions__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mfs-mentions__option {
  padding: 8px 12px;
  gap: 2px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.mfs-mentions__option--active,
.mfs-mentions__option:hover {
  background-color: var(--surface-subtle);
}

.mfs-mentions__option--active .mfs-mentions__label,
.mfs-mentions__option:hover .mfs-mentions__label {
  color: var(--primary);
}

.mfs-mentions-pop-enter-active,
.mfs-mentions-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.mfs-mentions-pop-enter-from,
.mfs-mentions-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

[data-theme='clay'] .mfs-mentions__dropdown {
  box-shadow: var(--clay-shadow-hover);
}

[data-theme='glass'] .mfs-mentions__box,
[data-theme='glass'] .mfs-mentions__dropdown {
  border-color: rgba(255, 255, 255, 0.25);
}

[data-theme='neo'] .mfs-mentions__box {
  box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}
</style>
