<template>
  <div class="accordion">
    <slot v-if="!items.length" />
    <div
      v-for="item in items"
      :key="item.key"
      :class="[
        'accordion__item',
        'mfs-surface',
        'mfs-rounded',
        'mfs-shadow-card',
        { 'is-open': isOpen(item.key), 'is-disabled mfs-disabled': item.disabled }
      ]"
    >
      <button
        type="button"
        class="accordion__trigger mfs-focus-ring"
        :aria-expanded="isOpen(item.key)"
        :aria-controls="`acc-panel-${item.key}`"
        :disabled="item.disabled"
        @click="toggle(item.key)"
      >
        <span class="accordion__title mfs-title">{{ item.title }}</span>
        <svg
          class="accordion__chevron"
          viewBox="0 0 20 20"
          width="18"
          height="18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div
        :id="`acc-panel-${item.key}`"
        class="accordion__panel"
        role="region"
      >
        <div class="accordion__body">
          <slot name="item" :item="item" :open="isOpen(item.key)">
            <p v-if="item.content" class="accordion__text mfs-text-muted">{{ item.content }}</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface AccordionItem {
  key: string | number
  title: string
  content?: string
  disabled?: boolean
}

type Key = string | number

const props = withDefaults(
  defineProps<{
    items?: AccordionItem[]
    multiple?: boolean
    modelValue?: Key | Key[] | null
  }>(),
  {
    items: () => [],
    multiple: false,
    modelValue: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Key | Key[] | null): void
  (e: 'change', value: Key | Key[] | null): void
}>()

const normalize = (val: Key | Key[] | null | undefined): Key[] => {
  if (val === undefined || val === null) return []
  return Array.isArray(val) ? val : [val]
}

const internalKeys = ref<Key[]>(normalize(props.modelValue))

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) {
      internalKeys.value = normalize(val)
    }
  }
)

const activeKeys = computed(() =>
  props.modelValue !== undefined ? normalize(props.modelValue) : internalKeys.value
)

const isOpen = (key: Key) => activeKeys.value.includes(key)

const toggle = (key: Key) => {
  const open = isOpen(key)
  let next: Key[]

  if (props.multiple) {
    next = open ? activeKeys.value.filter((k) => k !== key) : [...activeKeys.value, key]
  } else {
    next = open ? [] : [key]
  }

  internalKeys.value = next
  const payload = props.multiple ? next : (next[0] ?? null)
  emit('update:modelValue', payload)
  emit('change', payload)
}
</script>

<style scoped>
.accordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.accordion__item {
  background-color: var(--surface);
  color: var(--text);
  border-radius: var(--radius, 18px);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.accordion__item.is-disabled {
  opacity: 0.55;
}

.accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.accordion__trigger:disabled {
  cursor: not-allowed;
}

.accordion__chevron {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.accordion__item.is-open .accordion__chevron {
  transform: rotate(180deg);
  color: var(--primary);
}

.accordion__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.28s ease;
}

.accordion__item.is-open .accordion__panel {
  grid-template-rows: 1fr;
}

.accordion__body {
  overflow: hidden;
}

.accordion__text {
  margin: 0;
  padding: 0 20px 18px;
  color: var(--text-muted);
  font-size: 0.94rem;
  line-height: 1.55;
}

[data-theme="clay"] .accordion__item {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .accordion__item {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .accordion__item.is-open {
  box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.08), inset -3px -3px 8px rgba(255, 255, 255, 0.65);
}
</style>
