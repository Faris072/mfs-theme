<template>
  <span
    class="mfs-relative mfs-inline-flex mfs-items-center"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown.escape="hide"
  >
    <span class="mfs-inline-flex mfs-items-center" :aria-describedby="visible && content ? tooltipId : undefined">
      <slot />
    </span>

    <Transition name="mfs-tooltip">
      <span
        v-if="visible && !disabled && content"
        :id="tooltipId"
        role="tooltip"
        class="mfs-tooltip mfs-absolute mfs-surface mfs-rounded-sm mfs-shadow-card mfs-blur mfs-whitespace-nowrap mfs-font-semibold"
        :class="[`mfs-tooltip--${placement}`]"
      >
        {{ content }}
        <span class="mfs-tooltip__arrow mfs-absolute" aria-hidden="true" />
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
.mfs-tooltip {
  z-index: 10020;
  padding: 6px 11px;
  font-size: 0.78rem;
  line-height: 1.35;
  max-width: min(260px, 80vw);
  pointer-events: none;
}

.mfs-tooltip__arrow {
  width: 8px;
  height: 8px;
  background-color: var(--surface);
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
  border-right: var(--border-width, 1px) solid var(--border);
  border-bottom: var(--border-width, 1px) solid var(--border);
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
  border-left: var(--border-width, 1px) solid var(--border);
  border-top: var(--border-width, 1px) solid var(--border);
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
  border-top: var(--border-width, 1px) solid var(--border);
  border-right: var(--border-width, 1px) solid var(--border);
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
  border-bottom: var(--border-width, 1px) solid var(--border);
  border-left: var(--border-width, 1px) solid var(--border);
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
