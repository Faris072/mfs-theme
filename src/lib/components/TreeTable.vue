<template>
  <div class="tree-table mfs-relative mfs-surface mfs-rounded mfs-shadow-card">
    <div class="tree-table__wrap">
      <table class="tree-table__table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="tree-table__th mfs-text-muted"
              :class="col.align ? `tree-table__cell--${col.align}` : ''"
              :style="col.width ? { width: col.width } : undefined"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="flatRows.length === 0">
            <td :colspan="columns.length" class="tree-table__empty mfs-text-muted">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
          <tr
            v-for="entry in flatRows"
            v-else
            :key="entry.node.key"
            class="tree-table__row"
          >
            <td
              v-for="(col, colIdx) in columns"
              :key="col.key"
              class="tree-table__td mfs-text"
              :class="col.align ? `tree-table__cell--${col.align}` : ''"
            >
              <div
                v-if="colIdx === 0"
                class="tree-table__first-cell"
                :style="{ paddingLeft: `${entry.depth * 20}px` }"
              >
                <button
                  v-if="entry.hasChildren"
                  type="button"
                  class="tree-table__toggle mfs-text-muted"
                  :class="{ 'tree-table__toggle--expanded': entry.expanded }"
                  :aria-expanded="entry.expanded"
                  :aria-label="entry.expanded ? 'Collapse row' : 'Expand row'"
                  @click="toggleNode(entry.node)"
                >
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <span v-else class="tree-table__spacer" aria-hidden="true" />
                <slot
                  :name="`cell-${col.key}`"
                  :node="entry.node"
                  :value="entry.node.data[col.key]"
                  :depth="entry.depth"
                >
                  <span>{{ entry.node.data[col.key] ?? '' }}</span>
                </slot>
              </div>
              <slot
                v-else
                :name="`cell-${col.key}`"
                :node="entry.node"
                :value="entry.node.data[col.key]"
                :depth="entry.depth"
              >
                <span>{{ entry.node.data[col.key] ?? '' }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="mfs-loading-overlay" aria-busy="true">
      <slot name="loading">
        <span class="mfs-spinner" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface TreeTableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TreeTableNode {
  key: string
  data: Record<string, any>
  children?: TreeTableNode[]
  leaf?: boolean
}

interface FlatEntry {
  node: TreeTableNode
  depth: number
  hasChildren: boolean
  expanded: boolean
}

const props = withDefaults(
  defineProps<{
    columns: TreeTableColumn[]
    nodes: TreeTableNode[]
    expandedKeys?: string[]
    emptyText?: string
    loading?: boolean
    lazy?: boolean
  }>(),
  {
    expandedKeys: () => [],
    emptyText: 'No data available',
    loading: false,
    lazy: false
  }
)

const emit = defineEmits<{
  'update:expandedKeys': [keys: string[]]
  'node-toggle': [node: TreeTableNode, expanded: boolean]
  'lazy-load': [node: TreeTableNode]
}>()

const localExpanded = ref<string[]>([...props.expandedKeys])

watch(
  () => props.expandedKeys,
  (val) => {
    localExpanded.value = [...val]
  }
)

const flatRows = computed<FlatEntry[]>(() => {
  const result: FlatEntry[] = []
  const expandedSet = new Set(localExpanded.value)

  function walk(list: TreeTableNode[], depth: number) {
    for (const node of list) {
      const hasChildren =
        (Array.isArray(node.children) && node.children.length > 0) ||
        (props.lazy && node.leaf !== true)
      const expanded = hasChildren && expandedSet.has(node.key)
      result.push({ node, depth, hasChildren, expanded })
      if (expanded && node.children) {
        walk(node.children, depth + 1)
      }
    }
  }

  walk(props.nodes, 0)
  return result
})

function toggleNode(node: TreeTableNode) {
  const next = new Set(localExpanded.value)
  const expanding = !next.has(node.key)
  if (expanding) {
    next.add(node.key)
  } else {
    next.delete(node.key)
  }
  const arr = Array.from(next)
  localExpanded.value = arr
  emit('update:expandedKeys', arr)
  emit('node-toggle', node, expanding)
  if (expanding && props.lazy && (!node.children || node.children.length === 0)) {
    emit('lazy-load', node)
  }
}
</script>

<style scoped>
.tree-table {
  overflow: hidden;
}

.tree-table__wrap {
  width: 100%;
  overflow-x: auto;
}

.tree-table__table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.tree-table__th {
  padding: 12px 16px;
  font-weight: 700;
  font-size: 0.8rem;
  background: var(--surface-subtle);
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
  white-space: nowrap;
}

.tree-table__td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.05));
}

.tree-table__row:last-child .tree-table__td {
  border-bottom: none;
}

.tree-table__row:hover {
  background: var(--surface-subtle);
}

.tree-table__first-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tree-table__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.15s ease;
}

.tree-table__toggle:hover {
  background: var(--surface);
}

.tree-table__toggle svg {
  width: 14px;
  height: 14px;
}

.tree-table__toggle--expanded {
  transform: rotate(90deg);
}

.tree-table__spacer {
  width: 24px;
  flex-shrink: 0;
}

.tree-table__cell--left {
  text-align: left;
}
.tree-table__cell--center {
  text-align: center;
}
.tree-table__cell--right {
  text-align: right;
}

.tree-table__empty {
  padding: 32px 16px;
  text-align: center;
}

[data-theme="glass"] .tree-table__row:hover {
  background: rgba(255, 255, 255, 0.06);
}
</style>
