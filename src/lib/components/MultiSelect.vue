<template>
  <div ref="rootRef" class="ms-wrapper" :class="{ 'ms-wrapper--error': !!error, 'ms-wrapper--disabled': disabled }">
    <label v-if="label" class="ms-label mfs-text">
      {{ label }}
      <span v-if="required" class="ms-required mfs-text-danger">*</span>
    </label>

    <div class="ms-container">
      <div
        tabindex="0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-invalid="!!error"
        class="ms-trigger mfs-surface mfs-rounded mfs-shadow-inset"
        @click="toggle"
        @keydown.escape="close"
        @keydown.enter.prevent="toggle"
      >
        <div class="ms-chips">
          <span v-for="opt in selectedOptions" :key="String(opt.value)" class="ms-chip mfs-pill">
            <span class="ms-chip-text">{{ opt.label }}</span>
            <button
              v-if="!disabled"
              type="button"
              class="ms-chip-remove"
              :aria-label="`Remove ${opt.label}`"
              @click.stop="removeValue(opt.value)"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
          <span v-if="selectedOptions.length === 0" class="ms-placeholder">{{ placeholder }}</span>
        </div>

        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ms-chevron"
          :class="{ 'ms-chevron--open': isOpen }"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <Transition name="ms-pop">
        <div v-if="isOpen" role="listbox" aria-multiselectable="true" class="ms-dropdown mfs-surface mfs-rounded mfs-blur mfs-shadow">
          <div v-if="searchable" class="ms-search-box">
            <input
              ref="searchRef"
              v-model="query"
              type="text"
              class="ms-search mfs-inset"
              placeholder="Search..."
              @keydown.escape="close"
            />
          </div>

          <button
            v-if="selectAll && enabledOptions.length > 0"
            type="button"
            class="ms-option ms-option--all"
            @click="toggleSelectAll"
          >
            <span class="ms-check" :class="{ 'ms-check--on': allSelected }">
              <svg v-if="allSelected" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span>Select All</span>
          </button>

          <div class="ms-options">
            <button
              v-for="(opt, idx) in filteredOptions"
              :key="String(opt.value) + idx"
              type="button"
              role="option"
              :aria-selected="isSelected(opt.value)"
              :disabled="opt.disabled"
              class="ms-option"
              :class="{ 'ms-option--selected': isSelected(opt.value) }"
              @click="toggleOption(opt)"
            >
              <span class="ms-check" :class="{ 'ms-check--on': isSelected(opt.value) }">
                <svg v-if="isSelected(opt.value)" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>{{ opt.label }}</span>
            </button>
            <div v-if="filteredOptions.length === 0" class="ms-empty">No options</div>
          </div>
        </div>
      </Transition>
    </div>

    <p v-if="error" class="ms-msg ms-msg--error mfs-text-danger">{{ error }}</p>
    <p v-else-if="hint" class="ms-msg mfs-text-muted">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

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
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    placeholder: 'Select items',
    required: false,
    disabled: false,
    searchable: false,
    selectAll: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const query = ref('')

const normalizedOptions = computed<MultiSelectOption[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)

const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return normalizedOptions.value
  return normalizedOptions.value.filter((o) => o.label.toLowerCase().includes(q))
})

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
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style scoped>
.ms-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.ms-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 4px;
}

.ms-required {
  color: var(--danger);
}

.ms-container {
  position: relative;
}

.ms-trigger {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  border-radius: var(--radius, 14px);
  box-shadow: var(--input-shadow);
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: var(--backdrop-blur, none);
}

.ms-trigger:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow);
}

.ms-wrapper--error .ms-trigger {
  border-color: var(--danger);
}

.ms-wrapper--disabled .ms-trigger {
  opacity: 0.6;
  cursor: not-allowed;
}

.ms-chips {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ms-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
  font-size: 0.8rem;
  font-weight: 600;
}

.ms-chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  padding: 0;
  cursor: pointer;
}

.ms-chip-remove:hover {
  background: rgba(255, 255, 255, 0.35);
}

.ms-placeholder {
  color: var(--text-muted);
  opacity: 0.75;
  font-size: 0.95rem;
}

.ms-chevron {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.ms-chevron--open {
  transform: rotate(180deg);
}

.ms-dropdown {
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
  max-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ms-search {
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

.ms-options {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ms-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: none;
  border-radius: var(--radius-sm, 10px);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
}

.ms-option:hover:not(:disabled) {
  background-color: var(--surface-subtle, rgba(139, 92, 246, 0.12));
}

.ms-option--all {
  font-weight: 600;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ms-check--on {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.ms-empty {
  padding: 12px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.ms-msg {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.ms-msg--error {
  color: var(--danger);
  font-weight: 500;
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
  box-shadow: 2px 3px 6px rgba(124, 58, 237, 0.28);
}

[data-theme="glass"] .ms-trigger,
[data-theme="glass"] .ms-dropdown {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .ms-trigger {
  box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}
</style>
