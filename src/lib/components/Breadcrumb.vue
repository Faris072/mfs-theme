<template>
  <nav class="breadcrumb mfs-surface mfs-shadow mfs-pill" aria-label="Breadcrumb">
    <ol class="breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb__item"
      >
        <span
          v-if="index > 0"
          class="breadcrumb__separator mfs-text-muted"
          aria-hidden="true"
        >
          <slot name="separator">
            <span v-if="separator === 'slash'">/</span>
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </slot>
        </span>

        <slot name="item" :item="item" :is-last="index === items.length - 1">
          <span
            v-if="index === items.length - 1 || item.disabled"
            class="breadcrumb__leaf mfs-text"
            :class="{ 'breadcrumb__leaf--disabled': item.disabled }"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
          >
            {{ item.label }}
          </span>

          <component
            :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
            v-else
            :to="item.to"
            :href="item.href"
            :type="!item.to && !item.href ? 'button' : undefined"
            class="breadcrumb__link"
            @click="emit('navigate', item, $event)"
          >
            {{ item.label }}
          </component>
        </slot>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  href?: string
  to?: string | Record<string, unknown>
  disabled?: boolean
}

withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    separator?: 'slash' | 'chevron'
  }>(),
  {
    separator: 'chevron'
  }
)

const emit = defineEmits<{
  (e: 'navigate', item: BreadcrumbItem, event: MouseEvent): void
}>()
</script>

<style scoped>
.breadcrumb {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  max-width: 100%;
}

.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  list-style: none;
}

.breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
}

.breadcrumb__separator {
  display: inline-flex;
  align-items: center;
  color: var(--text-muted);
  opacity: 0.7;
  user-select: none;
}

.breadcrumb__link {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: var(--radius-sm, 8px);
  color: var(--text-muted);
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.breadcrumb__link:hover {
  color: var(--primary);
  background-color: var(--surface-subtle);
}

.breadcrumb__leaf {
  padding: 3px 8px;
  font-weight: 600;
  color: var(--text);
}

.breadcrumb__leaf--disabled {
  color: var(--text-muted);
  opacity: 0.5;
  font-weight: 500;
}
</style>
