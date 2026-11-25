<template>
  <nav class="panel-menu" aria-label="Panel navigation">
    <div
      v-for="(item, idx) in items"
      :key="getKey(item, idx)"
      class="panel-menu__panel mfs-surface mfs-rounded-md mfs-blur"
    >
      <button
        v-if="item.items?.length || (!item.to && !item.href)"
        type="button"
        class="panel-menu__header mfs-text"
        :class="{ 'panel-menu__header--disabled mfs-disabled': item.disabled }"
        :aria-expanded="item.items?.length ? isExpanded(getKey(item, idx)) : undefined"
        :disabled="item.disabled"
        @click="onHeaderClick(item, idx)"
      >
        <span v-if="item.icon" class="panel-menu__icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="panel-menu__label">{{ item.label }}</span>
        <svg
          v-if="item.items?.length"
          class="panel-menu__chevron"
          :class="{ 'panel-menu__chevron--open': isExpanded(getKey(item, idx)) }"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <component
        :is="item.to ? 'router-link' : 'a'"
        v-else
        :to="item.to"
        :href="sanitizeHref(item.href)"
        class="panel-menu__header mfs-text"
        :class="{ 'panel-menu__header--disabled mfs-disabled': item.disabled }"
        :disabled="item.disabled"
        @click="onHeaderClick(item, idx)"
      >
        <span v-if="item.icon" class="panel-menu__icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="panel-menu__label">{{ item.label }}</span>
      </component>

      <Transition name="panel-collapse">
        <ul v-if="item.items?.length && isExpanded(getKey(item, idx))" class="panel-menu__list">
          <li v-for="(sub, sIdx) in item.items" :key="sIdx">
            <button
              v-if="!sub.to && !sub.href"
              type="button"
              class="panel-menu__subitem mfs-rounded-sm mfs-text"
              :class="{ 'panel-menu__subitem--disabled mfs-disabled': sub.disabled }"
              :disabled="sub.disabled"
              @click="onLeafClick(sub)"
            >
              <span v-if="sub.icon" class="panel-menu__icon" aria-hidden="true">{{ sub.icon }}</span>
              <span>{{ sub.label }}</span>
            </button>

            <component
              :is="sub.to ? 'router-link' : 'a'"
              v-else
              :to="sub.to"
              :href="sanitizeHref(sub.href)"
              class="panel-menu__subitem mfs-rounded-sm mfs-text"
              :class="{ 'panel-menu__subitem--disabled mfs-disabled': sub.disabled }"
              :disabled="sub.disabled"
              @click="onLeafClick(sub)"
            >
              <span v-if="sub.icon" class="panel-menu__icon" aria-hidden="true">{{ sub.icon }}</span>
              <span>{{ sub.label }}</span>
            </component>
          </li>
        </ul>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { sanitizeHref } from '../utils/sanitize'

export interface PanelMenuItem {
  key?: string
  label: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  command?: () => void
  items?: PanelMenuItem[]
}

const props = withDefaults(
  defineProps<{
    items: PanelMenuItem[]
    multiple?: boolean
    expandedKeys?: string[]
  }>(),
  {
    multiple: true
  }
)

const emit = defineEmits<{
  (e: 'update:expandedKeys', keys: string[]): void
  (e: 'select', item: PanelMenuItem): void
}>()

const internalExpanded = ref<string[]>(props.expandedKeys ?? [])

watch(
  () => props.expandedKeys,
  (val) => {
    if (val !== undefined) internalExpanded.value = [...val]
  }
)

const getKey = (item: PanelMenuItem, idx: number) => item.key ?? `${idx}-${item.label}`
const isExpanded = (key: string) => internalExpanded.value.includes(key)

const onHeaderClick = (item: PanelMenuItem, idx: number) => {
  if (item.disabled) return
  if (item.items?.length) {
    const key = getKey(item, idx)
    let next: string[]
    if (isExpanded(key)) {
      next = internalExpanded.value.filter((k) => k !== key)
    } else {
      next = props.multiple ? [...internalExpanded.value, key] : [key]
    }
    internalExpanded.value = next
    emit('update:expandedKeys', next)
    return
  }
  item.command?.()
  emit('select', item)
}

const onLeafClick = (sub: PanelMenuItem) => {
  if (sub.disabled) return
  sub.command?.()
  emit('select', sub)
}
</script>

<style scoped>
.panel-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.panel-menu__panel {
  overflow: hidden;
}

.panel-menu__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  color: var(--text);
  background: transparent;
  font-family: inherit;
  font-size: 0.94rem;
  font-weight: 600;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.panel-menu__header:hover:not(.panel-menu__header--disabled) {
  background-color: var(--surface-subtle);
}

.panel-menu__header--disabled,
.panel-menu__subitem--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.panel-menu__label {
  flex: 1;
}

.panel-menu__chevron {
  transition: transform 0.2s ease;
}

.panel-menu__chevron--open {
  transform: rotate(180deg);
}

.panel-menu__list {
  list-style: none;
  padding: 4px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.panel-menu__subitem {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  min-height: 36px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  color: var(--text);
  background: transparent;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.panel-menu__subitem:hover:not(.panel-menu__subitem--disabled) {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.panel-collapse-enter-active,
.panel-collapse-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.panel-collapse-enter-from,
.panel-collapse-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
