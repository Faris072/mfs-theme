<template>
  <fieldset :class="['fieldset', 'mfs-surface', 'mfs-rounded', 'mfs-shadow-card', { 'is-collapsed': isCollapsed }]">
    <legend v-if="legend || $slots.legend" class="fieldset__legend mfs-surface-subtle mfs-pill mfs-shadow mfs-title">
      <button
        v-if="toggleable"
        type="button"
        class="fieldset__btn mfs-text mfs-focus-ring"
        :aria-expanded="!isCollapsed"
        @click="toggle"
      >
        <svg
          :class="['fieldset__chevron', { 'is-collapsed': isCollapsed }]"
          viewBox="0 0 20 20"
          width="15"
          height="15"
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <slot name="legend">{{ legend }}</slot>
      </button>
      <span v-else class="fieldset__label mfs-text">
        <slot name="legend">{{ legend }}</slot>
      </span>
    </legend>

    <div class="fieldset__collapse">
      <div class="fieldset__inner">
        <div class="fieldset__body">
          <slot />
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    legend?: string
    toggleable?: boolean
    collapsed?: boolean
  }>(),
  {
    toggleable: false,
    collapsed: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'toggle', value: boolean): void
}>()

const internalCollapsed = ref(false)
watch(
  () => props.collapsed,
  (v) => {
    if (v !== undefined) internalCollapsed.value = v
  },
  { immediate: true }
)

const isCollapsed = computed(() => (props.collapsed !== undefined ? props.collapsed : internalCollapsed.value))

const toggle = () => {
  const next = !isCollapsed.value
  internalCollapsed.value = next
  emit('update:collapsed', next)
  emit('toggle', next)
}
</script>

<style scoped>
.fieldset {
  margin: 0;
  padding: 12px 20px 18px;
  min-width: 0;
}

.fieldset__legend {
  padding: 4px 14px;
  font-size: 0.92rem;
  font-weight: 700;
}

.fieldset__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  border: none;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.fieldset__chevron {
  transition: transform 0.25s ease;
}

.fieldset__chevron.is-collapsed {
  transform: rotate(-90deg);
}

.fieldset__collapse {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.28s ease;
}

.fieldset.is-collapsed .fieldset__collapse {
  grid-template-rows: 0fr;
}

.fieldset__inner {
  overflow: hidden;
}

.fieldset__body {
  padding-top: 8px;
}

[data-theme="glass"] .fieldset {
  border-color: rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .fieldset__legend {
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(255, 255, 255, 0.7);
}
</style>
