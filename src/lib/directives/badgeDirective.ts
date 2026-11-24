import type { Directive, DirectiveBinding } from 'vue'

export type BadgeSeverity = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

export interface BadgeOptions {
  value: string | number
  severity?: BadgeSeverity
}

export type BadgeBindingValue = string | number | BadgeOptions | null | undefined

interface BadgeState {
  badgeEl?: HTMLSpanElement
  hadStaticPosition: boolean
  previousPosition: string
}

interface BadgeElement extends HTMLElement {
  __mfsBadgeState?: BadgeState
}

const SEVERITY_STYLES: Record<BadgeSeverity, { bg: string; color: string }> = {
  primary: { bg: 'var(--primary, #3b82f6)', color: 'var(--primary-text, #ffffff)' },
  secondary: { bg: 'var(--secondary, #64748b)', color: 'var(--secondary-text, #ffffff)' },
  success: { bg: 'var(--success, #22c55e)', color: 'var(--success-text, #ffffff)' },
  warning: { bg: 'var(--warning, #f59e0b)', color: 'var(--warning-text, #1e293b)' },
  danger: { bg: 'var(--danger, #ef4444)', color: 'var(--danger-text, #ffffff)' }
}

function parseBinding(binding: DirectiveBinding<BadgeBindingValue>): { text: string; severity: BadgeSeverity } | null {
  const raw = binding.value
  if (raw === null || raw === undefined || raw === '') {
    return null
  }
  if (typeof raw === 'string' || typeof raw === 'number') {
    return { text: String(raw), severity: 'primary' }
  }
  if (typeof raw === 'object') {
    if (raw.value === null || raw.value === undefined || raw.value === '') {
      return null
    }
    return {
      text: String(raw.value),
      severity: raw.severity ?? 'primary'
    }
  }
  return null
}

function ensurePositionedHost(el: BadgeElement, state: BadgeState): void {
  if (typeof window === 'undefined') return
  const computed = getComputedStyle(el)
  if (computed.position === 'static') {
    state.hadStaticPosition = true
    state.previousPosition = el.style.position
    el.style.position = 'relative'
  }
}

function createBadgeElement(): HTMLSpanElement {
  const badge = document.createElement('span')
  Object.assign(badge.style, {
    position: 'absolute',
    top: '0',
    right: '0',
    transform: 'translate(40%, -40%)',
    zIndex: '1',
    pointerEvents: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    padding: '0 6px',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: '700',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)'
  })
  return badge
}

function syncBadge(el: BadgeElement, binding: DirectiveBinding<BadgeBindingValue>, state: BadgeState): void {
  const parsed = parseBinding(binding)
  if (!parsed) {
    if (state.badgeEl) {
      state.badgeEl.remove()
      state.badgeEl = undefined
    }
    return
  }

  ensurePositionedHost(el, state)

  if (!state.badgeEl) {
    state.badgeEl = createBadgeElement()
    el.appendChild(state.badgeEl)
  }

  const palette = SEVERITY_STYLES[parsed.severity] ?? SEVERITY_STYLES.primary
  state.badgeEl.className = `mfs-badge mfs-pill mfs-bg-${parsed.severity}`
  state.badgeEl.style.backgroundColor = palette.bg
  state.badgeEl.style.color = palette.color
  state.badgeEl.textContent = parsed.text
}

export const vBadge: Directive<BadgeElement, BadgeBindingValue> = {
  mounted(el, binding) {
    const state: BadgeState = {
      hadStaticPosition: false,
      previousPosition: ''
    }
    el.__mfsBadgeState = state
    syncBadge(el, binding, state)
  },
  updated(el, binding) {
    const state = el.__mfsBadgeState
    if (!state) return
    syncBadge(el, binding, state)
  },
  unmounted(el) {
    const state = el.__mfsBadgeState
    if (!state) return
    if (state.badgeEl) {
      state.badgeEl.remove()
      state.badgeEl = undefined
    }
    if (state.hadStaticPosition) {
      el.style.position = state.previousPosition
    }
    delete el.__mfsBadgeState
  }
}

export const BadgeDirective = vBadge
export default vBadge
