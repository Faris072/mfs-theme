import type { Directive } from 'vue'

export interface RippleOptions {
  color?: string
  disabled?: boolean
}

type RippleBinding = boolean | RippleOptions | undefined

interface RippleElement extends HTMLElement {
  __mfsRippleHandler?: (e: PointerEvent) => void
  __mfsRippleDisabled?: boolean
  __mfsRippleColor?: string
}

function parseBinding(value: RippleBinding): { disabled: boolean; color: string } {
  if (value === false) return { disabled: true, color: 'currentColor' }
  if (typeof value === 'object' && value !== null) {
    return {
      disabled: Boolean(value.disabled),
      color: value.color ?? 'currentColor'
    }
  }
  return { disabled: false, color: 'currentColor' }
}

export const vRipple: Directive<RippleElement, RippleBinding> = {
  mounted(el, binding) {
    const opts = parseBinding(binding.value)
    el.__mfsRippleDisabled = opts.disabled
    el.__mfsRippleColor = opts.color

    const computed = getComputedStyle(el)
    if (computed.position === 'static') {
      el.style.position = 'relative'
    }
    if (computed.overflow !== 'hidden') {
      el.style.overflow = 'hidden'
    }

    const handler = (e: PointerEvent) => {
      if (el.__mfsRippleDisabled) return
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const wave = document.createElement('span')
      wave.style.position = 'absolute'
      wave.style.width = `${size}px`
      wave.style.height = `${size}px`
      wave.style.left = `${x}px`
      wave.style.top = `${y}px`
      wave.style.borderRadius = '50%'
      wave.style.pointerEvents = 'none'
      wave.style.backgroundColor = el.__mfsRippleColor ?? 'currentColor'
      wave.style.opacity = '0.25'
      wave.style.transform = 'scale(0)'

      el.appendChild(wave)
      const anim = wave.animate(
        [
          { transform: 'scale(0)', opacity: 0.28 },
          { transform: 'scale(1)', opacity: 0 }
        ],
        { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      )
      anim.onfinish = () => wave.remove()
    }

    el.__mfsRippleHandler = handler
    el.addEventListener('pointerdown', handler)
  },
  updated(el, binding) {
    const opts = parseBinding(binding.value)
    el.__mfsRippleDisabled = opts.disabled
    el.__mfsRippleColor = opts.color
  },
  unmounted(el) {
    if (el.__mfsRippleHandler) {
      el.removeEventListener('pointerdown', el.__mfsRippleHandler)
      delete el.__mfsRippleHandler
    }
  }
}

export default vRipple
