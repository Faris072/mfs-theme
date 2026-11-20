<template>
  <div ref="rootRef" class="cas-wrapper" :class="{ 'cas-wrapper--disabled': disabled }">
    <span v-if="label" class="cas-label mfs-text">{{ label }}</span>

    <div class="cas-container">
      <button
        type="button"
        class="cas-trigger mfs-surface mfs-rounded mfs-shadow-inset"
        :disabled="disabled"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span class="cas-value" :class="{ 'mfs-text-muted': !displayLabel }">
          {{ displayLabel || placeholder }}
        </span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cas-chevron" :class="{ 'cas-chevron--open': isOpen }">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <Transition name="cas-pop">
        <div v-if="isOpen" class="cas-panel mfs-surface mfs-rounded mfs-blur mfs-shadow">
          <div v-for="(col, colIdx) in columns" :key="colIdx" class="cas-col">
            <button
              v-for="opt in col"
              :key="String(opt.value)"
              type="button"
              class="cas-item mfs-text"
              :class="{ 'cas-item--active': activePath[colIdx] === opt.value }"
              :disabled="opt.disabled"
              @click="selectNode(colIdx, opt)"
            >
              <span>{{ opt.label }}</span>
              <svg v-if="opt.children?.length" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface CascaderOption {
  label: string
  value: any
  disabled?: boolean
  children?: CascaderOption[]
}

const props = withDefaults(
  defineProps<{
    modelValue?: any[]
    options?: CascaderOption[]
    label?: string
    placeholder?: string
    separator?: string
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    placeholder: 'Select...',
    separator: ' / ',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const activePath = ref<any[]>([...props.modelValue])

watch(() => props.modelValue, (val) => {
  activePath.value = [...(val || [])]
})

const columns = computed(() => {
  const cols: CascaderOption[][] = []
  let current: CascaderOption[] | undefined = props.options
  let depth = 0
  while (current && current.length) {
    cols.push(current)
    const selectedVal = activePath.value[depth]
    const found: CascaderOption | undefined = current.find((o) => o.value === selectedVal)
    current = found?.children
    depth++
  }
  return cols
})

const displayLabel = computed(() => {
  const labels: string[] = []
  let current: CascaderOption[] | undefined = props.options
  for (const val of props.modelValue || []) {
    const found: CascaderOption | undefined = current?.find((o) => o.value === val)
    if (!found) break
    labels.push(found.label)
    current = found.children
  }
  return labels.join(props.separator)
})

const selectNode = (colIdx: number, opt: CascaderOption) => {
  if (opt.disabled) return
  const nextPath = [...activePath.value.slice(0, colIdx), opt.value]
  activePath.value = nextPath
  if (!opt.children?.length) {
    emit('update:modelValue', nextPath)
    emit('change', nextPath)
    isOpen.value = false
  }
}

const onClickOutside = (e: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) isOpen.value = false
}

const onEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onEscape)
})
</script>

<style scoped>
.cas-wrapper { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.cas-wrapper--disabled { opacity: 0.6; pointer-events: none; }
.cas-label { font-size: 0.875rem; font-weight: 600; }
.cas-container { position: relative; }
.cas-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 11px 14px; font-family: inherit; font-size: 0.95rem; text-align: left; cursor: pointer; }
.cas-value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cas-chevron { color: var(--text-muted); transition: transform 0.2s ease; }
.cas-chevron--open { transform: rotate(180deg); }
.cas-panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 40; display: flex; max-width: 92vw; overflow-x: auto; padding: 6px; gap: 4px; }
.cas-col { min-width: 150px; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; border-right: 1px solid var(--border); padding-right: 4px; }
.cas-col:last-child { border-right: none; padding-right: 0; }
.cas-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 8px 10px; border: none; border-radius: var(--radius-sm, 8px); background: transparent; font-family: inherit; font-size: 0.88rem; cursor: pointer; text-align: left; }
.cas-item:hover:not(:disabled), .cas-item--active { background-color: var(--surface-subtle); color: var(--primary); font-weight: 600; }
.cas-item:disabled { opacity: 0.45; cursor: not-allowed; }
.cas-pop-enter-active, .cas-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.cas-pop-enter-from, .cas-pop-leave-to { opacity: 0; transform: translateY(-4px); }

[data-theme="clay"] .cas-panel { box-shadow: var(--clay-shadow-hover); }
[data-theme="glass"] .cas-trigger, [data-theme="glass"] .cas-panel { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .cas-trigger { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
</style>
