import type { Directive, DirectiveBinding } from 'vue'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipOptions {
  value?: string
  disabled?: boolean
  class?: string
}

export type TooltipBindingValue = string | TooltipOptions | null | undefined

interface TooltipState {
  text: string
  disabled: boolean
  placement: TooltipPlacement
  customClass?: string
  tipEl?: HTMLDivElement
  show: () => void
  hide: () => void
}

interface TooltipElement extends HTMLElement {
  __mfsTooltipState?: TooltipState
}

function resolvePlacement(modifiers: DirectiveBinding['modifiers']): TooltipPlacement {
  if (modifiers.right) return 'right'
  if (modifiers.bottom) return 'bottom'
  if (modifiers.left) return 'left'
  return 'top'
}

function parseBinding(binding: DirectiveBinding<TooltipBindingValue>): Omit<TooltipState, 'show' | 'hide'> {
  const placement = resolvePlacement(binding.modifiers)
  const raw = binding.value
  if (typeof raw === 'string') {
    return { text: raw, disabled: false, placement }
  }
  if (raw && typeof raw === 'object') {
    return {
      text: raw.value ?? '',
      disabled: Boolean(raw.disabled),
      placement,
      customClass: raw.class
    }
  }
  return { text: '', disabled: true, placement }
}

function positionTooltip(target: HTMLElement, tip: HTMLDivElement, placement: TooltipPlacement): void {
  const rect = target.getBoundingClientRect()
  const tipRect = tip.getBoundingClientRect()
  const gap = 8

  let top = 0
  let left = 0

  switch (placement) {
    case 'bottom':
      top = rect.bottom + gap
      left = rect.left + rect.width / 2 - tipRect.width / 2
      break
    case 'left':
      top = rect.top + rect.height / 2 - tipRect.height / 2
      left = rect.left - tipRect.width - gap
      break
    case 'right':
      top = rect.top + rect.height / 2 - tipRect.height / 2
      left = rect.right + gap
      break
    case 'top':
    default:
      top = rect.top - tipRect.height - gap
      left = rect.left + rect.width / 2 - tipRect.width / 2
      break
  }

  const maxLeft = Math.max(8, window.innerWidth - tipRect.width - 8)
  const maxTop = Math.max(8, window.innerHeight - tipRect.height - 8)
  tip.style.top = `${Math.min(Math.max(8, top), maxTop)}px`
  tip.style.left = `${Math.min(Math.max(8, left), maxLeft)}px`
}

function removeTooltip(state: TooltipState): void {
  if (state.tipEl) {
    state.tipEl.remove()
    state.tipEl = undefined
  }
}

export const vTooltip: Directive<TooltipElement, TooltipBindingValue> = {
  mounted(el, binding) {
    const parsed = parseBinding(binding)
    const state: TooltipState = {
      ...parsed,
      show: () => {
        if (state.disabled || !state.text) return
        removeTooltip(state)

        const tip = document.createElement('div')
        tip.setAttribute('role', 'tooltip')
        tip.textContent = state.text
        if (state.customClass) {
          tip.className = state.customClass
        }
        Object.assign(tip.style, {
          position: 'fixed',
          zIndex: '10020',
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm, 8px)',
          backgroundColor: 'var(--tooltip-bg, #0f172a)',
          color: 'var(--tooltip-text, #f8fafc)',
          border: '1px solid var(--tooltip-border, rgba(255, 255, 255, 0.14))',
          fontSize: '0.78rem',
          fontWeight: '600',
          lineHeight: '1.35',
          maxWidth: 'min(260px, 80vw)',
          pointerEvents: 'none',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
          whiteSpace: 'nowrap'
        })

        document.body.appendChild(tip)
        positionTooltip(el, tip, state.placement)
        state.tipEl = tip
      },
      hide: () => removeTooltip(state)
    }

    el.__mfsTooltipState = state
    el.addEventListener('mouseenter', state.show)
    el.addEventListener('mouseleave', state.hide)
    el.addEventListener('focusin', state.show)
    el.addEventListener('focusout', state.hide)
  },
  updated(el, binding) {
    const state = el.__mfsTooltipState
    if (!state) return
    const parsed = parseBinding(binding)
    state.text = parsed.text
    state.disabled = parsed.disabled
    state.placement = parsed.placement
    state.customClass = parsed.customClass
    if (state.disabled || !state.text) {
      removeTooltip(state)
    } else if (state.tipEl) {
      state.tipEl.textContent = state.text
      positionTooltip(el, state.tipEl, state.placement)
    }
  },
  unmounted(el) {
    const state = el.__mfsTooltipState
    if (!state) return
    el.removeEventListener('mouseenter', state.show)
    el.removeEventListener('mouseleave', state.hide)
    el.removeEventListener('focusin', state.show)
    el.removeEventListener('focusout', state.hide)
    removeTooltip(state)
    delete el.__mfsTooltipState
  }
}

export default vTooltip
