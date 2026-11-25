<template>
  <div ref="rootRef" class="ms-wrapper mfs-flex mfs-flex-col mfs-gap-1-5 mfs-w-full" :class="{ 'ms-wrapper--error': !!error, 'ms-wrapper--disabled mfs-disabled': disabled }">
    <label v-if="label" class="ms-label mfs-text mfs-text-sm mfs-font-semibold mfs-flex mfs-items-center mfs-gap-1">
      {{ label }}
      <span v-if="required" class="mfs-text-danger">*</span>
    </label>

    <div ref="triggerRef" class="ms-container mfs-relative">
      <div
        tabindex="0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-invalid="!!error"
        class="ms-trigger mfs-flex mfs-items-center mfs-justify-between mfs-gap-2 mfs-surface mfs-rounded mfs-shadow-inset mfs-focus-ring mfs-cursor-pointer"
        @click="toggle"
        @keydown.escape="close"
        @keydown.enter.prevent="toggle"
      >
        <div class="ms-chips mfs-flex-1 mfs-flex mfs-flex-wrap mfs-items-center mfs-gap-1-5">
          <span v-for="opt in selectedOptions" :key="String(opt.value)" class="ms-chip mfs-inline-flex mfs-items-center mfs-gap-1 mfs-bg-primary mfs-font-semibold mfs-pill">
            <span class="ms-chip-text">{{ opt.label }}</span>
            <button
              v-if="!disabled"
              type="button"
              class="ms-chip-remove mfs-inline-flex mfs-items-center mfs-justify-center mfs-border-none mfs-p-0 mfs-rounded-full mfs-cursor-pointer"
              :aria-label="`Remove ${opt.label}`"
              @click.stop="removeValue(opt.value)"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
          <span v-if="selectedOptions.length === 0" class="ms-placeholder mfs-text-muted">{{ placeholder }}</span>
        </div>

        <span v-if="loading" class="mfs-spinner mfs-spinner--sm mfs-shrink-0" aria-hidden="true" />
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ms-chevron mfs-text-muted mfs-shrink-0"
          :class="{ 'ms-chevron--open': isOpen }"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <Teleport to="body">
        <Transition name="ms-pop">
          <div v-if="isOpen" ref="overlayRef" role="listbox" aria-multiselectable="true" :style="overlayStyle" class="ms-dropdown mfs-flex mfs-flex-col mfs-gap-1 mfs-surface mfs-overlay mfs-rounded mfs-blur mfs-shadow">
            <div v-if="searchable" class="ms-search-box">
              <input
                ref="searchRef"
                v-model="query"
                type="text"
                class="ms-search mfs-w-full mfs-text-sm mfs-inset mfs-rounded-sm mfs-outline-none"
                placeholder="Search..."
                @input="onSearchInput"
                @keydown.escape="close"
              />
            </div>

            <button
              v-if="selectAll && enabledOptions.length > 0"
              type="button"
              class="ms-option ms-option--all mfs-w-full mfs-flex mfs-items-center mfs-border-none mfs-font-semibold mfs-text mfs-rounded-sm mfs-bg-transparent mfs-cursor-pointer mfs-text-left"
              @click="toggleSelectAll"
            >
              <span class="ms-check mfs-inline-flex mfs-items-center mfs-justify-center mfs-shrink-0" :class="{ 'ms-check--on': allSelected }">
                <svg v-if="allSelected" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Select All</span>
            </button>

            <div class="ms-options mfs-flex mfs-flex-col mfs-overflow-y-auto">
              <button
                v-for="(opt, idx) in filteredOptions"
                :key="String(opt.value) + idx"
                type="button"
                role="option"
                :aria-selected="isSelected(opt.value)"
                :disabled="opt.disabled"
                class="ms-option mfs-w-full mfs-flex mfs-items-center mfs-border-none mfs-text mfs-rounded-sm mfs-bg-transparent mfs-cursor-pointer mfs-text-left"
                :class="{ 'ms-option--selected': isSelected(opt.value) }"
                @click="toggleOption(opt)"
              >
                <span class="ms-check mfs-inline-flex mfs-items-center mfs-justify-center mfs-shrink-0" :class="{ 'ms-check--on': isSelected(opt.value) }">
                  <svg v-if="isSelected(opt.value)" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{{ opt.label }}</span>
              </button>
              <div v-if="loading && filteredOptions.length === 0" class="ms-empty mfs-empty-state">
                <span class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
              </div>
              <div v-else-if="filteredOptions.length === 0" class="ms-empty mfs-empty-state">
                <slot name="empty">{{ emptyText }}</slot>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <p v-if="error" class="ms-msg ms-msg--error mfs-text-danger mfs-font-medium mfs-m-0">{{ error }}</p>
    <p v-else-if="hint" class="ms-msg mfs-caption mfs-m-0">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useFloatingOverlay } from '../composables/useFloatingOverlay'

