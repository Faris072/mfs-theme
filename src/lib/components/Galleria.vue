<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <div
      ref="rootRef"
      class="mfs-galleria mfs-surface mfs-rounded mfs-shadow-card mfs-blur"
      :class="{ 'mfs-galleria--fullscreen': isFullscreen }"
      :aria-busy="loading || undefined"
      :role="isFullscreen ? 'dialog' : undefined"
      :aria-modal="isFullscreen || undefined"
      tabindex="0"
      @keydown.left.prevent="prev"
      @keydown.right.prevent="next"
      @keydown.escape="isFullscreen = false"
    >
    <div class="mfs-galleria__stage">
      <div v-if="loading" class="mfs-loading-overlay" role="status" aria-live="polite">
        <slot name="loading">
          <span class="mfs-spinner" aria-hidden="true" />
        </slot>
      </div>

      <div v-if="!loading && images.length === 0" class="mfs-empty-state">
        <slot name="empty">{{ emptyText }}</slot>
      </div>

      <template v-else>
        <img
          v-if="currentImage"
          :src="currentImage.src"
          :alt="currentImage.alt || currentImage.title || 'Gallery image'"
          class="mfs-galleria__image"
        />

        <button
          v-if="images.length > 1"
          type="button"
          class="mfs-galleria__nav mfs-galleria__nav--prev mfs-surface-subtle mfs-pill mfs-focus-ring"
          aria-label="Previous image"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          v-if="images.length > 1"
          type="button"
          class="mfs-galleria__nav mfs-galleria__nav--next mfs-surface-subtle mfs-pill mfs-focus-ring"
          aria-label="Next image"
          @click="next"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <button
          v-if="images.length > 0"
          type="button"
          class="mfs-galleria__fs mfs-surface-subtle mfs-pill mfs-focus-ring"
          :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
          @click="isFullscreen = !isFullscreen"
        >
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
          </svg>
        </button>

        <div v-if="currentImage?.title" class="mfs-galleria__caption">
          {{ currentImage.title }}
        </div>
      </template>
    </div>

    <div v-if="showThumbnails && images.length > 1" class="mfs-galleria__thumbs">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        class="mfs-galleria__thumb mfs-rounded-sm"
        :class="{ 'mfs-galleria__thumb--active': idx === currentIndex }"
        :aria-label="`View image ${idx + 1}`"
        @click="setIndex(idx)"
      >
        <img :src="img.thumbnail || img.src" :alt="img.alt || `Thumbnail ${idx + 1}`" />
      </button>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

export interface GalleriaImage {
  src: string
  alt?: string
  title?: string
  thumbnail?: string
}

const props = withDefaults(
  defineProps<{
    images?: GalleriaImage[]
    activeIndex?: number
    showThumbnails?: boolean
    fullscreen?: boolean
    loading?: boolean
    emptyText?: string
  }>(),
  {
    images: () => [],
    activeIndex: 0,
    showThumbnails: true,
    fullscreen: false,
    loading: false,
    emptyText: 'No images'
  }
)

const emit = defineEmits<{
  (e: 'update:activeIndex', index: number): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const currentIndex = ref(props.activeIndex)
const isFullscreen = ref(props.fullscreen)

watch(
  () => props.activeIndex,
  (val) => {
    currentIndex.value = val
  }
)

watch(
  () => props.fullscreen,
  (val) => {
    isFullscreen.value = val
  }
)

const onWindowKeydown = (e: KeyboardEvent) => {
  if (!isFullscreen.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    isFullscreen.value = false
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

watch(isFullscreen, (val) => {
  if (typeof window === 'undefined') return
  if (val) {
    window.addEventListener('keydown', onWindowKeydown)
    nextTick(() => rootRef.value?.focus())
  } else {
    window.removeEventListener('keydown', onWindowKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onWindowKeydown)
  }
})

const currentImage = computed(() => props.images[currentIndex.value] ?? null)

const setIndex = (idx: number) => {
  if (props.images.length === 0) return
  const next = (idx + props.images.length) % props.images.length
  currentIndex.value = next
  emit('update:activeIndex', next)
}

const prev = () => setIndex(currentIndex.value - 1)
const next = () => setIndex(currentIndex.value + 1)
</script>

<style scoped>
.mfs-galleria {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  outline: none;
}

.mfs-galleria--fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  z-index: 9999;
  border-radius: 0 !important;
  background-color: rgba(2, 6, 23, 0.94) !important;
}

.mfs-galleria__stage {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mfs-galleria--fullscreen .mfs-galleria__stage {
  flex: 1;
  min-height: 0;
  aspect-ratio: auto;
}

.mfs-galleria--fullscreen .mfs-galleria__nav,
.mfs-galleria--fullscreen .mfs-galleria__fs {
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(255, 255, 255, 0.22);
}

.mfs-galleria__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mfs-galleria__nav,
.mfs-galleria__fs {
  position: absolute;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: var(--border-width, 1px) solid var(--border, transparent);
  transition: transform 0.15s ease;
}

.mfs-galleria__nav svg,
.mfs-galleria__fs svg {
  width: 18px;
  height: 18px;
}

.mfs-galleria__nav:hover,
.mfs-galleria__fs:hover {
  opacity: 0.9;
}

.mfs-galleria__nav--prev { left: 12px; top: 50%; transform: translateY(-50%); }
.mfs-galleria__nav--next { right: 12px; top: 50%; transform: translateY(-50%); }
.mfs-galleria__nav--prev:hover,
.mfs-galleria__nav--next:hover { transform: translateY(-50%); }

.mfs-galleria__fs { top: 12px; right: 12px; }

.mfs-galleria__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
}

.mfs-galleria__thumbs {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  overflow-x: auto;
  background-color: var(--surface-subtle);
}

.mfs-galleria__thumb {
  flex-shrink: 0;
  width: 64px;
  height: 44px;
  padding: 0;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.65;
  transition: opacity 0.15s ease, border-color 0.15s ease;
}

.mfs-galleria__thumb--active,
.mfs-galleria__thumb:hover {
  opacity: 1;
  border-color: var(--primary);
}

.mfs-galleria__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

[data-theme="neo"] .mfs-galleria {
  border: none;
}

@media (max-width: 640px) {
  .mfs-galleria__nav,
  .mfs-galleria__fs {
    width: 32px;
    height: 32px;
  }
}
</style>
