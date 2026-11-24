<template>
  <div class="infinite-scroll mfs-flex mfs-flex-col">
    <slot />

    <div v-if="isEmpty && !loading && !error" class="mfs-empty-state">
      <slot name="empty">
        <span>{{ emptyText }}</span>
      </slot>
    </div>

    <div v-if="loading" class="infinite-scroll__status mfs-flex mfs-items-center mfs-justify-center mfs-p-4" role="status" aria-live="polite">
      <slot name="loading">
        <span class="mfs-spinner" aria-label="Loading" />
      </slot>
    </div>

    <div
      v-else-if="error"
      class="mfs-soft-danger mfs-rounded mfs-flex mfs-items-center mfs-justify-between mfs-gap-3 mfs-p-3"
      role="alert"
    >
      <slot name="error" :error="error" :retry="triggerLoad">
        <span class="mfs-text-sm mfs-font-medium">{{ error }}</span>
        <Button size="sm" variant="danger" @click="triggerLoad">Retry</Button>
      </slot>
    </div>

    <div
      v-else-if="!hasMore && !isEmpty"
      class="mfs-text-sm mfs-text-muted mfs-text-center mfs-p-4"
    >
      <slot name="finished">
        <span>{{ finishedText }}</span>
      </slot>
    </div>

    <div ref="sentinelRef" class="mfs-w-full mfs-h-px mfs-pointer-events-none" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Button from './Button.vue'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    hasMore?: boolean
    error?: string
    isEmpty?: boolean
    emptyText?: string
    finishedText?: string
    rootMargin?: string
  }>(),
  {
    loading: false,
    hasMore: true,
    error: undefined,
    isEmpty: false,
    emptyText: 'No items yet.',
    finishedText: 'All items loaded',
    rootMargin: '120px'
  }
)

const emit = defineEmits<{
  (e: 'load'): void
}>()

defineSlots<{
  default?: () => unknown
  empty?: () => unknown
  loading?: () => unknown
  error?: (props: { error: string; retry: () => void }) => unknown
  finished?: () => unknown
}>()

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const triggerLoad = () => {
  emit('load')
}

const canLoad = () => props.hasMore && !props.loading && !props.error

const setupObserver = () => {
  observer?.disconnect()
  observer = null

  if (typeof IntersectionObserver === 'undefined' || !sentinelRef.value) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting) && canLoad()) {
        triggerLoad()
      }
    },
    { rootMargin: props.rootMargin }
  )

  observer.observe(sentinelRef.value)
}

watch(() => props.rootMargin, setupObserver)

onMounted(() => {
  setupObserver()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>
