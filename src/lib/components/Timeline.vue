<template>
  <ol :class="['timeline', `timeline--${layout}`]">
    <li
      v-for="(item, index) in items"
      :key="index"
      class="timeline__item"
    >
      <div class="timeline__rail" aria-hidden="true">
        <span
          :class="[
            'timeline__dot',
            'mfs-shadow',
            item.status === 'surface' ? 'mfs-surface-subtle' : `mfs-bg-${item.status || 'primary'}`,
            `timeline__dot--${item.status || 'primary'}`
          ]"
        >
          <slot name="icon" :item="item" :index="index">
            <span v-if="item.icon" class="timeline__icon-text">{{ item.icon }}</span>
          </slot>
        </span>
        <span v-if="index < items.length - 1" class="timeline__line" />
      </div>

      <div class="timeline__content mfs-surface mfs-rounded mfs-shadow-card">
        <slot name="item" :item="item" :index="index">
          <div class="timeline__header">
            <h4 class="timeline__title mfs-title">{{ item.title }}</h4>
            <time v-if="item.timestamp" class="timeline__time mfs-caption">{{ item.timestamp }}</time>
          </div>
          <p v-if="item.description" class="timeline__desc mfs-text-muted">{{ item.description }}</p>
        </slot>
      </div>
    </li>
  </ol>
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
  }>(),
  {
    items: () => [],
    layout: 'vertical'
  }
)
</script>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.timeline__item {
  display: flex;
  gap: 16px;
}

.timeline__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline__dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #ffffff;
  border: 3px solid var(--surface);
  box-shadow: var(--clay-shadow);
  z-index: 1;
}

.timeline__dot--primary { background-color: var(--primary); }
.timeline__dot--success { background-color: var(--success); }
.timeline__dot--warning { background-color: var(--warning); }
.timeline__dot--danger { background-color: var(--danger); }
.timeline__dot--surface {
  background-color: var(--surface-subtle);
  color: var(--text);
}

.timeline__line {
  flex: 1;
  width: 2px;
  min-height: 24px;
  margin: 4px 0;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--border, rgba(148, 163, 184, 0.45)) 0 6px,
    transparent 6px 10px
  );
}

.timeline__content {
  flex: 1;
  padding: 12px 16px;
  margin-bottom: 16px;
  background-color: var(--surface);
  color: var(--text);
  border-radius: var(--radius, 16px);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.timeline__item:last-child .timeline__content {
  margin-bottom: 0;
}

.timeline__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.timeline__title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
}

.timeline__time {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.timeline__desc {
  margin: 6px 0 0;
  font-size: 0.9rem;
  color: var(--text-muted);
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
