<template>
  <div
    class="timeline-container mfs-relative"
    :class="{ 'timeline-container--loading-empty': loading && items.length === 0 }"
    :aria-busy="loading || undefined"
  >
    <div v-if="loading" class="mfs-loading-overlay" role="status" aria-live="polite">
      <slot name="loading">
        <span class="mfs-spinner" aria-hidden="true" />
      </slot>
    </div>

    <div v-if="!loading && items.length === 0" class="mfs-empty-state">
      <slot name="empty">{{ emptyText }}</slot>
    </div>

    <ol v-else-if="items.length > 0" :class="['timeline mfs-m-0 mfs-p-0 mfs-flex mfs-flex-col', `timeline--${layout}`]">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="timeline__item mfs-flex mfs-gap-4"
      >
        <div class="timeline__rail mfs-flex mfs-flex-col mfs-items-center mfs-shrink-0" aria-hidden="true">
          <span
            :class="[
              'timeline__dot',
              'mfs-shadow',
              'mfs-rounded-full',
              'mfs-flex',
              'mfs-items-center',
              'mfs-justify-center',
              item.status === 'surface' ? 'mfs-surface-subtle' : `mfs-bg-${item.status || 'primary'}`,
              `timeline__dot--${item.status || 'primary'}`
            ]"
          >
            <slot name="icon" :item="item" :index="index">
              <span v-if="item.icon" class="timeline__icon-text">{{ item.icon }}</span>
            </slot>
          </span>
          <span v-if="index < items.length - 1" class="timeline__line mfs-flex-1 mfs-my-1" />
        </div>

        <div class="timeline__content mfs-surface mfs-rounded mfs-shadow-card mfs-flex-1 mfs-mb-4">
          <slot name="item" :item="item" :index="index">
            <div class="timeline__header mfs-flex mfs-justify-between mfs-gap-2-5 mfs-flex-wrap">
              <h4 class="timeline__title mfs-title mfs-m-0 mfs-font-bold">{{ item.title }}</h4>
              <time v-if="item.timestamp" class="timeline__time mfs-caption">{{ item.timestamp }}</time>
            </div>
            <p v-if="item.description" class="timeline__desc mfs-text-muted mfs-m-0">{{ item.description }}</p>
          </slot>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
export interface TimelineItem {
  title: string
  description?: string
  timestamp?: string
  status?: 'primary' | 'success' | 'warning' | 'danger' | 'surface'
  icon?: string
}

withDefaults(
  defineProps<{
    items?: TimelineItem[]
    layout?: 'vertical' | 'horizontal'
    loading?: boolean
    emptyText?: string
  }>(),
  {
    items: () => [],
    layout: 'vertical',
    loading: false,
    emptyText: 'No items'
  }
)
</script>

<style scoped>
.timeline-container--loading-empty {
  min-height: 96px;
}

.timeline {
  list-style: none;
}

.timeline__dot {
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  border: 3px solid var(--surface);
  z-index: 1;
}

.timeline__line {
  width: 2px;
  min-height: 24px;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--border, rgba(148, 163, 184, 0.45)) 0 6px,
    transparent 6px 10px
  );
}

.timeline__content {
  padding: 12px 16px;
}

.timeline__item:last-child .timeline__content {
  margin-bottom: 0;
}

.timeline__header {
  align-items: baseline;
}

.timeline__title {
  font-size: 0.98rem;
}

.timeline__desc {
  margin-top: 6px;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Horizontal layout */
.timeline--horizontal {
  flex-direction: row;
  overflow-x: auto;
  gap: 0;
}

.timeline--horizontal .timeline__item {
  flex-direction: column;
  flex: 1 0 200px;
  gap: 12px;
}

.timeline--horizontal .timeline__rail {
  flex-direction: row;
  width: 100%;
}

.timeline--horizontal .timeline__line {
  width: auto;
  height: 2px;
  min-height: 0;
  margin: 0 6px;
  background-image: repeating-linear-gradient(
    to right,
    var(--border, rgba(148, 163, 184, 0.45)) 0 6px,
    transparent 6px 10px
  );
}

.timeline--horizontal .timeline__content {
  margin-bottom: 0;
  margin-right: 12px;
}

.timeline--horizontal .timeline__item:last-child .timeline__content {
  margin-right: 0;
}

@media (max-width: 640px) {
  .timeline--horizontal {
    flex-direction: column;
  }

  .timeline--horizontal .timeline__item {
    flex-direction: row;
    flex: initial;
  }

  .timeline--horizontal .timeline__rail {
    flex-direction: column;
    width: auto;
  }

  .timeline--horizontal .timeline__line {
    width: 2px;
    height: auto;
    min-height: 24px;
    margin: 4px 0;
    background-image: repeating-linear-gradient(
      to bottom,
      var(--border, rgba(148, 163, 184, 0.45)) 0 6px,
      transparent 6px 10px
    );
  }

  .timeline--horizontal .timeline__content {
    margin-right: 0;
    margin-bottom: 16px;
  }
}

[data-theme="glass"] .timeline__content {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .timeline__dot {
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15), -2px -2px 6px rgba(255, 255, 255, 0.75);
}
</style>
