<template>
  <div
    ref="rootRef"
    class="select-wrapper mfs-flex mfs-flex-col"
    :class="[size === 'sm' ? 'select-wrapper--sm' : 'mfs-w-full', { 'select-wrapper--error': !!error, 'select-wrapper--disabled mfs-disabled': disabled }]"
  >
    <label v-if="label" :for="triggerId" class="select-label mfs-text mfs-text-sm mfs-font-semibold mfs-flex mfs-items-center mfs-gap-1">
      {{ label }}
      <span v-if="required" class="mfs-text-danger">*</span>
    </label>

    <div ref="triggerRef" class="select-container">
      <button
        :id="triggerId"
        type="button"
        class="select-trigger mfs-flex mfs-items-center mfs-justify-between mfs-gap-2 mfs-surface mfs-rounded mfs-shadow-inset"
        :class="[size === 'sm' ? 'select-trigger--sm' : 'mfs-w-full']"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-invalid="!!error"
        :disabled="disabled"
        @click="toggle"
        @keydown="handleKeydown"
      >
        <span class="select-value mfs-flex-1 mfs-truncate" :class="{ 'select-value--placeholder': !selectedOption }">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>

        <span class="select-actions mfs-inline-flex mfs-items-center mfs-text-muted">
          <span v-if="loading" class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
          <span
            v-if="clearable && selectedOption && !disabled"
            role="button"
            tabindex="-1"
            aria-label="Clear selection"
            class="select-clear mfs-inline-flex"
            @click.stop="clearValue"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="select-chevron"
            :class="{ 'select-chevron--open': isOpen }"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <Teleport to="body">
        <Transition name="select-pop">
          <div v-if="isOpen" :id="listboxId" ref="overlayRef" role="listbox" :style="overlayStyle" class="select-dropdown mfs-flex mfs-flex-col mfs-surface mfs-overlay mfs-rounded mfs-blur mfs-shadow">
            <div v-if="searchable" class="select-search-box">
              <input
                ref="searchRef"
                v-model="query"
                type="text"
                class="select-search mfs-w-full mfs-text-sm mfs-inset"
                placeholder="Search..."
                @input="onSearchInput"
                @keydown="handleKeydown"
              />
            </div>

            <div class="select-options mfs-flex mfs-flex-col">
              <button
                v-for="(opt, idx) in filteredOptions"
                :key="String(opt.value) + idx"
                type="button"
                role="option"
                :aria-selected="opt.value === modelValue"
                :disabled="opt.disabled"
                class="select-option mfs-w-full mfs-flex mfs-items-center mfs-justify-between mfs-gap-2 mfs-border-none mfs-text"
                :class="{
                  'select-option--selected': opt.value === modelValue,
                  'select-option--active': idx === activeIndex
                }"
                @click="selectOption(opt)"
                @mouseenter="activeIndex = idx"
              >
                <slot name="option" :option="opt" :selected="opt.value === modelValue">
                  <span>{{ opt.label }}</span>
                  <svg v-if="opt.value === modelValue" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </slot>
              </button>
              <div v-if="loading && filteredOptions.length === 0" class="select-empty mfs-empty-state">
                <span class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
              </div>
              <div v-else-if="filteredOptions.length === 0" class="select-empty mfs-empty-state">
                <slot name="empty">{{ emptyText }}</slot>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <p v-if="error" class="select-msg select-msg--error mfs-text-danger">{{ error }}</p>
    <p v-else-if="hint" class="select-msg mfs-caption">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useFloatingOverlay } from '../composables/useFloatingOverlay'

export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    options?: Array<string | number | SelectOption>
    size?: 'sm' | 'md'
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    searchable?: boolean
    clearable?: boolean
    loading?: boolean
    remote?: boolean
    emptyText?: string
  }>(),
  {
    options: () => [],
    size: 'md',
    placeholder: 'Select an option',
    required: false,
    disabled: false,
    searchable: false,
    clearable: false,
    loading: false,
    remote: false,
    emptyText: 'No options found'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'filter', payload: { value: string }): void
}>()

const uid = useId()
const triggerId = `mfs-select-${uid}`
const listboxId = `mfs-select-list-${uid}`

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)