export interface MultiSelectOption {
  label: string
  value: any
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: any[]
    options?: Array<string | MultiSelectOption>
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    searchable?: boolean
    selectAll?: boolean
    loading?: boolean
    remote?: boolean
    emptyText?: string
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    placeholder: 'Select items',
    required: false,
    disabled: false,
    searchable: false,
    selectAll: false,
    loading: false,
    remote: false,
    emptyText: 'No options found'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
  (e: 'filter', payload: { value: string }): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const query = ref('')

const { overlayStyle, containsTarget } = useFloatingOverlay(triggerRef, overlayRef, isOpen, {
  matchWidth: true
})

const normalizedOptions = computed<MultiSelectOption[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
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

const enabledOptions = computed(() => normalizedOptions.value.filter((o) => !o.disabled))

const selectedOptions = computed(() =>
  normalizedOptions.value.filter((o) => props.modelValue.includes(o.value))
)

const allSelected = computed(
  () => enabledOptions.value.length > 0 && enabledOptions.value.every((o) => props.modelValue.includes(o.value))
)

const isSelected = (val: any) => props.modelValue.includes(val)

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value && props.searchable) {
    nextTick(() => searchRef.value?.focus())
  }
}

const close = () => {
  isOpen.value = false
  query.value = ''
}

const toggleOption = (opt: MultiSelectOption) => {
  if (opt.disabled) return
  const next = isSelected(opt.value)
    ? props.modelValue.filter((v) => v !== opt.value)
    : [...props.modelValue, opt.value]
  emit('update:modelValue', next)
  emit('change', next)
}

const removeValue = (val: any) => {
  const next = props.modelValue.filter((v) => v !== val)
  emit('update:modelValue', next)
  emit('change', next)
}

const toggleSelectAll = () => {
  const next = allSelected.value ? [] : enabledOptions.value.map((o) => o.value)
  emit('update:modelValue', next)
  emit('change', next)
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
.ms-trigger {
  min-height: 44px;
  padding: 6px 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.ms-trigger:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow);
}

.ms-wrapper--error .ms-trigger {
  border-color: var(--danger);
}

.ms-wrapper--disabled .ms-trigger {
  opacity: 0.6;
  cursor: not-allowed;
}

.ms-chip {
  padding: 3px 8px;
  font-size: 0.8rem;
}

.ms-chip-remove {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  width: 16px;
  height: 16px;
}

.ms-chip-remove:hover {
  background: rgba(255, 255, 255, 0.35);
}

.ms-placeholder {
  opacity: 0.75;
  font-size: 0.95rem;
}

.ms-chevron {
  transition: transform 0.2s ease;
}

.ms-chevron--open {
  transform: rotate(180deg);
}

.ms-dropdown {
  box-shadow: var(--clay-shadow-hover);
  padding: 6px;
  max-height: 260px;
}

.ms-search {
  box-sizing: border-box;
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.12));
  padding: 7px 10px;
  font-family: inherit;
}

.ms-options {
  gap: 2px;
}

.ms-option {
  gap: 10px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 0.9rem;
}

.ms-option:hover:not(:disabled) {
  background-color: var(--surface-subtle, color-mix(in srgb, var(--primary) 12%, transparent));
}

.ms-option--all {
  border-bottom: 1px solid var(--border, rgba(148, 163, 184, 0.2));
  border-radius: var(--radius-sm, 10px) var(--radius-sm, 10px) 0 0;
}

.ms-option--selected {
  color: var(--primary);
  font-weight: 600;
}

.ms-option:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ms-check {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid var(--border, rgba(148, 163, 184, 0.5));
}

.ms-check--on {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.ms-empty {
  font-size: 0.85rem;
}

.ms-msg {
  font-size: 0.8rem;
}

.ms-pop-enter-active,
.ms-pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.ms-pop-enter-from,
.ms-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

[data-theme="clay"] .ms-chip {
  box-shadow: 2px 3px 6px color-mix(in srgb, var(--primary) 28%, transparent);
}

[data-theme="glass"] .ms-trigger,
[data-theme="glass"] .ms-dropdown {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .ms-trigger {
  box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}
</style>
