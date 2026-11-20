<template>
  <span
    class="mfs-inline-msg mfs-rounded-sm"
    :class="[
      `mfs-inline-msg--${severity}`,
      severity === 'info' ? 'mfs-soft-primary' : `mfs-soft-${severity}`
    ]"
    role="status"
  >
    <span class="mfs-inline-msg__icon" aria-hidden="true">
      <svg v-if="severity === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <svg v-else-if="severity === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
      <svg v-else-if="severity === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </span>
    <span class="mfs-inline-msg__text">
      <slot>{{ text }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    severity?: 'info' | 'success' | 'warning' | 'danger'
    text?: string
  }>(),
  {
    severity: 'info',
    text: ''
  }
)
</script>

<style scoped>
.mfs-inline-msg {
  --im-accent: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--im-accent);
  background-color: color-mix(in srgb, var(--im-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--im-accent) 26%, transparent);
}

.mfs-inline-msg--info { --im-accent: var(--primary); }
.mfs-inline-msg--success { --im-accent: var(--success); }
.mfs-inline-msg--warning { --im-accent: var(--warning); }
.mfs-inline-msg--danger { --im-accent: var(--danger); }

.mfs-inline-msg__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: inline-flex;
}

.mfs-inline-msg__icon svg {
  width: 100%;
  height: 100%;
}

[data-theme="clay"] .mfs-inline-msg {
  box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.6), 2px 3px 8px rgba(0, 0, 0, 0.05);
}

[data-theme="glass"] .mfs-inline-msg {
  backdrop-filter: blur(10px);
}

[data-theme="neo"] .mfs-inline-msg {
  border: none;
  box-shadow: var(--input-shadow);
}
</style>
