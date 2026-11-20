import type { Directive } from 'vue'

interface FocusTrapElement extends HTMLElement {
  __mfsFocusTrapHandler?: (e: KeyboardEvent) => void
  __mfsPrevFocus?: HTMLElement | null
  __mfsTrapActive?: boolean
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  )
}

function activate(el: FocusTrapElement) {
  if (el.__mfsTrapActive) return
  el.__mfsTrapActive = true
  el.__mfsPrevFocus = document.activeElement as HTMLElement | null

  const focusables = getFocusable(el)
  if (focusables.length > 0) {
    focusables[0].focus()
  }

  const handler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const items = getFocusable(el)
    if (items.length === 0) {
      e.preventDefault()
      return
    }
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  el.__mfsFocusTrapHandler = handler
  el.addEventListener('keydown', handler)
}

function deactivate(el: FocusTrapElement) {
  if (!el.__mfsTrapActive) return
  el.__mfsTrapActive = false
  if (el.__mfsFocusTrapHandler) {
    el.removeEventListener('keydown', el.__mfsFocusTrapHandler)
    delete el.__mfsFocusTrapHandler
  }
  if (el.__mfsPrevFocus && typeof el.__mfsPrevFocus.focus === 'function') {
    el.__mfsPrevFocus.focus()
  }
  el.__mfsPrevFocus = null
}

export const vFocusTrap: Directive<FocusTrapElement, boolean | undefined> = {
  mounted(el, binding) {
    if (binding.value !== false) {
      activate(el)
    }
  },
  updated(el, binding) {
    if (binding.value === false) {
      deactivate(el)
    } else {
      activate(el)
    }
  },
  unmounted(el) {
    deactivate(el)
  }
}

export default vFocusTrap
