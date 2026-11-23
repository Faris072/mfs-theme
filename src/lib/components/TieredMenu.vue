<template>
  <nav class="tiered-menu mfs-surface mfs-rounded-md mfs-blur" aria-label="Tiered menu">
    <ul class="tiered-menu__list" role="menubar">
      <template v-for="(item, idx) in items" :key="idx">
        <li v-if="item.separator" class="tiered-menu__separator mfs-divider" role="separator" />
        <li
          v-else
          class="tiered-menu__node"
          role="none"
          @mouseenter="openLevel1 = idx"
          @mouseleave="openLevel1 = null; openLevel2 = null"
        >
          <component
            :is="item.items?.length ? 'button' : item.to ? 'router-link' : item.href ? 'a' : 'button'"
            :to="!item.items?.length ? item.to : undefined"
            :href="!item.items?.length ? item.href : undefined"
            :type="item.items?.length || (!item.to && !item.href) ? 'button' : undefined"
            role="menuitem"
            class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
            :class="{
              'tiered-menu__item--active': openLevel1 === idx,
              'tiered-menu__item--disabled mfs-disabled': item.disabled
            }"
            :aria-haspopup="item.items?.length ? 'true' : undefined"
            :aria-expanded="item.items?.length ? openLevel1 === idx : undefined"
            :disabled="item.disabled"
            @click="onClickItem(item, 1, idx)"
          >
            <span v-if="item.icon" class="tiered-menu__icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="tiered-menu__label">{{ item.label }}</span>
            <svg
              v-if="item.items?.length"
              class="tiered-menu__chevron"
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

          <ul
            v-if="item.items?.length && openLevel1 === idx"
            class="tiered-menu__submenu mfs-surface mfs-overlay mfs-shadow-card mfs-rounded-md mfs-blur"
            role="menu"
          >
            <template v-for="(sub, sIdx) in item.items" :key="sIdx">
              <li v-if="sub.separator" class="tiered-menu__separator mfs-divider" role="separator" />
              <li
                v-else
                class="tiered-menu__node"
                role="none"
                @mouseenter="openLevel2 = sIdx"
                @mouseleave="openLevel2 = null"
              >
                <component
                  :is="sub.items?.length ? 'button' : sub.to ? 'router-link' : sub.href ? 'a' : 'button'"
                  :to="!sub.items?.length ? sub.to : undefined"
                  :href="!sub.items?.length ? sub.href : undefined"
                  :type="sub.items?.length || (!sub.to && !sub.href) ? 'button' : undefined"
                  role="menuitem"
                  class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
                  :class="{
                    'tiered-menu__item--active': openLevel2 === sIdx,
                    'tiered-menu__item--disabled mfs-disabled': sub.disabled
                  }"
                  :aria-haspopup="sub.items?.length ? 'true' : undefined"
                  :aria-expanded="sub.items?.length ? openLevel2 === sIdx : undefined"
                  :disabled="sub.disabled"
                  @click="onClickItem(sub, 2, sIdx)"
                >
                  <span v-if="sub.icon" class="tiered-menu__icon" aria-hidden="true">{{ sub.icon }}</span>
                  <span class="tiered-menu__label">{{ sub.label }}</span>
                  <svg
                    v-if="sub.items?.length"
                    class="tiered-menu__chevron"
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

                <ul
                  v-if="sub.items?.length && openLevel2 === sIdx"
                  class="tiered-menu__submenu mfs-surface mfs-overlay mfs-shadow-card mfs-rounded-md mfs-blur"
                  role="menu"
                >
                  <template v-for="(leaf, lIdx) in sub.items" :key="lIdx">
                    <li v-if="leaf.separator" class="tiered-menu__separator mfs-divider" role="separator" />
                    <li v-else role="none">
                      <component
                        :is="leaf.to ? 'router-link' : leaf.href ? 'a' : 'button'"
                        :to="leaf.to"
                        :href="leaf.href"
                        :type="!leaf.to && !leaf.href ? 'button' : undefined"
                        role="menuitem"
                        class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
                        :class="{ 'tiered-menu__item--disabled mfs-disabled': leaf.disabled }"
                        :disabled="leaf.disabled"
                        @click="onClickItem(leaf, 3, lIdx)"
                      >
                        <span v-if="leaf.icon" class="tiered-menu__icon" aria-hidden="true">{{ leaf.icon }}</span>
                        <span class="tiered-menu__label">{{ leaf.label }}</span>
                      </component>
                    </li>
                  </template>
                </ul>
              </li>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface TieredMenuItem {
  label?: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  separator?: boolean
  command?: () => void
  items?: TieredMenuItem[]
}

defineProps<{
  items: TieredMenuItem[]
}>()

const emit = defineEmits<{
  (e: 'select', item: TieredMenuItem): void
}>()

const openLevel1 = ref<number | null>(null)
const openLevel2 = ref<number | null>(null)

const onClickItem = (item: TieredMenuItem, level: number, idx: number) => {
  if (item.disabled) return
  if (item.items?.length) {
    if (level === 1) {
      openLevel1.value = openLevel1.value === idx ? null : idx
      openLevel2.value = null
    } else if (level === 2) {
      openLevel2.value = openLevel2.value === idx ? null : idx
    }
    return
  }
  item.command?.()
  emit('select', item)
  openLevel1.value = null
  openLevel2.value = null
}
</script>

<style scoped>
.tiered-menu {
  width: 220px;
  padding: 6px;
}

.tiered-menu__list,
.tiered-menu__submenu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tiered-menu__node {
  position: relative;
}

.tiered-menu__submenu {
  position: absolute;
  top: 0;
  left: calc(100% + 6px);
  min-width: 200px;
  padding: 6px;
  z-index: 200;
}

.tiered-menu__item {
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

.tiered-menu__item:hover:not(.tiered-menu__item--disabled),
.tiered-menu__item--active {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.tiered-menu__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tiered-menu__label {
  flex: 1;
}

.tiered-menu__chevron {
  flex-shrink: 0;
}

.tiered-menu__separator {
  height: 1px;
  margin: 5px 8px;
  background-color: var(--border, rgba(0, 0, 0, 0.08));
}

@media (max-width: 640px) {
  .tiered-menu {
    width: 100%;
  }

  .tiered-menu__submenu {
    position: static;
    margin-top: 4px;
    margin-left: 14px;
    box-shadow: none;
  }
}

</style>
