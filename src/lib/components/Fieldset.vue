<template>
  <fieldset :class="['fieldset', 'mfs-surface', 'mfs-rounded', 'mfs-shadow-card', 'mfs-m-0', 'mfs-min-w-0', { 'is-collapsed': isCollapsed }]">
    <legend v-if="legend || $slots.legend" class="fieldset__legend mfs-surface-subtle mfs-pill mfs-shadow mfs-title mfs-text-sm mfs-font-bold">
      <button
        v-if="toggleable"
        type="button"
        class="fieldset__btn mfs-inline-flex mfs-items-center mfs-gap-1-5 mfs-border-none mfs-bg-transparent mfs-cursor-pointer mfs-text mfs-focus-ring"
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
      <span v-else class="mfs-text">
        <slot name="legend">{{ legend }}</slot>
      </span>
    </legend>

    <div class="fieldset__collapse">
      <div class="mfs-overflow-hidden">
        <div class="mfs-pt-2">
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
  padding: 12px 20px 18px;
}

.fieldset__legend {
  padding: 4px 14px;
}

.fieldset__btn {
  padding: 2px 0;
  font: inherit;
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
</style>
