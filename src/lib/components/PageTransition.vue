<template>
  <Transition
    :name="`mfs-pt-${resolvedVariant}`"
    :mode="mode === 'default' ? undefined : mode"
    :style="{ '--mfs-pt-duration': `${duration}ms` }"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type PageTransitionVariant = 'slide-up' | 'fade' | 'slide-left' | 'scale'
export type PageTransitionMode = 'out-in' | 'in-out' | 'default'

const props = withDefaults(
  defineProps<{
    variant?: PageTransitionVariant
    name?: PageTransitionVariant
    mode?: PageTransitionMode
    duration?: number
  }>(),
  {
    mode: 'out-in',
    duration: 220
  }
)

const resolvedVariant = computed(() => props.variant ?? props.name ?? 'slide-up')
</script>

<style>
.mfs-pt-slide-up-enter-active,
.mfs-pt-slide-up-leave-active,
.mfs-pt-fade-enter-active,
.mfs-pt-fade-leave-active,
.mfs-pt-slide-left-enter-active,
.mfs-pt-slide-left-leave-active,
.mfs-pt-scale-enter-active,
.mfs-pt-scale-leave-active {
  transition:
    opacity var(--mfs-pt-duration, 220ms) cubic-bezier(0.16, 1, 0.3, 1),
    transform var(--mfs-pt-duration, 220ms) cubic-bezier(0.16, 1, 0.3, 1);
}

.mfs-pt-fade-enter-from,
.mfs-pt-fade-leave-to {
  opacity: 0;
}

.mfs-pt-slide-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.mfs-pt-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mfs-pt-slide-left-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.mfs-pt-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

.mfs-pt-scale-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.mfs-pt-scale-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
  .mfs-pt-slide-up-enter-active,
  .mfs-pt-slide-up-leave-active,
  .mfs-pt-fade-enter-active,
  .mfs-pt-fade-leave-active,
  .mfs-pt-slide-left-enter-active,
  .mfs-pt-slide-left-leave-active,
  .mfs-pt-scale-enter-active,
  .mfs-pt-scale-leave-active {
    transition: none;
  }

  .mfs-pt-slide-up-enter-from,
  .mfs-pt-slide-up-leave-to,
  .mfs-pt-slide-left-enter-from,
  .mfs-pt-slide-left-leave-to,
  .mfs-pt-scale-enter-from,
  .mfs-pt-scale-leave-to {
    transform: none;
  }
}
</style>
