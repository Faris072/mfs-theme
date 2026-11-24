<template>
  <div ref="targetRef" class="mfs-w-full">
    <slot v-if="loaded" />
    <slot v-else name="placeholder">
      <div class="mfs-inset mfs-rounded mfs-p-6 mfs-text-center mfs-text-sm mfs-text-muted">
        Loading...
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    rootMargin?: string
    threshold?: number
    once?: boolean
  }>(),
  {
    rootMargin: '0px',
    threshold: 0,
    once: true
  }
)

const emit = defineEmits<{
  (e: 'load'): void
}>()

const loaded = ref(false)
const targetRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !targetRef.value) {
    loaded.value = true
    emit('load')
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        loaded.value = true
        emit('load')
        if (props.once) {
          observer?.disconnect()
          observer = null
        }
      }
    },
    { rootMargin: props.rootMargin, threshold: props.threshold }
  )

  observer.observe(targetRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>
