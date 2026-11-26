<template>
  <ol
    class="steps mfs-flex mfs-w-full mfs-gap-2"
    :class="[`steps--${direction}`]"
    aria-label="Progress steps"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      class="steps__item mfs-flex mfs-items-center mfs-gap-2"
      :class="[`steps__item--${resolveStatus(item, index)}`, { 'steps__item--clickable': clickable }]"
      :aria-current="resolveStatus(item, index) === 'active' ? 'step' : undefined"
    >
      <button
        v-if="clickable"
        type="button"
        class="steps__trigger mfs-inline-flex mfs-items-center mfs-border-none mfs-rounded-md mfs-w-full-mobile"
        @click="handleStepClick(index)"
      >
        <span class="steps__circle mfs-inline-flex mfs-items-center mfs-justify-center mfs-font-bold mfs-surface mfs-shadow">
          <svg
            v-if="resolveStatus(item, index) === 'completed'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else-if="resolveStatus(item, index) === 'error'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </span>

        <span class="steps__content mfs-flex mfs-flex-col">
          <span class="steps__label mfs-font-semibold">{{ item.label }}</span>
          <span v-if="item.description" class="steps__desc mfs-text-muted">{{ item.description }}</span>
        </span>
      </button>

      <div
        v-else
        class="steps__trigger mfs-inline-flex mfs-items-center mfs-border-none mfs-rounded-md mfs-w-full-mobile"
      >
        <span class="steps__circle mfs-inline-flex mfs-items-center mfs-justify-center mfs-font-bold mfs-surface mfs-shadow">
          <svg
            v-if="resolveStatus(item, index) === 'completed'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else-if="resolveStatus(item, index) === 'error'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </span>

        <span class="steps__content mfs-flex mfs-flex-col">
          <span class="steps__label mfs-font-semibold">{{ item.label }}</span>
          <span v-if="item.description" class="steps__desc mfs-text-muted">{{ item.description }}</span>
        </span>
      </div>

      <span
        v-if="index < items.length - 1"
        class="steps__connector mfs-surface-subtle mfs-shadow-inset mfs-pill"
        :class="{ 'steps__connector--completed': resolveStatus(item, index) === 'completed' }"
        aria-hidden="true"
      />
    </li>
  </ol>
</template>

<script setup lang="ts">
export interface StepItem {
  label: string
  description?: string
  status?: 'completed' | 'active' | 'upcoming' | 'error'
}

const props = withDefaults(
  defineProps<{
    items: StepItem[]
    modelValue?: number
    clickable?: boolean
    direction?: 'horizontal' | 'vertical' | 'responsive'
  }>(),
  {
    modelValue: 0,
    clickable: false,
    direction: 'responsive'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
  (e: 'change', index: number): void
}>()

const resolveStatus = (item: StepItem, index: number) => {
  if (item.status) return item.status
  if (index < props.modelValue) return 'completed'
  if (index === props.modelValue) return 'active'
  return 'upcoming'
}

const handleStepClick = (index: number) => {
  if (!props.clickable || index === props.modelValue) return
  emit('update:modelValue', index)
  emit('change', index)
}
</script>

<style scoped>
.steps {
  list-style: none;
}

.steps--horizontal,
.steps--responsive {
  flex-direction: row;
  align-items: flex-start;
}

.steps--vertical {
  flex-direction: column;
}

.steps__item {
  position: relative;
  flex: 1;
}

.steps--vertical .steps__item {
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.steps__item:last-child {
  flex: 0 1 auto;
}

.steps__trigger {
  gap: 10px;
  background: transparent;
  padding: 6px 10px;
  font-family: inherit;
  color: inherit;
  text-align: left;
  overflow: visible;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.steps__item--clickable .steps__trigger {
  cursor: pointer;
}

.steps__item--clickable .steps__trigger:hover {
  background-color: var(--surface-subtle);
}

.steps__circle {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: background-color 0.25s cubic-bezier(0.2, 0, 0, 1), color 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.steps__item--active .steps__circle {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.steps__item--completed .steps__circle {
  background-color: var(--success, #10b981);
  color: #ffffff;
}

.steps__item--error .steps__circle {
  background-color: var(--danger, #ef4444);
  color: #ffffff;
}

.steps__content {
  gap: 2px;
}

.steps__label {
  font-size: 0.92rem;
  color: var(--text-muted);
}

.steps__item--active .steps__label,
.steps__item--completed .steps__label {
  color: var(--text);
}

.steps__desc {
  font-size: 0.8rem;
}

.steps__connector {
  flex: 1;
  height: 3px;
  min-width: 20px;
  transition: background-color 0.25s ease;
}

.steps__connector--completed {
  background-color: var(--success, #10b981);
}

.steps--vertical .steps__connector {
  width: 3px;
  height: 24px;
  min-width: 3px;
  margin-left: 22px;
}

@media (max-width: 640px) {
  .steps--responsive {
    flex-direction: column;
  }

  .steps--responsive .steps__item {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .steps--responsive .steps__connector {
    width: 3px;
    height: 20px;
    min-width: 3px;
    margin-left: 22px;
  }
}

[data-theme="clay"] .steps__item--active .steps__circle {
  box-shadow: 0 4px 10px color-mix(in srgb, var(--primary) 30%, transparent), inset 2px 2px 4px rgba(255, 255, 255, 0.45), inset -2px -2px 4px rgba(15, 23, 42, 0.18);
}

[data-theme="glass"] .steps__item--active .steps__circle {
  box-shadow: var(--glow);
}

[data-theme="brutalism"] .steps__circle {
  box-shadow: 2px 2px 0 var(--border);
}
</style>
