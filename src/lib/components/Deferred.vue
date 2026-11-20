<template>
  <div ref="targetRef" class="deferred">
    <slot v-if="loaded" />
    <slot v-else name="placeholder">
      <div class="deferred__placeholder mfs-surface-subtle mfs-rounded mfs-caption">
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

<style scoped>
.deferred {
  width: 100%;
}

.deferred__placeholder {
  padding: 24px;
  text-align: center;
  font-size: 0.9rem;
}

[data-theme="glass"] .deferred__placeholder {
  border-color: rgba(255, 255, 255, 0.2);
}

[data-theme="neo"] .deferred__placeholder {
  box-shadow: inset 2px 2px 6px rgba(0, 0, 0, 0.08), inset -2px -2px 6px rgba(255, 255, 255, 0.7);
}
</style>
