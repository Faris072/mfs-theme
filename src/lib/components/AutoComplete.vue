<template>
  <div ref="rootRef" class="ac-wrapper" :class="{ 'ac-wrapper--disabled mfs-disabled': disabled }">
    <label v-if="label" :for="inputId" class="ac-label mfs-text">{{ label }}</label>

    <div class="ac-container">
      <div class="ac-box mfs-surface mfs-rounded mfs-shadow-inset">
        <input
          :id="inputId"
          type="text"
          role="combobox"
          :aria-expanded="isOpen"
          aria-autocomplete="list"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="ac-input mfs-text"
          @input="onInput"
          @focus="onFocus"
          @keydown="onKeydown"
        />
        <span v-if="loading" class="ac-spinner" aria-hidden="true" />
      </div>

      <Transition name="ac-pop">
        <ul v-if="isOpen && normalized.length" role="listbox" class="ac-dropdown mfs-surface mfs-overlay mfs-rounded mfs-blur mfs-shadow">
          <li
            v-for="(item, idx) in normalized"
            :key="item.label + idx"
            role="option"
            :aria-selected="idx === activeIndex"
            class="ac-option mfs-text"
            :class="{ 'ac-option--active': idx === activeIndex }"
            @mousedown.prevent="selectItem(item)"
            @mouseenter="activeIndex = idx"
          >
            {{ item.label }}
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

export interface AutoCompleteItem {
  label: string
  value?: any
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    suggestions?: Array<string | AutoCompleteItem>
    label?: string
    placeholder?: string
    disabled?: boolean
    loading?: boolean
    minLength?: number
  }>(),
  {
    modelValue: '',
    suggestions: () => [],
    placeholder: 'Type to search...',
    disabled: false,
    loading: false,
    minLength: 1
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'complete', payload: { query: string }): void
  (e: 'select', item: AutoCompleteItem): void
}>()

const inputId = `mfs-ac-${useId()}`
const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)

const normalized = computed<AutoCompleteItem[]>(() => {
  const q = (props.modelValue || '').toLowerCase()
  return props.suggestions
    .map((s) => (typeof s === 'string' ? { label: s, value: s } : s))
    .filter((s) => !q || s.label.toLowerCase().includes(q))
})

const onInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
  if (val.length >= props.minLength) {
    emit('complete', { query: val })
    isOpen.value = true
    activeIndex.value = -1
  } else {
    isOpen.value = false
  }
}

const onFocus = () => {
  if ((props.modelValue || '').length >= props.minLength && normalized.value.length) {
    isOpen.value = true
  }
}

const selectItem = (item: AutoCompleteItem) => {
  emit('update:modelValue', item.label)
  emit('select', item)
  isOpen.value = false
}

const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return
  if (e.key === 'Escape') {
    isOpen.value = false
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (normalized.value.length) activeIndex.value = (activeIndex.value + 1) % normalized.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (normalized.value.length) activeIndex.value = (activeIndex.value - 1 + normalized.value.length) % normalized.value.length
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault()
    const item = normalized.value[activeIndex.value]
    if (item) selectItem(item)
  }
}

const onClickOutside = (e: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) isOpen.value = false
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.ac-wrapper { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.ac-wrapper--disabled { opacity: 0.6; pointer-events: none; }
.ac-label { font-size: 0.875rem; font-weight: 600; }
.ac-container { position: relative; }
.ac-box { display: flex; align-items: center; padding: 2px 14px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.ac-box:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow); }
.ac-input { flex: 1; width: 100%; background: transparent; border: none; outline: none; font-family: inherit; font-size: 0.95rem; padding: 10px 0; }
.ac-input::placeholder { color: var(--text-muted); opacity: 0.7; }
.ac-spinner { width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: ac-spin 0.6s linear infinite; }
@keyframes ac-spin { to { transform: rotate(360deg); } }
.ac-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 40; list-style: none; margin: 0; padding: 6px; max-height: 220px; overflow-y: auto; }
.ac-option { padding: 9px 12px; border-radius: var(--radius-sm, 10px); cursor: pointer; font-size: 0.9rem; }
.ac-option--active, .ac-option:hover { background-color: var(--surface-subtle); color: var(--primary); }
.ac-pop-enter-active, .ac-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.ac-pop-enter-from, .ac-pop-leave-to { opacity: 0; transform: translateY(-4px); }

[data-theme="clay"] .ac-dropdown { box-shadow: var(--clay-shadow-hover); }
[data-theme="glass"] .ac-box, [data-theme="glass"] .ac-dropdown { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .ac-box { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
</style>
