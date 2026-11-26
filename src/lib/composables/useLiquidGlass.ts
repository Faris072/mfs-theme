import { isRef, onBeforeUnmount, watch, type Directive, type Ref } from 'vue'
import { useTheme } from './useTheme'

export interface LiquidGlassOptions {
  enabled?: boolean | Ref<boolean>
  bezelWidth?: number
  scale?: number
  chromaticAberration?: number
}

const SVG_NS = 'http://www.w3.org/2000/svg'
const LRU_CAP = 64
const lruCache = new Map<string, string>()
let uidCounter = 0

function createSvgEl(tag: string, attrs: Record<string, string>): SVGElement {
  const el = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v)
  }
  return el
}

function getSvgDefsRoot(): SVGSVGElement {
  const existing = document.getElementById('mfs-lg-defs') as SVGSVGElement | null
  if (existing) return existing

  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.id = 'mfs-lg-defs'
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('style', 'position:fixed;width:0;height:0;pointer-events:none;overflow:hidden')
  document.body.appendChild(svg)
  return svg
}

function getDisplacementDataUri(
  width: number,
  height: number,
  radius: number,
  bezelWidth?: number
): string {
  const bw = Math.max(2, Math.round(width / 4) * 4)
  const bh = Math.max(2, Math.round(height / 4) * 4)
  const br = Math.min(Math.max(0, Math.round(radius / 2) * 2), bw / 2, bh / 2)
  const b = Math.min(Math.max(bezelWidth ?? 12, 10), 16, Math.min(bw, bh) / 2)
  const key = `${bw}x${bh}x${br}x${b}`

  const cached = lruCache.get(key)
  if (cached) {
    lruCache.delete(key)
    lruCache.set(key, cached)
    return cached
  }

  const canvas = document.createElement('canvas')
  canvas.width = bw
  canvas.height = bh
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const img = ctx.createImageData(bw, bh)
  const data = img.data
  const hw = bw / 2
  const hh = bh / 2

  const sdf = (x: number, y: number): number => {
    const qx = Math.abs(x - hw) - (hw - br)
    const qy = Math.abs(y - hh) - (hh - br)
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - br
  }

  const eps = 0.5
  for (let y = 0; y < bh; y++) {
    const py = y + 0.5
    for (let x = 0; x < bw; x++) {
      const px = x + 0.5
      const idx = (y * bw + x) * 4
      const d = sdf(px, py)

      if (d > 0 || -d >= b) {
        data[idx] = 128
        data[idx + 1] = 128
        data[idx + 2] = 128
        data[idx + 3] = 255
        continue
      }

      const t = 1 - -d / b
      const mag = Math.sin((t * Math.PI) / 2)
      const dx = sdf(px + eps, py) - sdf(px - eps, py)
      const dy = sdf(px, py + eps) - sdf(px, py - eps)
      const len = Math.hypot(dx, dy) || 1
      const nx = dx / len
      const ny = dy / len

      data[idx] = Math.max(0, Math.min(255, Math.round(128 + nx * mag * 127)))
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + ny * mag * 127)))
      data[idx + 2] = 128
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  const uri = canvas.toDataURL('image/png')

  if (lruCache.size >= LRU_CAP) {
    const oldest = lruCache.keys().next().value
    if (oldest !== undefined) lruCache.delete(oldest)
  }
  lruCache.set(key, uri)
  return uri
}

