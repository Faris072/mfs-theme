import { readonly, ref } from 'vue'

export interface PageProgressRouteLocation {
  path?: string
  fullPath?: string
  name?: string | symbol | null
  [key: string]: unknown
}

export interface PageProgressRouter {
  beforeEach: (
    guard: (
      to: PageProgressRouteLocation,
      from: PageProgressRouteLocation
    ) => void | boolean | Promise<void | boolean>
  ) => () => void
  afterEach: (
    guard: (to: PageProgressRouteLocation, from: PageProgressRouteLocation) => void
  ) => () => void
  onError?: (handler: (error: unknown) => void) => () => void
}

export interface PageProgressOptions {
  color?: string
  height?: number
  zIndex?: number
  minimum?: number
  speed?: number
  trickleSpeed?: number
}

const BAR_ID = 'mfs-page-progress'

const DEFAULT_OPTIONS: Required<PageProgressOptions> = {
  color: 'var(--primary)',
  height: 3,
  zIndex: 9999,
  minimum: 0.08,
  speed: 200,
  trickleSpeed: 200
}

const isLoading = ref(false)
const progress = ref(0)

let activeOptions: Required<PageProgressOptions> = { ...DEFAULT_OPTIONS }
let trickleTimer: ReturnType<typeof setInterval> | null = null
let doneTimer: ReturnType<typeof setTimeout> | null = null
let resetTimer: ReturnType<typeof setTimeout> | null = null

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function clearTimers(): void {
  if (trickleTimer !== null) {
    clearInterval(trickleTimer)
    trickleTimer = null
  }
  if (doneTimer !== null) {
    clearTimeout(doneTimer)
    doneTimer = null
  }
  if (resetTimer !== null) {
    clearTimeout(resetTimer)
    resetTimer = null
  }
}

function resolveOptions(options?: PageProgressOptions): Required<PageProgressOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ...options
  }
}

function applyBarStyle(el: HTMLElement, opts: Required<PageProgressOptions>): void {
  const { color, height, zIndex, speed } = opts
  el.style.height = `${height}px`
  el.style.zIndex = String(zIndex)
  el.style.background = color
  el.style.boxShadow = `0 0 10px ${color}, 0 0 5px ${color}`
  el.style.transition = prefersReducedMotion()
    ? 'none'
    : `transform ${speed}ms ease, opacity ${speed}ms ease`
}

function ensureBar(opts: Required<PageProgressOptions>): HTMLElement | null {
  if (typeof document === 'undefined') return null

  const existing = document.getElementById(BAR_ID)
  if (existing) {
    applyBarStyle(existing, opts)
    return existing
  }

  const { color, height, zIndex } = opts
  const el = document.createElement('div')
  el.id = BAR_ID
  el.setAttribute('aria-hidden', 'true')
  el.style.cssText =
    `position: fixed; top: 0; left: 0; width: 100%; height: ${height}px; ` +
    `z-index: ${zIndex}; pointer-events: none; background: ${color}; ` +
    `box-shadow: 0 0 10px ${color}, 0 0 5px ${color}; ` +
    `transform-origin: left center; transform: scaleX(0); opacity: 0;`

  applyBarStyle(el, opts)
  document.body.appendChild(el)
  return el
}

function renderProgress(value: number, visible: boolean): void {
  const el = ensureBar(activeOptions)
  if (!el) return
  el.style.opacity = visible ? '1' : '0'
  el.style.transform = `scaleX(${value})`
}

function start(options?: PageProgressOptions): void {
  clearTimers()
  activeOptions = resolveOptions(options)
  isLoading.value = true

  if (progress.value <= 0 || progress.value >= 1) {
    progress.value = activeOptions.minimum
  }

  renderProgress(progress.value, true)

  trickleTimer = setInterval(() => {
    const next = Math.min(0.994, progress.value + (1 - progress.value) * 0.15)
    progress.value = next
    renderProgress(next, true)
  }, activeOptions.trickleSpeed)
}

function set(value: number, options?: PageProgressOptions): void {
  const clamped = Math.max(0, Math.min(1, value))
  if (clamped >= 1) {
    if (options) {
      activeOptions = resolveOptions(options)
    }
    done()
    return
  }

  if (doneTimer !== null) {
    clearTimeout(doneTimer)
    doneTimer = null
  }
  if (resetTimer !== null) {
    clearTimeout(resetTimer)
    resetTimer = null
  }
  if (options) {
    activeOptions = resolveOptions(options)
  }

  isLoading.value = true
  progress.value = clamped
  renderProgress(clamped, true)
}

function done(): void {
  clearTimers()
  if (!isLoading.value && progress.value === 0) return

  progress.value = 1
  renderProgress(1, true)

  const delay = prefersReducedMotion() ? 0 : activeOptions.speed

  doneTimer = setTimeout(() => {
    doneTimer = null
    renderProgress(1, false)
    isLoading.value = false

    resetTimer = setTimeout(() => {
      resetTimer = null
      progress.value = 0
      const el = typeof document !== 'undefined' ? document.getElementById(BAR_ID) : null
      if (el) {
        el.style.transform = 'scaleX(0)'
      }
    }, delay)
  }, delay)
}

export function attachRouterProgress(
  router: PageProgressRouter,
  options?: PageProgressOptions
): () => void {
  const removeBefore = router.beforeEach(() => {
    start(options)
  })
  const removeAfter = router.afterEach(() => {
    done()
  })
  const removeError = router.onError
    ? router.onError(() => {
        done()
      })
    : undefined

  return () => {
    removeBefore()
    removeAfter()
    removeError?.()
  }
}

export function usePageProgress() {
  return {
    isLoading: readonly(isLoading),
    progress: readonly(progress),
    start,
    done,
    set,
    attachRouterProgress
  }
}
