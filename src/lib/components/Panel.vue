<template>
  <section :class="['panel', 'mfs-surface', 'mfs-rounded', 'mfs-shadow-card', { 'is-collapsed': isCollapsed }]">
    <header v-if="header || $slots.header || toggleable" class="panel__header">
      <div class="panel__title mfs-title">
        <slot name="header">{{ header }}</slot>
      </div>
      <div class="panel__actions">
        <slot name="icons" />
        <button
          v-if="toggleable"
          type="button"
          class="panel__toggle mfs-surface-subtle mfs-pill mfs-interactive mfs-focus-ring"
          :aria-expanded="!isCollapsed"
          aria-label="Toggle panel"
          @click="toggle"
        >
          <svg
            :class="['panel__chevron', { 'is-collapsed': isCollapsed }]"
            viewBox="0 0 20 20"
            width="16"
            height="16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </header>

    <div class="panel__collapse">
      <div class="panel__inner">
        <div class="panel__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="panel__footer mfs-surface-subtle mfs-caption">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    header?: string
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
.panel {
  width: 100%;
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, rgba(148, 163, 184, 0.2));
}

.panel.is-collapsed .panel__header {
  border-bottom-color: transparent;
}

.panel__title {
  font-size: 1.05rem;
  font-weight: 700;
}

.panel__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.panel__toggle {
  width: 30px;
  height: 30px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.panel__chevron {
  transition: transform 0.25s ease;
}

.panel__chevron.is-collapsed {
  transform: rotate(-90deg);
}

.panel__collapse {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.28s ease;
}

.panel.is-collapsed .panel__collapse {
  grid-template-rows: 0fr;
}

.panel__inner {
  overflow: hidden;
}

.panel__body {
  padding: 18px 20px;
}

.panel__footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border, rgba(148, 163, 184, 0.2));
  font-size: 0.88rem;
}

[data-theme="clay"] .panel {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .panel {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .panel__toggle {
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.12), -2px -2px 6px rgba(255, 255, 255, 0.7);
}
</style>
