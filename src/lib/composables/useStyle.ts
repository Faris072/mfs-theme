import { getCurrentInstance, onUnmounted, readonly, ref } from 'vue'

export interface UseStyleOptions {
  name?: string
  id?: string
  immediate?: boolean
}

let nextStyleId = 1

export function useStyle(css: string, options: UseStyleOptions = {}) {
  const id = options.id ?? `mfs-style-${nextStyleId++}`
  const name = options.name
  const isLoaded = ref(false)
  let styleEl: HTMLStyleElement | null = null

  function load(): void {
    if (typeof document === 'undefined') return

    const existing = document.getElementById(id)
    if (existing instanceof HTMLStyleElement) {
      existing.textContent = css
      styleEl = existing
      isLoaded.value = true
      return
    }

    const el = document.createElement('style')
    el.id = id
    el.type = 'text/css'
    if (name) {
      el.setAttribute('data-mfs-style', name)
    }
    el.textContent = css
    document.head.appendChild(el)
    styleEl = el
    isLoaded.value = true
  }

  function unload(): void {
    if (typeof document === 'undefined') return

    const target = styleEl ?? document.getElementById(id)
    if (target && target.parentNode) {
      target.parentNode.removeChild(target)
    }
    styleEl = null
    isLoaded.value = false
  }

  if (options.immediate ?? true) {
    load()
  }

  if (getCurrentInstance()) {
    onUnmounted(unload)
  }

  return {
    id,
    name,
    css,
    isLoaded: readonly(isLoaded),
    load,
    unload
  }
}