const { overlayStyle, containsTarget } = useFloatingOverlay(triggerRef, overlayRef, isOpen, {
  matchWidth: true
})

const normalizedOptions = computed<SelectOption[]>(() =>
  props.options.map((o) =>
    typeof o === 'string' || typeof o === 'number' ? { label: String(o), value: o } : o
  )
)

const filteredOptions = computed(() => {
  if (props.remote) return normalizedOptions.value
  const q = query.value.trim().toLowerCase()
  if (!q) return normalizedOptions.value
  return normalizedOptions.value.filter((o) => o.label.toLowerCase().includes(q))
})

const onSearchInput = (e: Event) => {
  emit('filter', { value: (e.target as HTMLInputElement).value })
}

const selectedOption = computed(() =>
  normalizedOptions.value.find((o) => o.value === props.modelValue)
)

const open = () => {
  if (props.disabled) return
  isOpen.value = true
  activeIndex.value = filteredOptions.value.findIndex((o) => o.value === props.modelValue)
  if (props.searchable) {
    nextTick(() => searchRef.value?.focus())
  }
}

const close = () => {
  isOpen.value = false
  query.value = ''
}

const toggle = () => {
  isOpen.value ? close() : open()
}

const selectOption = (opt: SelectOption) => {
  if (opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  close()
}

const clearValue = () => {
  emit('update:modelValue', null)
  emit('change', null)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
    return
  }

  const opts = filteredOptions.value
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!opts.length) return
    activeIndex.value = (activeIndex.value + 1) % opts.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!opts.length) return
    activeIndex.value = (activeIndex.value - 1 + opts.length) % opts.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const opt = opts[activeIndex.value]
    if (opt && !opt.disabled) selectOption(opt)
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (!containsTarget(e.target)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style scoped>
.select-wrapper {
  gap: 6px;
}

.select-wrapper--sm {
  width: auto;
}

.select-container {
  position: relative;
}

.select-trigger {
  padding: 11px 14px;
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.select-trigger--sm {
  height: 36px;
  min-height: 36px;
  padding: 0 10px;
  font-size: 0.88rem;
  width: auto;
  min-width: 72px;
}

.select-trigger:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow);
}

.select-wrapper--error .select-trigger {
  border-color: var(--danger);
}

.select-wrapper--disabled .select-trigger {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-value--placeholder {
  color: var(--text-muted);
  opacity: 0.75;
}

.select-actions {
  gap: 6px;
}

.select-clear {
  padding: 2px;
  border-radius: 50%;
  cursor: pointer;
}

.select-clear:hover {
  color: var(--danger);
}

.select-chevron {
  transition: transform 0.2s ease;
}

.select-chevron--open {
  transform: rotate(180deg);
}

.select-dropdown {
  box-shadow: var(--clay-shadow-hover);
  padding: 6px;
  max-height: 250px;
  gap: 6px;
}

.select-search-box {
  padding: 2px;
}

.select-search {
  box-sizing: border-box;
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.12));
  border-radius: var(--radius-sm, 10px);
  padding: 7px 10px;
  font-family: inherit;
  outline: none;
}

.select-options {
  overflow-y: auto;
  gap: 2px;
}

.select-option {
  padding: 9px 12px;
  border-radius: var(--radius-sm, 10px);
  background: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.select-option--active:not(:disabled),
.select-option:hover:not(:disabled) {
  background-color: var(--surface-subtle, color-mix(in srgb, var(--primary) 12%, transparent));
}

.select-option--selected {
  color: var(--primary);
  font-weight: 600;
}

.select-option:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.select-empty {
  font-size: 0.85rem;
}

.select-msg {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.select-msg--error {
  color: var(--danger);
  font-weight: 500;
}

.select-pop-enter-active,
.select-pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.select-pop-enter-from,
.select-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

[data-theme="clay"] .select-dropdown {
  box-shadow: var(--clay-shadow-hover);
}

[data-theme="glass"] .select-trigger,
[data-theme="glass"] .select-dropdown {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .select-trigger {
  box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

[data-theme="neo"] .select-dropdown {
  box-shadow: 6px 6px 14px rgba(163, 177, 198, 0.55), -6px -6px 14px rgba(255, 255, 255, 0.85);
}
</style>
