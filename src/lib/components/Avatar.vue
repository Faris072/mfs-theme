<template>
  <span
    :class="[
      'avatar',
      'mfs-surface-subtle',
      'mfs-shadow',
      shape === 'circle' ? 'mfs-pill' : 'mfs-rounded',
      `avatar--${size}`,
      `avatar--${shape}`
    ]"
    :role="imgSrc ? undefined : 'img'"
    :aria-label="alt || label || 'Avatar'"
  >
    <img
      v-if="imgSrc"
      :src="imgSrc"
      :alt="alt || label || 'Avatar'"
      class="avatar__img"
      @error="onImgError"
    />
    <span v-else class="avatar__fallback">
      <slot>{{ initials }}</slot>
    </span>

    <span
      v-if="status"
      :class="[
        'avatar__status',
        status === 'online' ? 'mfs-bg-success' : status === 'busy' ? 'mfs-bg-danger' : status === 'away' ? 'mfs-bg-warning' : '',
        `avatar__status--${status}`
      ]"
      :aria-label="`Status: ${status}`"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    label?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    shape?: 'circle' | 'rounded'
    status?: 'online' | 'offline' | 'busy' | 'away'
  }>(),
  {
    size: 'md',
    shape: 'circle'
  }
)

const imgError = ref(false)

watch(
  () => props.src,
  () => {
    imgError.value = false
  }
)

const imgSrc = computed(() => (props.src && !imgError.value ? props.src : ''))

const onImgError = () => {
  imgError.value = true
}

const initials = computed(() => {
  const source = (props.label || props.alt || '').trim()
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})
</script>

<style scoped>
.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--surface-subtle);
  color: var(--text);
  font-weight: 700;
  user-select: none;
  border: 1px solid var(--border, transparent);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.avatar--sm {
  width: 32px;
  height: 32px;
  font-size: 0.75rem;
}

.avatar--md {
  width: 44px;
  height: 44px;
  font-size: 0.95rem;
}

.avatar--lg {
  width: 60px;
  height: 60px;
  font-size: 1.25rem;
}

.avatar--xl {
  width: 84px;
  height: 84px;
  font-size: 1.75rem;
}

.avatar--circle {
  border-radius: 50%;
}

.avatar--rounded {
  border-radius: var(--radius, 16px);
}

.avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  display: block;
}

.avatar__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  letter-spacing: 0.03em;
}

.avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 26%;
  height: 26%;
  min-width: 9px;
  min-height: 9px;
  border-radius: 50%;
  border: 2px solid var(--surface);
  box-sizing: border-box;
}

.avatar__status--online {
  background-color: var(--success, #22c55e);
}

.avatar__status--offline {
  background-color: var(--text-muted, #94a3b8);
}

.avatar__status--busy {
  background-color: var(--danger, #ef4444);
}

.avatar__status--away {
  background-color: var(--warning, #f59e0b);
}

[data-theme="clay"] .avatar {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .avatar {
  border: 1px solid rgba(255, 255, 255, 0.35);
}

[data-theme="neo"] .avatar {
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.12), -4px -4px 10px rgba(255, 255, 255, 0.7);
}
</style>
