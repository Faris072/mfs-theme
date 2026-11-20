<template>
  <div
    class="carousel mfs-surface mfs-rounded mfs-shadow-card"
    role="region"
    aria-roledescription="carousel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      class="carousel__viewport"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="resetPointer"
    >
      <div
        class="carousel__track"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel__slide"
          :aria-hidden="index !== currentIndex"
        >
          <slot :item="item" :index="index">
            <div class="carousel__fallback mfs-text">{{ item }}</div>
          </slot>
        </div>
      </div>
    </div>

    <template v-if="items.length > 1">
      <button
        type="button"
        class="carousel__btn carousel__btn--prev mfs-surface mfs-shadow mfs-pill"
        aria-label="Previous slide"
        :disabled="!loop && currentIndex === 0"
        @click="prev"
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        class="carousel__btn carousel__btn--next mfs-surface mfs-shadow mfs-pill"
        aria-label="Next slide"
        :disabled="!loop && currentIndex === items.length - 1"
        @click="next"
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div class="carousel__dots mfs-surface-subtle mfs-pill mfs-blur" role="tablist" aria-label="Slide indicators">
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          role="tab"
          :aria-selected="index === currentIndex"
          :aria-label="`Go to slide ${index + 1}`"
          :class="['carousel__dot', { 'is-active': index === currentIndex }]"
          @click="goTo(index)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts" generic="T = unknown">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    items?: T[]
    modelValue?: number
    autoplay?: boolean
    interval?: number
    loop?: boolean
  }>(),
  {
    items: () => [],
    modelValue: 0,
    autoplay: false,
    interval: 4000,
    loop: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
  (e: 'change', index: number): void
}>()

const currentIndex = ref(props.modelValue)
const paused = ref(false)
let startX: number | null = null
let timer: ReturnType<typeof setInterval> | null = null

watch(
  () => props.modelValue,
  (val) => {
    if (val >= 0 && val < props.items.length) {
      currentIndex.value = val
    }
  }
)

const goTo = (index: number) => {
  const len = props.items.length
  if (!len) return
  let target = index
  if (props.loop) {
    target = (index + len) % len
  } else {
    target = Math.max(0, Math.min(len - 1, index))
  }
  currentIndex.value = target
  emit('update:modelValue', target)
  emit('change', target)
}

const next = () => goTo(currentIndex.value + 1)
const prev = () => goTo(currentIndex.value - 1)

const onPointerDown = (e: PointerEvent) => {
  startX = e.clientX
}

const onPointerUp = (e: PointerEvent) => {
  if (startX === null) return
  const delta = e.clientX - startX
  startX = null
  if (Math.abs(delta) > 40) {
    if (delta < 0) next()
    else prev()
  }
}

const resetPointer = () => {
  startX = null
}

const stopAutoplay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const startAutoplay = () => {
  stopAutoplay()
  if (props.autoplay && props.items.length > 1) {
    timer = setInterval(() => {
      if (!paused.value) next()
    }, props.interval)
  }
}

watch(() => [props.autoplay, props.interval, props.items.length], startAutoplay)
onMounted(startAutoplay)
onBeforeUnmount(stopAutoplay)
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  border-radius: var(--radius, 20px);
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  overflow: hidden;
}

.carousel__viewport {
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

.carousel__track {
  display: flex;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.carousel__slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
}

.carousel__fallback {
  padding: 40px 24px;
  text-align: center;
  color: var(--text);
}

.carousel__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border, transparent);
  background-color: var(--surface);
  color: var(--text);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.carousel__btn:hover:not(:disabled) {
  transform: translateY(-50%) scale(1.08);
}

.carousel__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.carousel__btn--prev { left: 12px; }
.carousel__btn--next { right: 12px; }

.carousel__dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 6px 10px;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--surface-subtle);
  backdrop-filter: var(--backdrop-blur, none);
  z-index: 2;
}

.carousel__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
  border: none;
  background-color: var(--text-muted);
  opacity: 0.45;
  cursor: pointer;
  transition: width 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
}

.carousel__dot.is-active {
  width: 20px;
  border-radius: 9999px;
  background-color: var(--primary);
  opacity: 1;
}

[data-theme="glass"] .carousel,
[data-theme="glass"] .carousel__btn {
  border: 1px solid rgba(255, 255, 255, 0.28);
}

[data-theme="neo"] .carousel__btn {
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.14), -3px -3px 8px rgba(255, 255, 255, 0.75);
}
</style>
