<template>
  <div class="mfs-blockui" :aria-busy="blocked">
    <slot />

    <Teleport to="body" :disabled="!fullScreen">
      <Transition name="mfs-blockui-fade">
        <div
          v-if="blocked"
          class="mfs-blockui__overlay mfs-backdrop"
          :class="{ 'mfs-blockui__overlay--fullscreen': fullScreen, 'mfs-rounded': !fullScreen }"
          role="status"
          :aria-label="label || 'Loading'"
        >
          <slot name="overlay">
            <div class="mfs-blockui__content mfs-surface mfs-rounded mfs-shadow">
              <span class="mfs-blockui__spinner" aria-hidden="true">
                <svg viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="90 150" />
                </svg>
              </span>
              <span v-if="label" class="mfs-blockui__label mfs-text">{{ label }}</span>
            </div>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    blocked?: boolean
    fullScreen?: boolean
    label?: string
  }>(),
  {
    blocked: false,
    fullScreen: false,
    label: ''
  }
)
</script>

<style scoped>
.mfs-blockui {
  position: relative;
}

.mfs-blockui__overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  background-color: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.mfs-blockui__overlay--fullscreen {
  position: fixed;
  z-index: 10060;
}

.mfs-blockui__content {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
}

.mfs-blockui__spinner {
  width: 24px;
  height: 24px;
  color: var(--primary);
  display: inline-flex;
}

.mfs-blockui__spinner svg {
  width: 100%;
  height: 100%;
  animation: mfs-blockui-spin 1s linear infinite;
}

.mfs-blockui__label {
  font-size: 0.9rem;
  font-weight: 600;
}

@keyframes mfs-blockui-spin {
  100% { transform: rotate(360deg); }
}

[data-theme="glass"] .mfs-blockui__content {
  background-color: rgba(15, 23, 42, 0.85);
}

[data-theme="neo"] .mfs-blockui__content {
  border: none;
}

.mfs-blockui-fade-enter-active,
.mfs-blockui-fade-leave-active {
  transition: opacity 0.2s ease;
}

.mfs-blockui-fade-enter-from,
.mfs-blockui-fade-leave-to {
  opacity: 0;
}
</style>
