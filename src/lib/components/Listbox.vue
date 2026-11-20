<template>
  <div class="lb-wrapper mfs-surface mfs-rounded mfs-shadow" :class="{ 'lb-wrapper--disabled mfs-disabled': disabled }">
    <div v-if="filter" class="lb-filter-box">
      <input v-model="query" type="text" class="lb-filter mfs-inset mfs-text" placeholder="Filter..." :disabled="disabled" />
    </div>

    <ul role="listbox" :aria-multiselectable="multiple" class="lb-list">
      <li
        v-for="(opt, idx) in filtered"
        :key="String(opt.value) + idx"
        role="option"
        :aria-selected="isSelected(opt.value)"
        class="lb-item mfs-text mfs-focus-ring"
        :class="{ 'lb-item--selected': isSelected(opt.value), 'lb-item--disabled': opt.disabled }"
        tabindex="0"
        @click="select(opt)"
        @keydown.enter.prevent="select(opt)"
        @keydown.space.prevent="select(opt)"
      >
        <span>{{ opt.label }}</span>
        <svg v-if="isSelected(opt.value)" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </li>
      <li v-if="filtered.length === 0" class="lb-empty mfs-text-muted">No options</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface ListboxOption {
  label: string
  value: any
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: any | any[]
    options?: Array<string | ListboxOption>
    multiple?: boolean
    filter?: boolean
    disabled?: boolean
  }>(),
  {
    options: () => [],
    multiple: false,
    filter: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const query = ref('')

const normalized = computed<ListboxOption[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? normalized.value.filter((o) => o.label.toLowerCase().includes(q)) : normalized.value
})

const isSelected = (val: any) => {
  if (props.multiple && Array.isArray(props.modelValue)) return props.modelValue.includes(val)
  return props.modelValue === val
}

const select = (opt: ListboxOption) => {
  if (props.disabled || opt.disabled) return
  if (props.multiple) {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : []
    const next = arr.includes(opt.value) ? arr.filter((v) => v !== opt.value) : [...arr, opt.value]
    emit('update:modelValue', next)
    emit('change', next)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
  }
}
</script>

<style scoped>
.lb-wrapper { display: flex; flex-direction: column; padding: 6px; width: 100%; }
.lb-wrapper--disabled { opacity: 0.55; pointer-events: none; }
.lb-filter-box { padding: 4px; }
.lb-filter { width: 100%; box-sizing: border-box; padding: 7px 10px; font-family: inherit; font-size: 0.875rem; outline: none; }
.lb-list { list-style: none; margin: 0; padding: 2px; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.lb-item { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-radius: var(--radius-sm, 10px); font-size: 0.9rem; cursor: pointer; transition: background-color 0.15s ease; }
.lb-item:hover:not(.lb-item--disabled) { background-color: var(--surface-subtle); }
.lb-item--selected { background-color: var(--surface-subtle); color: var(--primary); font-weight: 600; }
.lb-item--disabled { opacity: 0.45; cursor: not-allowed; }
.lb-empty { padding: 12px; text-align: center; font-size: 0.85rem; }

[data-theme="clay"] .lb-wrapper { box-shadow: var(--clay-shadow); }
[data-theme="glass"] .lb-wrapper { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .lb-wrapper { box-shadow: 5px 5px 10px rgba(163, 177, 198, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.85); }
</style>
