<template>
  <div class="ctx-wrapper" @contextmenu.prevent="open">
    <slot />

    <Teleport to="body">
      <Transition name="ctx-pop">
        <ul
          v-if="visible"
          ref="menuRef"
          class="ctx-menu mfs-surface mfs-overlay mfs-shadow-card mfs-rounded-md mfs-blur"
          role="menu"
          :style="{ left: `${position.x}px`, top: `${position.y}px` }"
          @keydown="handleMenuKeydown"
        >
          <template v-for="(item, index) in items" :key="index">
            <li v-if="item.divider" class="ctx-menu__divider mfs-divider" role="separator" />
            <li v-else role="none">
              <button
                :ref="(el) => setItemRef(index, el as HTMLButtonElement | null)"
                type="button"
                role="menuitem"
                class="ctx-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
                :class="{
                  'ctx-menu__item--disabled mfs-disabled': item.disabled,
                  'ctx-menu__item--danger': item.danger
                }"
                :disabled="item.disabled"
                @click="handleSelect(item)"
              >
                <slot name="item" :item="item">
                  <span v-if="item.icon" class="ctx-menu__icon" aria-hidden="true">{{ item.icon }}</span>
                  <span class="ctx-menu__label">{{ item.label }}</span>
                </slot>
              </button>
            </li>
          </template>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'

export interface ContextMenuItem {
  label?: string
  icon?: string
  disabled?: boolean
  divider?: boolean
  danger?: boolean
  action?: () => void
}

const props = defineProps<{
  items: ContextMenuItem[]
}>()

const emit = defineEmits<{
  (e: 'select', item: ContextMenuItem): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const visible = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })
const itemRefs = new Map<number, HTMLButtonElement>()

const setItemRef = (index: number, el: HTMLButtonElement | null) => {
  if (el) itemRefs.set(index, el)
  else itemRefs.delete(index)
}

const close = () => {
  if (!visible.value) return
  visible.value = false
  removeGlobalListeners()
  emit('close')
}

const open = async (event: MouseEvent) => {
  visible.value = true
  position.value = { x: event.clientX, y: event.clientY }
  emit('open')

  await nextTick()
  const menuEl = menuRef.value
  if (menuEl) {
    const rect = menuEl.getBoundingClientRect()
    const pad = 8
    const maxX = window.innerWidth - rect.width - pad
    const maxY = window.innerHeight - rect.height - pad
    position.value = {
      x: Math.max(pad, Math.min(event.clientX, maxX)),
      y: Math.max(pad, Math.min(event.clientY, maxY))
    }
    const firstEnabled = props.items.findIndex((i) => !i.divider && !i.disabled)
    if (firstEnabled >= 0) {
      itemRefs.get(firstEnabled)?.focus()
    }
  }
  addGlobalListeners()
}

const handleSelect = (item: ContextMenuItem) => {
  if (item.disabled) return
  item.action?.()
  emit('select', item)
  close()
}

const handleMenuKeydown = (e: KeyboardEvent) => {
  const enabledIndices = props.items
    .map((item, i) => (!item.divider && !item.disabled ? i : -1))
    .filter((i) => i >= 0)
  if (!enabledIndices.length) return

  const activeEl = document.activeElement
  const currentPos = enabledIndices.findIndex((i) => itemRefs.get(i) === activeEl)

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const next = enabledIndices[(currentPos + 1) % enabledIndices.length]
    itemRefs.get(next)?.focus()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prev = enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length]
    itemRefs.get(prev)?.focus()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

const onPointerDown = (e: PointerEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    close()
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

const addGlobalListeners = () => {
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', close)
}

const removeGlobalListeners = () => {
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', close)
}

onUnmounted(() => {
  removeGlobalListeners()
})

defineExpose({ open, close })
</script>

<style scoped>
.ctx-wrapper {
  display: contents;
}

.ctx-menu {
  position: fixed;
  z-index: 10100;
  min-width: 188px;
  padding: 6px;
  list-style: none;
  background-color: var(--surface);
  color: var(--text);
  border-radius: var(--radius-md, 14px);
  border: var(--border-width, 1px) solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.ctx-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.ctx-menu__item:hover:not(:disabled),
.ctx-menu__item:focus-visible:not(:disabled) {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
  outline: none;
}

.ctx-menu__item--danger {
  color: var(--danger, #ef4444);
}

.ctx-menu__item--danger:hover:not(:disabled),
.ctx-menu__item--danger:focus-visible:not(:disabled) {
  background-color: var(--danger, #ef4444);
  color: #ffffff;
}

.ctx-menu__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ctx-menu__divider {
  height: 1px;
  margin: 5px 6px;
  background-color: var(--border, rgba(0, 0, 0, 0.08));
}

.ctx-menu__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  font-size: 0.95rem;
}

.ctx-pop-enter-active,
.ctx-pop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s cubic-bezier(0.2, 0, 0, 1);
  transform-origin: top left;
}

.ctx-pop-enter-from,
.ctx-pop-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

</style>
