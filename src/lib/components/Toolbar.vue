<template>
  <div class="toolbar mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-3 mfs-w-full mfs-surface mfs-rounded mfs-shadow-card" role="toolbar">
    <div v-if="$slots.start || $slots.default" class="toolbar__group toolbar__group--start mfs-flex mfs-flex-wrap mfs-items-center mfs-gap-2 mfs-w-full-mobile">
      <slot name="start">
        <slot />
      </slot>
    </div>
    <div v-if="$slots.center" class="toolbar__group toolbar__group--center mfs-flex mfs-flex-wrap mfs-items-center mfs-gap-2 mfs-w-full-mobile">
      <slot name="center" />
    </div>
    <div v-if="$slots.end" class="toolbar__group toolbar__group--end mfs-flex mfs-flex-wrap mfs-items-center mfs-gap-2 mfs-w-full-mobile">
      <slot name="end" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Responsive toolbar with start/center/end slots
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
}

.toolbar__group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.toolbar__group--center {
  margin-inline: auto;
}

.toolbar__group--end {
  margin-left: auto;
}

[data-theme="clay"] .toolbar {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .toolbar {
  border-color: rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .toolbar {
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.75);
}

@media (max-width: 640px) {
  .toolbar {
    padding: 10px 12px;
  }
}
</style>
