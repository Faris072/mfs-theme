<template>
  <div class="org-chart" :class="{ 'org-chart--root': level === 0 }">
    <div class="org-chart__node-wrap">
      <div
        class="org-chart__node mfs-surface mfs-rounded mfs-shadow mfs-interactive mfs-focus-ring"
        tabindex="0"
        @click="$emit('node-click', value)"
        @keydown.enter.prevent="$emit('node-click', value)"
      >
        <slot name="node" :node="value" :expanded="isExpanded">
          <div class="org-chart__label mfs-title">{{ value.label }}</div>
          <div v-if="value.title" class="org-chart__title mfs-caption">{{ value.title }}</div>
        </slot>
      </div>

      <button
        v-if="collapsible && hasChildren"
        type="button"
        class="org-chart__toggle mfs-surface-subtle mfs-pill mfs-shadow"
        :aria-expanded="isExpanded"
        :aria-label="isExpanded ? `Collapse ${value.label}` : `Expand ${value.label}`"
        @click.stop="toggleExpand"
      >
        <svg
          :class="{ 'org-chart__chevron--collapsed': !isExpanded }"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div v-if="hasChildren && isExpanded" class="org-chart__children">
      <div
        v-for="child in value.children"
        :key="child.key"
        class="org-chart__branch"
      >
        <OrganizationChart
          :value="child"
          :collapsible="collapsible"
          :expanded-keys="expandedKeys"
          :level="level + 1"
          @update:expanded-keys="$emit('update:expandedKeys', $event)"
          @node-click="$emit('node-click', $event)"
        >
          <template v-if="$slots.node" #node="slotProps">
            <slot name="node" v-bind="slotProps" />
          </template>
        </OrganizationChart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface OrgChartNode {
  key: string
  label: string
  title?: string
  children?: OrgChartNode[]
}

defineOptions({
  name: 'OrganizationChart'
})

const props = withDefaults(
  defineProps<{
    value: OrgChartNode
    collapsible?: boolean
    expandedKeys?: string[]
    level?: number
  }>(),
  {
    collapsible: true,
    expandedKeys: undefined,
    level: 0
  }
)

const emit = defineEmits<{
  'update:expandedKeys': [keys: string[]]
  'node-click': [node: OrgChartNode]
}>()

defineSlots<{
  node?: (props: { node: OrgChartNode; expanded: boolean }) => any
}>()

const internalExpanded = ref(true)

const hasChildren = computed(
  () => Array.isArray(props.value.children) && props.value.children.length > 0
)

const isExpanded = computed(() => {
  if (props.expandedKeys) {
    return props.expandedKeys.includes(props.value.key)
  }
  return internalExpanded.value
})

watch(
  () => props.expandedKeys,
  () => {
    if (props.expandedKeys) {
      internalExpanded.value = props.expandedKeys.includes(props.value.key)
    }
  }
)

function toggleExpand() {
  if (!hasChildren.value) return
  if (props.expandedKeys) {
    const next = new Set(props.expandedKeys)
    if (next.has(props.value.key)) {
      next.delete(props.value.key)
    } else {
      next.add(props.value.key)
    }
    emit('update:expandedKeys', Array.from(next))
  } else {
    internalExpanded.value = !internalExpanded.value
  }
}
</script>

<style scoped>
.org-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.org-chart--root {
  overflow-x: auto;
  padding: 16px;
}

.org-chart__node-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.org-chart__node {
  min-width: 140px;
  padding: 12px 18px;
  text-align: center;
}

.org-chart__label {
  font-weight: 700;
  font-size: 0.925rem;
}

.org-chart__title {
  font-size: 0.78rem;
  margin-top: 2px;
}

.org-chart__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-top: -10px;
  z-index: 1;
  color: var(--text);
  cursor: pointer;
}

.org-chart__toggle svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.org-chart__chevron--collapsed {
  transform: rotate(-90deg);
}

.org-chart__children {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 24px;
}

.org-chart__children::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 12px;
  background: var(--border, rgba(128, 128, 128, 0.35));
  transform: translateX(-50%);
}

.org-chart__branch {
  position: relative;
  padding-top: 12px;
}

.org-chart__branch::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 50%;
  width: 2px;
  height: 24px;
  background: var(--border, rgba(128, 128, 128, 0.35));
  transform: translateX(-50%);
}

.org-chart__branch::after {
  content: '';
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--border, rgba(128, 128, 128, 0.35));
}

.org-chart__branch:first-child::after {
  left: 50%;
}

.org-chart__branch:last-child::after {
  right: 50%;
}

.org-chart__branch:only-child::after {
  display: none;
}

[data-theme="neo"] .org-chart__children::before,
[data-theme="neo"] .org-chart__branch::before,
[data-theme="neo"] .org-chart__branch::after {
  background: rgba(100, 116, 139, 0.3);
}
</style>
