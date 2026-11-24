import type { Directive } from 'vue'

export type AnimateOnScrollPreset =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'

export interface AnimateOnScrollOptions {
  animation?: AnimateOnScrollPreset
  duration?: number
  delay?: number
  distance?: number
  threshold?: number
  once?: boolean
  enterClass?: string
  leaveClass?: string
}

type AnimateOnScrollBinding =
  | AnimateOnScrollPreset
  | (string & {})
  | AnimateOnScrollOptions
  | undefined

interface AosElement extends HTMLElement {
  __mfsAosObserver?: IntersectionObserver
}

const PRESETS = new Set<AnimateOnScrollPreset>([
  'fade-up',
  'fade-down',
  'fade-left',
  'fade-right',
  'zoom-in'
])

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

function isPreset(value: unknown): value is AnimateOnScrollPreset {
  return typeof value === 'string' && PRESETS.has(value as AnimateOnScrollPreset)
}

function getInitialTransform(preset: AnimateOnScrollPreset, distance: number): string {
  switch (preset) {
    case 'fade-down':
      return `translate3d(0, -${distance}px, 0)`
    case 'fade-left':
      return `translate3d(${distance}px, 0, 0)`
    case 'fade-right':
      return `translate3d(-${distance}px, 0, 0)`
    case 'zoom-in':
      return 'scale(0.92)'
    case 'fade-up':
    default:
      return `translate3d(0, ${distance}px, 0)`
  }
}

function getEnterTransform(preset: AnimateOnScrollPreset): string {
  return preset === 'zoom-in' ? 'scale(1)' : 'translate3d(0, 0, 0)'
}

export const vAnimateOnScroll: Directive<AosElement, AnimateOnScrollBinding> = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return

    const opts: AnimateOnScrollOptions =
      typeof binding.value === 'string'
        ? isPreset(binding.value)
          ? { animation: binding.value }
          : { enterClass: binding.value }
        : binding.value ?? {}

    const usePreset = opts.enterClass === undefined
    const animation: AnimateOnScrollPreset = opts.animation ?? 'fade-up'
    const duration = opts.duration ?? 500
    const delay = opts.delay ?? 0
    const distance = opts.distance ?? 24
    const threshold = opts.threshold ?? 0.1
    const once = opts.once ?? true
    const enterClass = opts.enterClass ?? ''
    const leaveClass = opts.leaveClass ?? ''

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (usePreset && !prefersReducedMotion) {
      el.style.opacity = '0'
      el.style.transform = getInitialTransform(animation, distance)
      el.style.transition = `opacity ${duration}ms ${EASING} ${delay}ms, transform ${duration}ms ${EASING} ${delay}ms`
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (leaveClass) el.classList.remove(leaveClass)
            if (enterClass) el.classList.add(enterClass)
            if (usePreset) {
              el.style.opacity = '1'
              el.style.transform = getEnterTransform(animation)
            }
            if (once) observer.unobserve(el)
          } else if (!once) {
            if (enterClass) el.classList.remove(enterClass)
            if (leaveClass) el.classList.add(leaveClass)
            if (usePreset && !prefersReducedMotion) {
              el.style.opacity = '0'
              el.style.transform = getInitialTransform(animation, distance)
            }
          }
        }
      },
      { threshold }
    )

    el.__mfsAosObserver = observer
    observer.observe(el)
  },
  unmounted(el) {
    if (el.__mfsAosObserver) {
      el.__mfsAosObserver.disconnect()
      delete el.__mfsAosObserver
    }
  }
}

export default vAnimateOnScroll
