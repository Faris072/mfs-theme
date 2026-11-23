<template>
  <span
    class="mfs-tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown.escape="hide"
  >
    <span class="mfs-tooltip__trigger" :aria-describedby="visible && content ? tooltipId : undefined">
      <slot />
    </span>

    <Transition name="mfs-tooltip">
      <span
        v-if="visible && !disabled && content"
        :id="tooltipId"
        role="tooltip"
        class="mfs-tooltip mfs-rounded-sm mfs-blur"
        :class="[`mfs-tooltip--${placement}`]"
      >
        {{ content }}
        <span class="mfs-tooltip__arrow" aria-hidden="true" />
      </span>
    </Transition>
  </span>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    disabled?: boolean
  }>(),
  {
    content: '',
    placement: 'top',
    disabled: false
  }
)

const visible = ref(false)
const tooltipId = useId()

const show = () => {
  if (!props.disabled && props.content) {
    visible.value = true
  }
}

const hide = () => {
  visible.value = false
}
</script>

<style scoped>
.mfs-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.mfs-tooltip__trigger {
  display: inline-flex;
  align-items: center;
}

.mfs-tooltip {
  --tt-bg: var(--tooltip-bg, #0f172a);
  --tt-color: var(--tooltip-text, #f8fafc);
  position: absolute;
  z-index: 10020;
  padding: 6px 11px;
  border-radius: var(--radius-sm, 8px);
  background-color: var(--tt-bg);
  color: var(--tt-color);
  border: 1px solid var(--tooltip-border, rgba(255, 255, 255, 0.14));
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.35;
  white-space: nowrap;
  max-width: min(260px, 80vw);
  pointer-events: none;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.mfs-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--tt-bg);
  transform: rotate(45deg);
}

/* Placements */
.mfs-tooltip--top {
  bottom: calc(100% + 9px);
  left: 50%;
  transform: translateX(-50%);
}
.mfs-tooltip--top .mfs-tooltip__arrow {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.mfs-tooltip--bottom {
  top: calc(100% + 9px);
  left: 50%;
  transform: translateX(-50%);
}
.mfs-tooltip--bottom .mfs-tooltip__arrow {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.mfs-tooltip--left {
  right: calc(100% + 9px);
  top: 50%;
  transform: translateY(-50%);
}
.mfs-tooltip--left .mfs-tooltip__arrow {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}

.mfs-tooltip--right {
  left: calc(100% + 9px);
  top: 50%;
  transform: translateY(-50%);
}
.mfs-tooltip--right .mfs-tooltip__arrow {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}

/* Theme Overrides */
[data-theme="clay"] .mfs-tooltip {
  --tt-bg: #241442;
  --tt-color: #ffffff;
  box-shadow: 0 8px 20px rgba(36, 20, 66, 0.28);
}

[data-theme="glass"] .mfs-tooltip {
  --tt-bg: rgba(15, 23, 42, 0.92);
  --tt-color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
}

[data-theme="neo"] .mfs-tooltip {
  --tt-bg: #334155;
  --tt-color: #f8fafc;
  box-shadow: 4px 4px 10px rgba(51, 65, 85, 0.25);
}

/* Transition */
.mfs-tooltip-enter-active,
.mfs-tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.mfs-tooltip-enter-from,
.mfs-tooltip-leave-to {
  opacity: 0;
}
</style>
