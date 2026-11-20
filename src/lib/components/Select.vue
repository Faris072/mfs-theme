<template>
  <div ref="rootRef" class="select-wrapper" :class="{ 'select-wrapper--error': !!error, 'select-wrapper--disabled': disabled }">
    <label v-if="label" :for="triggerId" class="select-label mfs-text">
      {{ label }}
      <span v-if="required" class="select-required mfs-text-danger">*</span>
    </label>

    <div class="select-container">
      <button
        :id="triggerId"
        type="button"
        class="select-trigger mfs-surface mfs-rounded mfs-shadow-inset"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-invalid="!!error"
        :disabled="disabled"
        @click="toggle"
        @keydown="handleKeydown"
      >
        <span class="select-value" :class="{ 'select-value--placeholder': !selectedOption }">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>

        <span class="select-actions">
          <span
            v-if="clearable && selectedOption && !disabled"
            role="button"
            tabindex="-1"
            aria-label="Clear selection"
            class="select-clear"
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

      <Transition name="select-pop">
        <div v-if="isOpen" :id="listboxId" role="listbox" class="select-dropdown mfs-surface mfs-rounded mfs-blur mfs-shadow">
          <div v-if="searchable" class="select-search-box">
            <input
              ref="searchRef"
              v-model="query"
              type="text"
              class="select-search mfs-inset"
              placeholder="Search..."
              @keydown="handleKeydown"
            />
          </div>

          <div class="select-options">
            <button
              v-for="(opt, idx) in filteredOptions"
              :key="String(opt.value) + idx"
              type="button"
              role="option"
              :aria-selected="opt.value === modelValue"
              :disabled="opt.disabled"
              class="select-option"
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
            <div v-if="filteredOptions.length === 0" class="select-empty">No options</div>
          </div>
        </div>
      </Transition>
    </div>

    <p v-if="error" class="select-msg select-msg--error mfs-text-danger">{{ error }}</p>
    <p v-else-if="hint" class="select-msg mfs-text-muted">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: any
    options?: Array<string | SelectOption>
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    searchable?: boolean
    clearable?: boolean
  }>(),
  {
    options: () => [],
    placeholder: 'Select an option',
    required: false,
    disabled: false,
    searchable: false,
    clearable: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const uid = useId()
const triggerId = `mfs-select-${uid}`
const listboxId = `mfs-select-list-${uid}`

const rootRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)

const normalizedOptions = computed<SelectOption[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)

const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return normalizedOptions.value
  return normalizedOptions.value.filter((o) => o.label.toLowerCase().includes(q))
})

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
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.select-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 4px;
}

.select-required {
  color: var(--danger);
}

.select-container {
  position: relative;
}

.select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  border-radius: var(--radius, 14px);
  box-shadow: var(--input-shadow);
  padding: 11px 14px;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  backdrop-filter: var(--backdrop-blur, none);
}

.select-trigger:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow);
}

.select-wrapper--error .select-trigger {
  border-color: var(--danger);
}

.select-wrapper--disabled .select-trigger {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-value--placeholder {
  color: var(--text-muted);
  opacity: 0.75;
}

.select-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
}

.select-clear {
  display: inline-flex;
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
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 40;
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  border-radius: var(--radius, 14px);
  box-shadow: var(--clay-shadow-hover);
  backdrop-filter: var(--backdrop-blur, blur(14px));
  padding: 6px;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.select-search-box {
  padding: 2px;
}

.select-search {
  width: 100%;
  box-sizing: border-box;
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.12));
  border: 1px solid var(--border, transparent);
  border-radius: var(--radius-sm, 10px);
  padding: 7px 10px;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text);
  outline: none;
}

.select-options {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.select-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 12px;
  border: none;
  border-radius: var(--radius-sm, 10px);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.select-option--active:not(:disabled),
.select-option:hover:not(:disabled) {
  background-color: var(--surface-subtle, rgba(139, 92, 246, 0.12));
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
  padding: 12px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
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
