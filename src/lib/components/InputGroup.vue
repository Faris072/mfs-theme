<template>
  <div class="ig-wrapper mfs-flex mfs-w-full mfs-overflow-hidden mfs-surface mfs-rounded mfs-shadow-inset">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ig-wrapper {
  display: flex;
  align-items: stretch;
  width: 100%;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ig-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 22%, transparent), var(--input-shadow);
}

.ig-wrapper :deep(> *) {
  min-width: 0;
  border-radius: 0 !important;
  box-shadow: none !important;
  border-top: none !important;
  border-bottom: none !important;
}

.ig-wrapper :deep(> *:not(:last-child)) {
  border-right: 1px solid var(--border);
}

.ig-wrapper :deep(.ig-addon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  background-color: var(--surface-subtle);
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

[data-theme="glass"] .ig-wrapper { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .ig-wrapper { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
</style>
