<template>
  <button
    type="button"
    class="tb-btn mfs-surface mfs-rounded mfs-shadow mfs-interactive mfs-text mfs-focus-ring"
    :class="{ 'tb-btn--active mfs-border-primary': modelValue }"
    :aria-pressed="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <slot>{{ modelValue ? onLabel : offLabel }}</slot>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    onLabel?: string
    offLabel?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    onLabel: 'On',
    offLabel: 'Off',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const toggle = () => {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<style scoped>
.tb-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; font-family: inherit; font-size: 0.95rem; font-weight: 600; min-height: 40px; }
.tb-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.tb-btn--active { background-color: var(--primary); color: var(--primary-text, #ffffff); border-color: var(--primary); }

[data-theme="clay"] .tb-btn--active { box-shadow: 4px 8px 18px rgba(124, 58, 237, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.45); }
[data-theme="glass"] .tb-btn { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .tb-btn { box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.55), -4px -4px 8px rgba(255, 255, 255, 0.85); }
[data-theme="neo"] .tb-btn--active { box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2), 2px 2px 6px rgba(163, 177, 198, 0.4); }
</style>
