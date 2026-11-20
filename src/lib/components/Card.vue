<template>
  <div
    :class="[
      'card',
      'mfs-card',
      {
        'card--hoverable': hoverable,
        'card--bordered': bordered
      }
    ]"
  >
    <div v-if="$slots.header || title" class="card__header">
      <slot name="header">
        <div>
          <h3 v-if="title" class="card__title mfs-title">{{ title }}</h3>
          <p v-if="subtitle" class="card__subtitle mfs-caption">{{ subtitle }}</p>
        </div>
      </slot>
    </div>

    <div class="card__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    hoverable?: boolean
    bordered?: boolean
  }>(),
  {
    hoverable: false,
    bordered: false
  }
)
</script>

<style scoped>
.card {
  padding: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
}

.card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--clay-shadow-hover);
}

.card__header {
  padding: 20px 24px 12px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.05));
}

.card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.card__subtitle {
  font-size: 0.875rem;
  margin-top: 4px;
}

.card__body {
  padding: 24px;
  flex: 1 1 auto;
}

.card__footer {
  padding: 14px 24px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.05));
  background-color: var(--surface-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
</style>
