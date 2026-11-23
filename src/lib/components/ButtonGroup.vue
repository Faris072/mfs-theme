<template>
  <div class="mfs-btn-group mfs-inline-flex mfs-items-center" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.mfs-btn-group :deep(> *:not(:first-child)) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -1px;
}

.mfs-btn-group :deep(> *:not(:last-child)) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.mfs-btn-group :deep(> *:hover),
.mfs-btn-group :deep(> *:focus-visible) {
  position: relative;
  z-index: 1;
}
</style>
