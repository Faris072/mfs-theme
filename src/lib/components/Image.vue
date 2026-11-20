<template>
  <div
    :class="['mfs-image', 'mfs-surface-subtle', 'mfs-rounded', 'mfs-shadow-card', { 'mfs-image--preview': preview && loaded && !error }]"
    :style="wrapperStyle"
    @click="openPreview"
  >
    <div v-if="!loaded && !error" class="mfs-image__placeholder" aria-hidden="true" />

    <div v-if="error" class="mfs-image__error mfs-text-muted" role="img" :aria-label="alt || 'Image failed to load'">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8" />
        <path d="M4 16l4.5-4.5a1.5 1.5 0 012.1 0L15 16m-2-2l1.8-1.8a1.5 1.5 0 012.1 0L20 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="9" cy="9" r="1.3" fill="currentColor" />
      </svg>
      <span class="mfs-image__error-text">Failed to load</span>
    </div>

    <img
      v-show="!error"
      :src="src"
      :alt="alt"
      :style="{ objectFit: fit }"
      :class="['mfs-image__img', { 'is-loaded': loaded }]"
      @load="onLoad"
      @error="onError"
    />

    <Teleport to="body">
      <Transition name="img-fade">
        <div
          v-if="showPreview"
          class="mfs-image__modal mfs-blur"
          role="dialog"
          aria-modal="true"
          :aria-label="alt || 'Image preview'"
          @click="closePreview"
        >
          <button
            type="button"
            class="mfs-image__close"
            aria-label="Close preview"
            @click.stop="closePreview"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <img
            :src="src"
            :alt="alt"
            class="mfs-image__modal-img"
            @click.stop
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
    preview?: boolean
    fit?: 'cover' | 'contain' | 'fill' | 'none'
  }>(),
  {
    alt: '',
    preview: false,
    fit: 'cover'
  }
)

const loaded = ref(false)
const error = ref(false)
const showPreview = ref(false)

const toCssUnit = (v: string | number | undefined) =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v

const wrapperStyle = computed(() => ({
  width: toCssUnit(props.width),
  height: toCssUnit(props.height)
}))

watch(
  () => props.src,
  () => {
    loaded.value = false
    error.value = false
  }
)

const onLoad = () => {
  loaded.value = true
  error.value = false
}

const onError = () => {
  loaded.value = false
  error.value = true
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closePreview()
}

const openPreview = () => {
  if (props.preview && loaded.value && !error.value) {
    showPreview.value = true
    window.addEventListener('keydown', onKeyDown)
  }
}

const closePreview = () => {
  showPreview.value = false
  window.removeEventListener('keydown', onKeyDown)
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.mfs-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: var(--radius, 16px);
  background-color: var(--surface-subtle);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
}

.mfs-image--preview {
  cursor: zoom-in;
}

.mfs-image__img {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  filter: blur(10px);
  transform: scale(1.03);
  transition: opacity 0.35s ease, filter 0.35s ease, transform 0.35s ease;
}

.mfs-image__img.is-loaded {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}

.mfs-image__placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, var(--surface-subtle) 25%, var(--surface) 50%, var(--surface-subtle) 75%);
  background-size: 200% 100%;
  animation: mfs-shimmer 1.4s infinite linear;
}

.mfs-image__error {
  width: 100%;
  height: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.mfs-image__modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.mfs-image__modal-img {
  max-width: 92vw;
  max-height: 88vh;
  border-radius: var(--radius, 16px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  object-fit: contain;
}

.mfs-image__close {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.65);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity 0.2s ease;
}

.img-fade-enter-from,
.img-fade-leave-to {
  opacity: 0;
}

@keyframes mfs-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

[data-theme="glass"] .mfs-image {
  border: 1px solid rgba(255, 255, 255, 0.28);
}

[data-theme="neo"] .mfs-image {
  box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.12), -5px -5px 12px rgba(255, 255, 255, 0.75);
}
</style>
