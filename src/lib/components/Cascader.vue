<template>
  <div class="cas-wrapper" :class="{ 'cas-wrapper--disabled mfs-disabled': disabled }">
    <span v-if="label" class="cas-label mfs-text">{{ label }}</span>

    <div class="cas-container">
      <button
        ref="triggerRef"
        type="button"
        class="cas-trigger mfs-surface mfs-rounded mfs-shadow-inset mfs-focus-ring"
        :disabled="disabled"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span class="cas-value" :class="{ 'mfs-text-muted': !displayLabel }">
          {{ displayLabel || placeholder }}
        </span>
        <span v-if="loading" class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cas-chevron" :class="{ 'cas-chevron--open': isOpen }">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <Teleport to="body">
        <Transition name="cas-pop">
          <div v-if="isOpen" ref="overlayRef" :style="overlayStyle" class="cas-panel mfs-surface mfs-overlay mfs-rounded mfs-blur mfs-shadow">
            <div v-if="loading && columns.length === 0" class="cas-col">
              <slot name="loading">
                <div class="mfs-empty-state">
                  <span class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
                </div>
              </slot>
            </div>
            <div v-else-if="columns.length === 0" class="cas-col">
              <div class="mfs-empty-state">
                <slot name="empty">{{ emptyText }}</slot>
              </div>
            </div>
            <template v-else>
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
                  <span v-if="opt.loading" class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
                  <svg v-else-if="opt.children?.length || (lazy && !opt.isLeaf)" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
              <div v-if="loading" class="cas-col">
                <slot name="loading">
                  <div class="mfs-empty-state">
                    <span class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
                  </div>
                </slot>
              </div>
            </template>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFloatingOverlay } from '../composables/useFloatingOverlay'

export interface CascaderOption {
  label: string
  value: any
  disabled?: boolean
  isLeaf?: boolean
  loading?: boolean
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
    loading?: boolean
    lazy?: boolean
    emptyText?: string
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    placeholder: 'Select...',
    separator: ' / ',
    disabled: false,
    loading: false,
    lazy: false,
    emptyText: 'No options found'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
  (e: 'lazy-load', node: CascaderOption): void
}>()

const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const { overlayStyle, containsTarget } = useFloatingOverlay(triggerRef, overlayRef, isOpen, { offset: 6 })
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
  if (props.lazy && !opt.isLeaf && !opt.children?.length) {
    emit('lazy-load', opt)
    return
  }
  if (!opt.children?.length) {
    emit('update:modelValue', nextPath)
    emit('change', nextPath)
    isOpen.value = false
  }
}

const onClickOutside = (e: MouseEvent) => {
  if (!containsTarget(e.target)) isOpen.value = false
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
.cas-panel { z-index: 40; display: flex; max-width: 92vw; overflow-x: auto; padding: 6px; gap: 4px; }
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
