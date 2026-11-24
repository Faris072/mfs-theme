<template>
  <div class="ts-wrapper" :class="{ 'ts-wrapper--disabled mfs-disabled': disabled }">
    <span v-if="label" class="ts-label mfs-text">{{ label }}</span>

    <div class="ts-container">
      <button
        ref="triggerRef"
        type="button"
        class="ts-trigger mfs-surface mfs-rounded mfs-shadow-inset mfs-focus-ring"
        :disabled="disabled"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span class="ts-value" :class="{ 'mfs-text-muted': !displayText }">
          {{ displayText || placeholder }}
        </span>
        <span v-if="loading" class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ts-chevron" :class="{ 'ts-chevron--open': isOpen }">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <Teleport to="body">
        <Transition name="ts-pop">
          <div v-if="isOpen" ref="overlayRef" :style="overlayStyle" class="ts-dropdown mfs-surface mfs-overlay mfs-rounded mfs-blur mfs-shadow" role="tree">
            <slot v-if="loading && visibleNodes.length === 0" name="loading">
              <div class="mfs-empty-state">
                <span class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
              </div>
            </slot>
            <div v-else-if="visibleNodes.length === 0" class="mfs-empty-state">
              <slot name="empty">{{ emptyText }}</slot>
            </div>
            <template v-else>
              <div
                v-for="row in visibleNodes"
                :key="String(row.node.value)"
                role="treeitem"
                :aria-selected="isSelected(row.node.value)"
                class="ts-row"
                :style="{ paddingLeft: `${8 + row.depth * 18}px` }"
              >
                <button
                  v-if="row.node.children?.length || (lazy && !row.node.isLeaf)"
                  type="button"
                  class="ts-expand mfs-text-muted"
                  :aria-label="expanded.has(row.node.value) ? 'Collapse' : 'Expand'"
                  @click.stop="toggleExpand(row.node)"
                >
                  <span v-if="row.node.loading" class="mfs-spinner mfs-spinner--sm" aria-hidden="true" />
                  <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: expanded.has(row.node.value) ? 'rotate(90deg)' : '' }">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <span v-else class="ts-expand-spacer" />

                <button
                  type="button"
                  class="ts-node mfs-text"
                  :class="{ 'ts-node--selected': isSelected(row.node.value) }"
                  :disabled="row.node.disabled"
                  @click="selectNode(row.node)"
                >
                  <span>{{ row.node.label }}</span>
                  <svg v-if="isSelected(row.node.value)" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </div>
              <slot v-if="loading" name="loading" />
            </template>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useFloatingOverlay } from '../composables/useFloatingOverlay'

export interface TreeSelectNode {
  label: string
  value: any
  disabled?: boolean
  isLeaf?: boolean
  loading?: boolean
  children?: TreeSelectNode[]
}

const props = withDefaults(
  defineProps<{
    modelValue?: any | any[]
    options?: TreeSelectNode[]
    multiple?: boolean
    label?: string
    placeholder?: string
    disabled?: boolean
    loading?: boolean
    lazy?: boolean
    emptyText?: string
  }>(),
  {
    modelValue: null,
    options: () => [],
    multiple: false,
    placeholder: 'Select node...',
    disabled: false,
    loading: false,
    lazy: false,
    emptyText: 'No options found'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'lazy-load', node: TreeSelectNode): void
}>()

const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const { overlayStyle, containsTarget } = useFloatingOverlay(triggerRef, overlayRef, isOpen, { offset: 6, matchWidth: true })
const expanded = reactive(new Set<any>())

const toggleExpand = (node: TreeSelectNode) => {
  if (expanded.has(node.value)) {
    expanded.delete(node.value)
  } else {
    expanded.add(node.value)
    if (props.lazy && !node.isLeaf && !node.children?.length) {
      emit('lazy-load', node)
    }
  }
}

const visibleNodes = computed(() => {
  const rows: { node: TreeSelectNode; depth: number }[] = []
  const walk = (nodes: TreeSelectNode[], depth: number) => {
    for (const n of nodes) {
      rows.push({ node: n, depth })
      if (n.children?.length && expanded.has(n.value)) {
        walk(n.children, depth + 1)
      }
    }
  }
  walk(props.options, 0)
  return rows
})

const flatMap = computed(() => {
  const map = new Map<any, string>()
  const walk = (nodes: TreeSelectNode[]) => {
    for (const n of nodes) {
      map.set(n.value, n.label)
      if (n.children?.length) walk(n.children)
    }
  }
  walk(props.options)
  return map
})

const displayText = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.map((v) => flatMap.value.get(v) ?? String(v)).join(', ')
  }
  if (props.modelValue === null || props.modelValue === undefined) return ''
  return flatMap.value.get(props.modelValue) ?? String(props.modelValue)
})

const isSelected = (val: any) => {
  if (props.multiple && Array.isArray(props.modelValue)) return props.modelValue.includes(val)
  return props.modelValue === val
}

const selectNode = (node: TreeSelectNode) => {
  if (node.disabled) return
  if (props.multiple) {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : []
    const next = arr.includes(node.value) ? arr.filter((v) => v !== node.value) : [...arr, node.value]
    emit('update:modelValue', next)
    emit('change', next)
  } else {
    emit('update:modelValue', node.value)
    emit('change', node.value)
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
.ts-wrapper { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.ts-wrapper--disabled { opacity: 0.6; pointer-events: none; }
.ts-label { font-size: 0.875rem; font-weight: 600; }
.ts-container { position: relative; }
.ts-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 11px 14px; font-family: inherit; font-size: 0.95rem; text-align: left; cursor: pointer; }
.ts-value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ts-chevron { color: var(--text-muted); transition: transform 0.2s ease; }
.ts-chevron--open { transform: rotate(180deg); }
.ts-dropdown { z-index: 40; padding: 6px; max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.ts-row { display: flex; align-items: center; gap: 4px; }
.ts-expand { background: transparent; border: none; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
.ts-expand svg { transition: transform 0.15s ease; }
.ts-expand-spacer { width: 22px; flex-shrink: 0; }
.ts-node { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border: none; border-radius: var(--radius-sm, 8px); background: transparent; font-family: inherit; font-size: 0.88rem; cursor: pointer; text-align: left; }
.ts-node:hover:not(:disabled) { background-color: var(--surface-subtle); }
.ts-node--selected { color: var(--primary); font-weight: 600; }
.ts-node:disabled { opacity: 0.45; cursor: not-allowed; }
.ts-pop-enter-active, .ts-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.ts-pop-enter-from, .ts-pop-leave-to { opacity: 0; transform: translateY(-4px); }

[data-theme="clay"] .ts-dropdown { box-shadow: var(--clay-shadow-hover); }
[data-theme="glass"] .ts-trigger, [data-theme="glass"] .ts-dropdown { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .ts-trigger { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
</style>
