<template>
  <div ref="rootRef" class="split-btn">
    <div :class="['split-btn__group', 'mfs-pill', 'mfs-shadow', `split-btn--${variant}`, `split-btn--${size}`]">
      <button
        type="button"
        :class="['split-btn__main', 'mfs-interactive', 'mfs-focus-ring', variant === 'surface' ? 'mfs-surface' : `mfs-bg-${variant}`, { 'mfs-disabled': disabled }]"
        :disabled="disabled"
        @click="emit('click', $event)"
      >
        <slot>{{ label }}</slot>
      </button>

      <button
        type="button"
        :class="['split-btn__toggle', 'mfs-interactive', 'mfs-focus-ring', variant === 'surface' ? 'mfs-surface' : `mfs-bg-${variant}`, { 'mfs-disabled': disabled }]"
        :disabled="disabled"
        aria-haspopup="menu"
        :aria-expanded="open"
        aria-label="More actions"
        @click="open = !open"
      >
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <Transition name="split-fade">
      <ul
        v-if="open && items.length"
        class="split-btn__menu mfs-surface mfs-rounded mfs-shadow-card mfs-blur"
        role="menu"
      >
        <li v-for="(item, idx) in items" :key="idx" role="none">
          <button
            type="button"
            role="menuitem"
            class="split-btn__item mfs-text"
            :disabled="item.disabled"
            @click="onSelect(item)"
          >
            <span v-if="item.icon" class="split-btn__icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

export interface SplitButtonItem {
  label: string
  value?: string | number
  icon?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    label?: string
    items?: SplitButtonItem[]
    variant?: 'primary' | 'secondary' | 'surface' | 'success' | 'warning' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }>(),
  {
    label: 'Action',
    items: () => [],
    variant: 'primary',
    size: 'md',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'select', item: SplitButtonItem): void
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const onSelect = (item: SplitButtonItem) => {
  if (item.disabled) return
  open.value = false
  emit('select', item)
}

const onDocClick = (e: MouseEvent) => {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && open.value) open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.split-btn {
  position: relative;
  display: inline-block;
}

.split-btn__group {
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid var(--border, transparent);
}

.split-btn__main,
.split-btn__toggle {
  border: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.split-btn__main:disabled,
.split-btn__toggle:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.split-btn__toggle {
  border-left: 1px solid rgba(255, 255, 255, 0.25);
  padding-inline: 10px;
}

.split-btn--surface .split-btn__toggle {
  border-left-color: var(--border, rgba(148, 163, 184, 0.3));
}

.split-btn--sm .split-btn__main { padding: 6px 12px; font-size: 0.82rem; }
.split-btn--md .split-btn__main { padding: 10px 18px; font-size: 0.94rem; }
.split-btn--lg .split-btn__main { padding: 13px 24px; font-size: 1.05rem; }

.split-btn__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 170px;
  margin: 0;
  padding: 6px;
  list-style: none;
  z-index: 50;
}

.split-btn__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.split-btn__item:hover:not(:disabled) {
  background-color: var(--surface-subtle);
}

.split-btn__item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.split-fade-enter-active,
.split-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.split-fade-enter-from,
.split-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

[data-theme="glass"] .split-btn__group {
  border-color: rgba(255, 255, 255, 0.3);
}

[data-theme="neo"] .split-btn__group {
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.12), -4px -4px 10px rgba(255, 255, 255, 0.75);
}
</style>
