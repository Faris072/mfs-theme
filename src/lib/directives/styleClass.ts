import type { Directive } from 'vue'

export interface StyleClassOptions {
  selector?: string
  toggleClass?: string
  enterClass?: string
  leaveClass?: string
}

type StyleClassBinding = string | StyleClassOptions

interface StyleClassElement extends HTMLElement {
  __mfsStyleClassHandler?: () => void
  __mfsStyleClassOpts?: StyleClassOptions
}

function resolveTarget(el: HTMLElement, selector?: string): HTMLElement | null {
  if (!selector || selector === '@self') return el
  if (selector === '@next') return el.nextElementSibling as HTMLElement | null
  if (selector === '@prev') return el.previousElementSibling as HTMLElement | null
  if (selector === '@parent') return el.parentElement
  if (selector === '@grandparent') return el.parentElement?.parentElement ?? null
  try {
    return document.querySelector<HTMLElement>(selector)
  } catch {
    return null
  }
}

function normalize(value: StyleClassBinding): StyleClassOptions {
  return typeof value === 'string' ? { toggleClass: value } : value
}

export const vStyleClass: Directive<StyleClassElement, StyleClassBinding> = {
  mounted(el, binding) {
    el.__mfsStyleClassOpts = normalize(binding.value)

    const handler = () => {
      const opts = el.__mfsStyleClassOpts
      if (!opts) return
      const target = resolveTarget(el, opts.selector)
      if (!target) return

      if (opts.toggleClass) {
        opts.toggleClass.split(/\s+/).filter(Boolean).forEach((cls) => target.classList.toggle(cls))
      } else {
        if (opts.leaveClass) {
          opts.leaveClass.split(/\s+/).filter(Boolean).forEach((cls) => target.classList.remove(cls))
        }
        if (opts.enterClass) {
          opts.enterClass.split(/\s+/).filter(Boolean).forEach((cls) => target.classList.add(cls))
        }
      }
    }

    el.__mfsStyleClassHandler = handler
    el.addEventListener('click', handler)
  },
  updated(el, binding) {
    el.__mfsStyleClassOpts = normalize(binding.value)
  },
  unmounted(el) {
    if (el.__mfsStyleClassHandler) {
      el.removeEventListener('click', el.__mfsStyleClassHandler)
      delete el.__mfsStyleClassHandler
    }
  }
}

export default vStyleClass
