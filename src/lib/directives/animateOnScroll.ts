import type { Directive } from 'vue'

export interface AnimateOnScrollOptions {
  enterClass?: string
  leaveClass?: string
  threshold?: number
  once?: boolean
}

type AnimateOnScrollBinding = string | AnimateOnScrollOptions | undefined

interface AosElement extends HTMLElement {
  __mfsAosObserver?: IntersectionObserver
}

export const vAnimateOnScroll: Directive<AosElement, AnimateOnScrollBinding> = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return

    const opts: AnimateOnScrollOptions =
      typeof binding.value === 'string'
        ? { enterClass: binding.value }
        : binding.value ?? {}

    const enterClass = opts.enterClass ?? 'mfs-aos-enter'
    const leaveClass = opts.leaveClass ?? ''
    const threshold = opts.threshold ?? 0.1
    const once = opts.once ?? true

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (leaveClass) el.classList.remove(leaveClass)
            if (enterClass) el.classList.add(enterClass)
            if (once) observer.unobserve(el)
          } else if (!once) {
            if (enterClass) el.classList.remove(enterClass)
            if (leaveClass) el.classList.add(leaveClass)
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
