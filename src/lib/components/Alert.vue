<template>
  <div
    class="mfs-alert mfs-surface mfs-rounded mfs-shadow mfs-blur"
    :class="[`mfs-alert--${severity}`]"
    role="alert"
  >
    <span class="mfs-alert__icon" aria-hidden="true">
      <slot name="icon">
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
      </slot>
    </span>

    <div class="mfs-alert__content">
      <div v-if="title" class="mfs-alert__title mfs-title">{{ title }}</div>
      <div class="mfs-alert__body mfs-text-muted">
        <slot />
      </div>
    </div>

    <button
      v-if="closable"
      type="button"
      class="mfs-alert__close mfs-surface-subtle mfs-pill mfs-focus-ring"
      aria-label="Close alert"
      @click="emit('close')"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    severity?: 'info' | 'success' | 'warning' | 'danger'
    title?: string
    closable?: boolean
  }>(),
  {
    severity: 'info',
    closable: false
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.mfs-alert {
  --alert-accent: var(--primary);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius, 16px);
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border, transparent);
  border-left: 4px solid var(--alert-accent);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.mfs-alert--info { --alert-accent: var(--primary); }
.mfs-alert--success { --alert-accent: var(--success); }
.mfs-alert--warning { --alert-accent: var(--warning); }
.mfs-alert--danger { --alert-accent: var(--danger); }

.mfs-alert__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--alert-accent);
  margin-top: 2px;
}

.mfs-alert__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.mfs-alert__content {
  flex: 1;
  min-width: 0;
}

.mfs-alert__title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 3px;
  line-height: 1.35;
}

.mfs-alert__body {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.45;
}

.mfs-alert__close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--surface-subtle);
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, color 0.15s ease;
}

.mfs-alert__close svg {
  width: 15px;
  height: 15px;
}

.mfs-alert__close:hover {
  color: var(--text);
  transform: scale(1.08);
}

/* Theme Overrides */
[data-theme="clay"] .mfs-alert {
  background-color: color-mix(in srgb, var(--alert-accent) 8%, var(--surface));
}

[data-theme="glass"] .mfs-alert {
  background-color: color-mix(in srgb, var(--alert-accent) 14%, rgba(255, 255, 255, 0.06));
  border-color: color-mix(in srgb, var(--alert-accent) 35%, rgba(255, 255, 255, 0.18));
  border-left: 4px solid var(--alert-accent);
}

[data-theme="neo"] .mfs-alert {
  box-shadow: var(--clay-shadow);
  border: none;
  border-left: 4px solid var(--alert-accent);
}
</style>
