<template>
  <div class="inplace">
    <div
      v-if="!isActive"
      class="inplace__display mfs-surface-subtle mfs-rounded-sm mfs-interactive mfs-focus-ring"
      :class="{ 'inplace__display--disabled mfs-disabled': disabled }"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
    >
      <slot name="display">
        <span class="mfs-text-muted">Click to edit</span>
      </slot>
    </div>

    <div
      v-else
      class="inplace__content mfs-surface mfs-rounded-md mfs-shadow"
      @keydown.esc="close"
    >
      <div class="inplace__inner">
        <slot name="content" />
      </div>
      <button
        v-if="closable"
        type="button"
        class="inplace__close mfs-surface-subtle mfs-rounded-sm mfs-interactive"
        aria-label="Close"
        @click="close"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    closable?: boolean
    disabled?: boolean
  }>(),
  {
    active: false,
    closable: true,
    disabled: false
  }
)

const emit = defineEmits<{
  'update:active': [value: boolean]
  open: []
  close: []
}>()

const localActive = ref(props.active)

watch(
  () => props.active,
  (val) => {
    localActive.value = val
  }
)

const isActive = computed(() => localActive.value)

function open() {
  if (props.disabled || isActive.value) return
  localActive.value = true
  emit('update:active', true)
  emit('open')
}

function close() {
  if (!isActive.value) return
  localActive.value = false
  emit('update:active', false)
  emit('close')
}
</script>

<style scoped>
.inplace {
  display: inline-block;
  max-width: 100%;
}

.inplace__display {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  min-height: 36px;
}

.inplace__display--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.inplace__content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
}

.inplace__inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inplace__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text);
  flex-shrink: 0;
}

.inplace__close svg {
  width: 14px;
  height: 14px;
}

[data-theme="clay"] .inplace__close {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .inplace__content {
  backdrop-filter: var(--backdrop-blur, blur(16px));
}

[data-theme="neo"] .inplace__close {
  box-shadow: var(--clay-shadow);
}
</style>
