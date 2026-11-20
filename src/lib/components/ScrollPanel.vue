<template>
  <div
    class="scroll-panel mfs-surface mfs-rounded mfs-shadow-card mfs-focus-ring"
    :style="panelStyle"
    tabindex="0"
  >
    <div class="scroll-panel__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    maxHeight?: string | number
    width?: string | number
  }>(),
  {
    maxHeight: '300px'
  }
)

const toCss = (v: string | number | undefined) =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v

const panelStyle = computed(() => ({
  maxHeight: toCss(props.maxHeight),
  width: toCss(props.width)
}))
</script>

<style scoped>
.scroll-panel {
  overflow: auto;
  padding: 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) transparent;
}

.scroll-panel::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scroll-panel::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 9999px;
}

.scroll-panel::-webkit-scrollbar-thumb {
  background-color: var(--border, rgba(148, 163, 184, 0.45));
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.scroll-panel::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary);
}

[data-theme="glass"] .scroll-panel {
  border-color: rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .scroll-panel {
  box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.08), inset -3px -3px 8px rgba(255, 255, 255, 0.7);
}
</style>