function upsertFilter(
  filterId: string,
  dataUri: string,
  scale: number,
  ca: number
): SVGFilterElement {
  const svg = getSvgDefsRoot()
  let filter = document.getElementById(filterId) as SVGFilterElement | null
  if (!filter) {
    filter = createSvgEl('filter', {
      id: filterId,
      x: '0%',
      y: '0%',
      width: '100%',
      height: '100%',
      'color-interpolation-filters': 'sRGB'
    }) as SVGFilterElement
    svg.appendChild(filter)
  } else {
    filter.replaceChildren()
  }

  filter.appendChild(
    createSvgEl('feImage', {
      href: dataUri,
      preserveAspectRatio: 'none',
      result: 'disp'
    })
  )

  const channels: Array<{ name: string; matrix: string; s: number }> = [
    { name: 'r', matrix: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', s: scale + ca },
    { name: 'g', matrix: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', s: scale },
    { name: 'b', matrix: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', s: scale - ca }
  ]

  for (const ch of channels) {
    filter.appendChild(
      createSvgEl('feColorMatrix', {
        type: 'matrix',
        in: 'SourceGraphic',
        values: ch.matrix,
        result: ch.name
      })
    )
    filter.appendChild(
      createSvgEl('feDisplacementMap', {
        in: ch.name,
        in2: 'disp',
        xChannelSelector: 'R',
        yChannelSelector: 'G',
        scale: String(ch.s),
        result: `d${ch.name}`
      })
    )
  }

  filter.appendChild(createSvgEl('feBlend', { mode: 'screen', in: 'dr', in2: 'dg', result: 'rg' }))
  filter.appendChild(createSvgEl('feBlend', { mode: 'screen', in: 'rg', in2: 'db' }))

  return filter
}

interface Controller {
  update: (nextOpts?: LiquidGlassOptions) => void
  destroy: () => void
}

function createLiquidGlassController(el: HTMLElement, initialOpts: LiquidGlassOptions = {}): Controller {
  const { currentTheme } = useTheme()
  const filterId = `liquid-glass-${++uidCounter}`
  let opts = initialOpts
  let rafId = 0
  let ro: ResizeObserver | null = null
  let stopWatchers: Array<() => void> = []

  const isEnabled = (): boolean => {
    const enabledVal = isRef(opts.enabled) ? opts.enabled.value : opts.enabled
    if (enabledVal === false || currentTheme.value !== 'liquid-glass' || el.closest('.docs-sidebar')) {
      return false
    }
    const scoped = el.closest('[data-theme]')
    return !scoped || scoped.getAttribute('data-theme') === 'liquid-glass'
  }

  const cleanupFilter = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    if (ro) {
      ro.disconnect()
      ro = null
    }
    document.getElementById(filterId)?.remove()
    el.style.removeProperty('--lg-filter')
    el.classList.remove('mfs-lg-active')
  }

  const sync = () => {
    if (!isEnabled()) {
      cleanupFilter()
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.width < 2 || rect.height < 2) {
      cleanupFilter()
      return
    }

    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
    const dataUri = getDisplacementDataUri(rect.width, rect.height, radius, opts.bezelWidth)
    if (!dataUri) return

    upsertFilter(filterId, dataUri, opts.scale ?? 18, opts.chromaticAberration ?? 3)
    el.style.setProperty('--lg-filter', `url(#${filterId})`)
    el.classList.add('mfs-lg-active')
  }

  const scheduleSync = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      rafId = 0
      sync()
    })
  }

  const startObserver = () => {
    if (ro || typeof ResizeObserver === 'undefined') return
    ro = new ResizeObserver(scheduleSync)
    ro.observe(el)
  }

  const setupWatchers = () => {
    for (const stop of stopWatchers) stop()
    stopWatchers = []

    const onStateChange = () => {
      if (isEnabled()) {
        startObserver()
        scheduleSync()
      } else {
        cleanupFilter()
      }
    }

    stopWatchers.push(watch(currentTheme, onStateChange, { immediate: true }))
    if (isRef(opts.enabled)) {
      stopWatchers.push(watch(opts.enabled, onStateChange))
    }
  }

  setupWatchers()

  return {
    update(nextOpts: LiquidGlassOptions = {}) {
      opts = nextOpts
      setupWatchers()
    },
    destroy() {
      for (const stop of stopWatchers) stop()
      stopWatchers = []
      cleanupFilter()
    }
  }
}

export function useLiquidGlass(
  targetRef: Ref<HTMLElement | null | undefined>,
  options: LiquidGlassOptions = {}
) {
  if (typeof window === 'undefined') return

  let controller: Controller | null = null

  const stopTargetWatch = watch(
    targetRef,
    (el) => {
      controller?.destroy()
      controller = el ? createLiquidGlassController(el, options) : null
    },
    { immediate: true, flush: 'post' }
  )

  onBeforeUnmount(() => {
    stopTargetWatch()
    controller?.destroy()
    controller = null
  })
}

const directiveControllers = new WeakMap<HTMLElement, Controller>()

function normalizeDirectiveValue(
  value: boolean | LiquidGlassOptions | undefined
): LiquidGlassOptions {
  if (typeof value === 'boolean') return { enabled: value }
  return value ?? {}
}

export const vLiquidGlass: Directive<HTMLElement, boolean | LiquidGlassOptions | undefined> = {
  mounted(el, binding) {
    if (typeof window === 'undefined') return
    const controller = createLiquidGlassController(el, normalizeDirectiveValue(binding.value))
    directiveControllers.set(el, controller)
  },
  updated(el, binding) {
    directiveControllers.get(el)?.update(normalizeDirectiveValue(binding.value))
  },
  beforeUnmount(el) {
    directiveControllers.get(el)?.destroy()
    directiveControllers.delete(el)
  }
}
