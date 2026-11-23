<template>
  <div class="slide-menu mfs-surface mfs-overlay mfs-rounded-md mfs-blur" :style="{ width: menuWidth }">
    <div v-if="stack.length > 0" class="slide-menu__header">
      <button
        type="button"
        class="slide-menu__back mfs-surface-subtle mfs-rounded-sm mfs-interactive mfs-text"
        @click="goBack"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>{{ backLabel }}</span>
      </button>
      <span class="slide-menu__title mfs-title">{{ currentTitle }}</span>
    </div>

    <div class="slide-menu__viewport">
      <Transition :name="direction === 'forward' ? 'slide-fwd' : 'slide-bck'" mode="out-in">
        <ul :key="stack.length" class="slide-menu__list" role="menu">
          <li v-for="(item, idx) in currentItems" :key="idx" role="none">
            <component
              :is="item.items?.length ? 'button' : item.to ? 'router-link' : item.href ? 'a' : 'button'"
              :to="!item.items?.length ? item.to : undefined"
              :href="!item.items?.length ? item.href : undefined"
              :type="item.items?.length || (!item.to && !item.href) ? 'button' : undefined"
              role="menuitem"
              class="slide-menu__item mfs-rounded-sm mfs-text"
              :class="{ 'slide-menu__item--disabled mfs-disabled': item.disabled }"
              :disabled="item.disabled"
              @click="handleItem(item)"
            >
              <span v-if="item.icon" class="slide-menu__icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="slide-menu__label">{{ item.label }}</span>
              <svg
                v-if="item.items?.length"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </component>
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface SlideMenuItem {
  label: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  command?: () => void
  items?: SlideMenuItem[]
}

const props = withDefaults(
  defineProps<{
    items: SlideMenuItem[]
    backLabel?: string
    menuWidth?: string
  }>(),
  {
    backLabel: 'Back',
    menuWidth: '260px'
  }
)

const emit = defineEmits<{
  (e: 'select', item: SlideMenuItem): void
}>()

const stack = ref<{ title: string; items: SlideMenuItem[] }[]>([])
const direction = ref<'forward' | 'back'>('forward')

const currentItems = computed(() =>
  stack.value.length ? stack.value[stack.value.length - 1].items : props.items
)
const currentTitle = computed(() =>
  stack.value.length ? stack.value[stack.value.length - 1].title : ''
)

const handleItem = (item: SlideMenuItem) => {
  if (item.disabled) return
  if (item.items?.length) {
    direction.value = 'forward'
    stack.value.push({ title: item.label, items: item.items })
    return
  }
  item.command?.()
  emit('select', item)
}

const goBack = () => {
  if (!stack.value.length) return
  direction.value = 'back'
  stack.value.pop()
}
</script>

<style scoped>
.slide-menu {
  overflow: hidden;
  padding: 6px;
  max-width: 100%;
}

.slide-menu__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 4px 8px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.08));
}

.slide-menu__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  color: var(--text);
  background: transparent;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
}

.slide-menu__title {
  font-size: 0.88rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slide-menu__viewport {
  overflow: hidden;
}

.slide-menu__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slide-menu__item {
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

.slide-menu__item:hover:not(.slide-menu__item--disabled) {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.slide-menu__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.slide-menu__label {
  flex: 1;
}

.slide-fwd-enter-active,
.slide-fwd-leave-active,
.slide-bck-enter-active,
.slide-bck-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.slide-fwd-enter-from { opacity: 0; transform: translateX(18px); }
.slide-fwd-leave-to { opacity: 0; transform: translateX(-18px); }
.slide-bck-enter-from { opacity: 0; transform: translateX(-18px); }
.slide-bck-leave-to { opacity: 0; transform: translateX(18px); }
</style>
