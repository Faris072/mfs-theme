<template>
  <span
    class="ig-addon mfs-inline-flex mfs-items-center mfs-justify-center mfs-whitespace-nowrap mfs-text-muted mfs-text-sm mfs-font-semibold"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ig-addon {
  padding: 0 12px;
  background-color: var(--surface-subtle);
  color: var(--text-muted);
}
</style>
