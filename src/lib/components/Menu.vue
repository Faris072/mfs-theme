<template>
  <Teleport v-if="popup" to="body">
    <Transition name="menu-pop">
      <div
        v-if="visible"
        ref="menuRef"
        class="menu menu--popup mfs-surface mfs-overlay mfs-shadow-card mfs-rounded-md mfs-blur"
        role="menu"
        :style="{ left: `${position.x}px`, top: `${position.y}px` }"
        @keydown="onKeydown"
      >
        <ul class="menu__list">
          <template v-for="(item, idx) in items" :key="idx">
            <li v-if="item.separator" class="menu__separator mfs-divider" role="separator" />
            <li v-else-if="item.items?.length" class="menu__group" role="presentation">
              <div v-if="item.label" class="menu__group-label mfs-text-muted">{{ item.label }}</div>
              <ul class="menu__sublist">
                <li v-for="(sub, sIdx) in item.items" :key="sIdx" role="none">
                  <component
                    :is="sub.to ? 'router-link' : sub.href ? 'a' : 'button'"
                    :to="sub.to"
                    :href="sub.href"
                    :type="!sub.to && !sub.href ? 'button' : undefined"
                    role="menuitem"
                    class="menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
                    :class="{ 'menu__item--disabled mfs-disabled': sub.disabled }"
                    :disabled="sub.disabled"
                    @click="handleSelect(sub)"
                  >
                    <slot name="item" :item="sub">
                      <span v-if="sub.icon" class="menu__icon" aria-hidden="true">{{ sub.icon }}</span>
                      <span class="menu__label">{{ sub.label }}</span>
                    </slot>
                  </component>
                </li>
              </ul>
            </li>
            <li v-else role="none">
              <component
                :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
                :to="item.to"
                :href="item.href"
                :type="!item.to && !item.href ? 'button' : undefined"
                role="menuitem"
                class="menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
                :class="{ 'menu__item--disabled mfs-disabled': item.disabled }"
                :disabled="item.disabled"
                @click="handleSelect(item)"
              >
                <slot name="item" :item="item">
                  <span v-if="item.icon" class="menu__icon" aria-hidden="true">{{ item.icon }}</span>
                  <span class="menu__label">{{ item.label }}</span>
                </slot>
              </component>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </Teleport>

  <div v-else class="menu mfs-surface mfs-rounded-md mfs-blur" role="menu" @keydown="onKeydown">
    <ul class="menu__list">
      <template v-for="(item, idx) in items" :key="idx">
        <li v-if="item.separator" class="menu__separator mfs-divider" role="separator" />
        <li v-else-if="item.items?.length" class="menu__group" role="presentation">
          <div v-if="item.label" class="menu__group-label mfs-text-muted">{{ item.label }}</div>
          <ul class="menu__sublist">
            <li v-for="(sub, sIdx) in item.items" :key="sIdx" role="none">
              <component
                :is="sub.to ? 'router-link' : sub.href ? 'a' : 'button'"
                :to="sub.to"
                :href="sub.href"
                :type="!sub.to && !sub.href ? 'button' : undefined"
                role="menuitem"
                class="menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
                :class="{ 'menu__item--disabled mfs-disabled': sub.disabled }"
                :disabled="sub.disabled"
                @click="handleSelect(sub)"
              >
                <slot name="item" :item="sub">
                  <span v-if="sub.icon" class="menu__icon" aria-hidden="true">{{ sub.icon }}</span>
                  <span class="menu__label">{{ sub.label }}</span>
                </slot>
              </component>
            </li>
          </ul>
        </li>
        <li v-else role="none">
          <component
            :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
            :to="item.to"
            :href="item.href"
            :type="!item.to && !item.href ? 'button' : undefined"
            role="menuitem"
            class="menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
            :class="{ 'menu__item--disabled mfs-disabled': item.disabled }"
            :disabled="item.disabled"
            @click="handleSelect(item)"
          >
            <slot name="item" :item="item">
              <span v-if="item.icon" class="menu__icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="menu__label">{{ item.label }}</span>
            </slot>
          </component>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue'

export interface MenuItem {
  label?: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  separator?: boolean
  command?: () => void
  items?: MenuItem[]
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    popup?: boolean
  }>(),
  {
    popup: false
  }
)

const emit = defineEmits<{
  (e: 'select', item: MenuItem): void
}>()

const visible = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })

const close = () => {
  visible.value = false
  removeListeners()
}

const open = async (event: MouseEvent) => {
  if (!props.popup) return
  visible.value = true
  const target = event.currentTarget as HTMLElement | null
  const rect = target?.getBoundingClientRect()
  position.value = rect
    ? { x: rect.left, y: rect.bottom + 6 }
    : { x: event.clientX, y: event.clientY }

  await nextTick()
  if (menuRef.value) {
    const mRect = menuRef.value.getBoundingClientRect()
    const pad = 8
    position.value = {
      x: Math.max(pad, Math.min(position.value.x, window.innerWidth - mRect.width - pad)),
      y: Math.max(pad, Math.min(position.value.y, window.innerHeight - mRect.height - pad))
    }
  }
  addListeners()
}

const toggle = (event: MouseEvent) => {
  if (visible.value) close()
  else open(event)
}

const handleSelect = (item: MenuItem) => {
  if (item.disabled) return
  item.command?.()
  emit('select', item)
  if (props.popup) close()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.popup) close()
}

const onPointerDown = (e: PointerEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) close()
}

const addListeners = () => {
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('resize', close)
}

const removeListeners = () => {
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('resize', close)
}

onUnmounted(removeListeners)
defineExpose({ open, close, toggle })
</script>

<style scoped>
.menu {
  min-width: 210px;
  padding: 6px;
}

.menu--popup {
  position: fixed;
  z-index: 9500;
}

.menu__list,
.menu__sublist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu__group-label {
  padding: 8px 12px 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  min-height: 38px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  color: var(--text);
  background: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.menu__item:hover:not(.menu__item--disabled),
.menu__item:focus-visible:not(.menu__item--disabled) {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
  outline: none;
}

.menu__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.menu__separator {
  height: 1px;
  margin: 5px 8px;
  background-color: var(--border, rgba(0, 0, 0, 0.08));
}

.menu__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
}

.menu-pop-enter-active,
.menu-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

</style>
