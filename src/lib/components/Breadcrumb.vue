<template>
  <nav class="breadcrumb mfs-surface mfs-pill mfs-inline-flex mfs-items-center" aria-label="Breadcrumb">
    <ol class="breadcrumb__list mfs-flex mfs-flex-wrap mfs-items-center">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb__item mfs-inline-flex mfs-items-center"
      >
        <span
          v-if="index > 0"
          class="breadcrumb__separator mfs-inline-flex mfs-items-center mfs-text-muted"
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
            class="breadcrumb__leaf mfs-text mfs-font-semibold"
            :class="{ 'breadcrumb__leaf--disabled mfs-disabled': item.disabled }"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
          >
            {{ item.label }}
          </span>

          <button
            v-else-if="!item.to && !item.href"
            type="button"
            class="breadcrumb__link mfs-inline-flex mfs-items-center mfs-rounded-sm mfs-border-none mfs-font-medium mfs-text"
            @click="emit('navigate', item, $event)"
          >
            {{ item.label }}
          </button>

          <component
            :is="item.to ? 'router-link' : 'a'"
            v-else
            :to="item.to"
            :href="item.href"
            class="breadcrumb__link mfs-inline-flex mfs-items-center mfs-rounded-sm mfs-border-none mfs-font-medium mfs-text"
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
  padding: 6px 14px;
  max-width: 100%;
}

.breadcrumb__list {
  gap: 6px;
  list-style: none;
}

.breadcrumb__item {
  gap: 6px;
  font-size: 0.88rem;
}

.breadcrumb__separator {
  opacity: 0.7;
  user-select: none;
}

.breadcrumb__link {
  padding: 3px 8px;
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: inherit;
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
}

.breadcrumb__leaf--disabled {
  color: var(--text-muted);
  opacity: 0.5;
  font-weight: 500;
}
</style>
