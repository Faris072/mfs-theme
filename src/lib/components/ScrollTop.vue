<template>
  <Transition name="scroll-top-pop">
    <button
      v-if="visible"
      type="button"
      class="scroll-top mfs-shadow mfs-interactive"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <slot>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </slot>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    threshold?: number
    behavior?: 'smooth' | 'auto'
    target?: string | HTMLElement | null
  }>(),
  {
    threshold: 200,
    behavior: 'smooth',
    target: null
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const visible = ref(false)
let scrollEl: HTMLElement | Window | null = null

const resolveTarget = (): HTMLElement | Window => {
  if (typeof props.target === 'string') {
    return document.querySelector<HTMLElement>(props.target) ?? window
  }
  if (props.target instanceof HTMLElement) {
    return props.target
  }
  return window
}

const onScroll = () => {
  if (!scrollEl) return
  const top = scrollEl === window ? window.scrollY : (scrollEl as HTMLElement).scrollTop
  visible.value = top >= props.threshold
}

const scrollToTop = (event: MouseEvent) => {
  const el = resolveTarget()
  el.scrollTo({ top: 0, behavior: props.behavior })
  emit('click', event)
}

onMounted(() => {
  scrollEl = resolveTarget()
  scrollEl.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  scrollEl?.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.scroll-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid var(--border, transparent);
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
}

.scroll-top:hover {
  background-color: var(--primary-hover, var(--primary));
  box-shadow: var(--clay-shadow-hover);
  transform: translateY(-3px);
}

.scroll-top:active {
  box-shadow: var(--clay-shadow-active);
  transform: scale(0.94);
}

.scroll-top-pop-enter-active,
.scroll-top-pop-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scroll-top-pop-enter-from,
.scroll-top-pop-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.85);
}

@media (max-width: 640px) {
  .scroll-top {
    right: 16px;
    bottom: 16px;
    width: 44px;
    height: 44px;
  }
}
</style>
