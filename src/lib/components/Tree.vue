<template>
  <ul
    class="tree"
    :class="{ 'tree--root mfs-surface mfs-rounded mfs-shadow-card': level === 0 }"
    :role="level === 0 ? 'tree' : 'group'"
  >
    <li
      v-for="node in nodes"
      :key="node.key"
      class="tree__item"
      role="treeitem"
      :aria-expanded="hasChildren(node) ? isExpanded(node.key) : undefined"
      :aria-selected="selectionMode !== 'none' ? isSelected(node.key) : undefined"
      :aria-disabled="node.disabled || undefined"
    >
      <div
        class="tree__row mfs-rounded-sm mfs-focus-ring"
        :class="{
          'tree__row--selected': isSelected(node.key),
          'tree__row--disabled mfs-disabled': node.disabled
        }"
        :style="{ paddingLeft: `${level * 20 + 8}px` }"
        tabindex="0"
        @click="onNodeClick(node)"
        @keydown.enter.prevent="onNodeClick(node)"
        @keydown.space.prevent="onNodeClick(node)"
        @keydown.right.prevent="expandIfCollapsed(node)"
        @keydown.left.prevent="collapseIfExpanded(node)"
      >
        <button
          v-if="hasChildren(node)"
          type="button"
          class="tree__toggle mfs-text-muted"
          :class="{ 'tree__toggle--expanded': isExpanded(node.key) }"
          :aria-label="isExpanded(node.key) ? `Collapse ${node.label}` : `Expand ${node.label}`"
          tabindex="-1"
          @click.stop="toggleExpand(node)"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <span v-else class="tree__spacer" aria-hidden="true" />

        <input
          v-if="selectionMode === 'checkbox'"
          type="checkbox"
          class="tree__checkbox"
          :checked="isSelected(node.key)"
          :disabled="node.disabled"
          :aria-label="`Select ${node.label}`"
          tabindex="-1"
          @click.stop
          @change="toggleSelect(node)"
        />

        <span v-if="node.icon" class="tree__icon" aria-hidden="true">{{ node.icon }}</span>

        <div class="tree__content">
          <slot
            name="node"
            :node="node"
            :expanded="isExpanded(node.key)"
            :selected="isSelected(node.key)"
            :level="level"
          >
            <span class="tree__label">{{ node.label }}</span>
          </slot>
        </div>
      </div>

      <Tree
        v-if="hasChildren(node) && isExpanded(node.key)"
        :nodes="node.children!"
        :expanded-keys="expandedKeys"
        :selection-mode="selectionMode"
        :selected-keys="selectedKeys"
        :level="level + 1"
        @update:expanded-keys="$emit('update:expandedKeys', $event)"
        @update:selected-keys="$emit('update:selectedKeys', $event)"
        @node-click="$emit('node-click', $event)"
        @node-toggle="(n, exp) => $emit('node-toggle', n, exp)"
      >
        <template v-if="$slots.node" #node="slotProps">
          <slot name="node" v-bind="slotProps" />
        </template>
      </Tree>
    </li>
  </ul>
</template>

<script setup lang="ts">
export interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
  icon?: string
}

defineOptions({
  name: 'Tree'
})

const props = withDefaults(
  defineProps<{
    nodes: TreeNode[]
    expandedKeys?: string[]
    selectionMode?: 'none' | 'single' | 'checkbox'
    selectedKeys?: string[]
    level?: number
  }>(),
  {
    expandedKeys: () => [],
    selectionMode: 'none',
    selectedKeys: () => [],
    level: 0
  }
)

const emit = defineEmits<{
  'update:expandedKeys': [keys: string[]]
  'update:selectedKeys': [keys: string[]]
  'node-click': [node: TreeNode]
  'node-toggle': [node: TreeNode, expanded: boolean]
}>()

defineSlots<{
  node?: (props: { node: TreeNode; expanded: boolean; selected: boolean; level: number }) => any
}>()

function hasChildren(node: TreeNode): boolean {
  return Array.isArray(node.children) && node.children.length > 0
}

function isExpanded(key: string): boolean {
  return props.expandedKeys.includes(key)
}

function isSelected(key: string): boolean {
  return props.selectedKeys.includes(key)
}

function toggleExpand(node: TreeNode) {
  if (!hasChildren(node)) return
  const next = new Set(props.expandedKeys)
  const expanding = !next.has(node.key)
  if (expanding) {
    next.add(node.key)
  } else {
    next.delete(node.key)
  }
  emit('update:expandedKeys', Array.from(next))
  emit('node-toggle', node, expanding)
}

function expandIfCollapsed(node: TreeNode) {
  if (hasChildren(node) && !isExpanded(node.key)) {
    toggleExpand(node)
  }
}

function collapseIfExpanded(node: TreeNode) {
  if (hasChildren(node) && isExpanded(node.key)) {
    toggleExpand(node)
  }
}

function toggleSelect(node: TreeNode) {
  if (node.disabled || props.selectionMode === 'none') return
  if (props.selectionMode === 'single') {
    emit('update:selectedKeys', isSelected(node.key) ? [] : [node.key])
    return
  }
  const next = new Set(props.selectedKeys)
  if (next.has(node.key)) {
    next.delete(node.key)
  } else {
    next.add(node.key)
  }
  emit('update:selectedKeys', Array.from(next))
}

function onNodeClick(node: TreeNode) {
  if (node.disabled) return
  emit('node-click', node)
  if (props.selectionMode !== 'none') {
    toggleSelect(node)
  } else if (hasChildren(node)) {
    toggleExpand(node)
  }
}
</script>

<style scoped>
.tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tree--root {
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius, 16px);
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border, transparent);
  backdrop-filter: var(--backdrop-blur, none);
  padding: 8px;
}

.tree__item {
  margin: 2px 0;
}

.tree__row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding-right: 12px;
  border-radius: var(--radius-sm, 10px);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tree__row:hover:not(.tree__row--disabled) {
  background: var(--surface-subtle);
}

.tree__row--selected {
  background: color-mix(in srgb, var(--primary) 14%, transparent);
  color: var(--primary);
  font-weight: 600;
}

.tree__row--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tree__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s ease, background-color 0.15s ease;
}

.tree__toggle:hover {
  background: var(--surface-subtle);
  color: var(--text);
}

.tree__toggle svg {
  width: 14px;
  height: 14px;
}

.tree__toggle--expanded {
  transform: rotate(90deg);
}

.tree__spacer {
  width: 24px;
  flex-shrink: 0;
}

.tree__checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
  flex-shrink: 0;
}

.tree__icon {
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.tree__content {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 0.925rem;
}

.tree__label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Theme overrides */
[data-theme="clay"] .tree__row--selected {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .tree__row:hover:not(.tree__row--disabled) {
  background: rgba(255, 255, 255, 0.08);
}

[data-theme="neo"] .tree__row--selected {
  box-shadow: var(--input-shadow);
}
</style>
