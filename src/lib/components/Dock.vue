<template>
  <nav
    class="dock"
    :class="[`dock--${position}`]"
    aria-label="Dock navigation"
    @mouseleave="hoveredIndex = null"
  >
    <ul class="dock__list mfs-surface mfs-shadow-card mfs-pill mfs-blur" role="menubar">
      <li
        v-for="(item, idx) in items"
        :key="idx"
        class="dock__item-wrap"
        role="none"
        @mouseenter="hoveredIndex = idx"
      >
        <button
          v-if="!item.to && !item.href"
          type="button"
          role="menuitem"
          class="dock__item mfs-rounded-sm mfs-text"
          :class="{
            'dock__item--active': item.active,
            'dock__item--disabled mfs-disabled': item.disabled
          }"
          :style="getItemStyle(idx)"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="handleSelect(item, idx)"
        >
          <slot name="item" :item="item" :index="idx" :active="!!item.active">
            <span class="dock__glyph mfs-text">{{ item.icon ?? item.label.slice(0, 2).toUpperCase() }}</span>
          </slot>
          <span v-if="item.active" class="dock__dot" aria-hidden="true" />
        </button>

        <component
          :is="item.to ? 'router-link' : 'a'"
          v-else
          :to="item.to"
          :href="sanitizeHref(item.href)"
          role="menuitem"
          class="dock__item mfs-rounded-sm mfs-text"
          :class="{
            'dock__item--active': item.active,
            'dock__item--disabled mfs-disabled': item.disabled
          }"
          :style="getItemStyle(idx)"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="handleSelect(item, idx)"
        >
          <slot name="item" :item="item" :index="idx" :active="!!item.active">
            <span class="dock__glyph mfs-text">{{ item.icon ?? item.label.slice(0, 2).toUpperCase() }}</span>
          </slot>
          <span v-if="item.active" class="dock__dot" aria-hidden="true" />
        </component>
        <span class="dock__tooltip mfs-surface mfs-shadow mfs-rounded-sm mfs-text" role="tooltip">
          {{ item.label }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sanitizeHref } from '../utils/sanitize'

export interface DockItem {
  label: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  active?: boolean
  command?: () => void
}

const props = withDefaults(
  defineProps<{
    items: DockItem[]
    position?: 'bottom' | 'top' | 'left' | 'right'
    magnification?: boolean
  }>(),
  {
    position: 'bottom',
    magnification: true
  }
)

const emit = defineEmits<{
  (e: 'select', item: DockItem, index: number): void
}>()

const hoveredIndex = ref<number | null>(null)

const getItemStyle = (idx: number) => {
  if (!props.magnification || hoveredIndex.value === null) return {}
  const dist = Math.abs(hoveredIndex.value - idx)
  if (dist === 0) return { transform: 'scale(1.32)' }
  if (dist === 1) return { transform: 'scale(1.14)' }
  return {}
}

const handleSelect = (item: DockItem, index: number) => {
  if (item.disabled) return
  item.command?.()
  emit('select', item, index)
}
</script>

<style scoped>
.dock {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 800;
}

.dock--bottom,
.dock--top {
  width: 100%;
}

.dock--left,
.dock--right {
  height: 100%;
}

.dock__list {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  list-style: none;
  max-width: 100%;
  overflow: visible;
}

.dock--left .dock__list,
.dock--right .dock__list {
  flex-direction: column;
  padding: 14px 8px;
}

.dock__item-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dock__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  color: var(--text);
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s ease;
}

.dock__item--active {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.dock__item--active .dock__glyph {
  color: var(--primary-text, #ffffff);
}

.dock__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.dock__glyph {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1;
}

.dock__dot {
  position: absolute;
  bottom: -6px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--primary);
}

.dock__tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dock--top .dock__tooltip {
  bottom: auto;
  top: calc(100% + 10px);
}

.dock--left .dock__tooltip {
  bottom: auto;
  left: calc(100% + 10px);
}

.dock--right .dock__tooltip {
  bottom: auto;
  right: calc(100% + 10px);
}

.dock__item-wrap:hover .dock__tooltip,
.dock__item:focus-visible + .dock__tooltip {
  opacity: 1;
  transform: translateY(0);
}
</style>
