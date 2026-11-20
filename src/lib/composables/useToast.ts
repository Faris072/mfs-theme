import { ref, readonly } from 'vue'

export type ToastSeverity = 'info' | 'success' | 'warning' | 'danger'
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

export interface ToastOptions {
  id?: string
  title?: string
  message: string
  severity?: ToastSeverity
  duration?: number
  closable?: boolean
}

export interface ToastItem {
  id: string
  title?: string
  message: string
  severity: ToastSeverity
  duration: number
  closable: boolean
}

interface TimerMeta {
  timerId: ReturnType<typeof setTimeout> | null
  remaining: number
  startedAt: number
}

const toasts = ref<ToastItem[]>([])
const timers = new Map<string, TimerMeta>()
let counter = 0

function clearTimer(id: string) {
  const meta = timers.get(id)
  if (meta?.timerId) {
    clearTimeout(meta.timerId)
    meta.timerId = null
  }
}

function startTimer(id: string, duration: number) {
  if (duration <= 0) return
  clearTimer(id)
  const timerId = setTimeout(() => {
    removeToast(id)
  }, duration)
  timers.set(id, {
    timerId,
    remaining: duration,
    startedAt: Date.now()
  })
}

function removeToast(id: string) {
  clearTimer(id)
  timers.delete(id)
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function pauseToast(id: string) {
  const meta = timers.get(id)
  if (!meta || !meta.timerId) return
  clearTimeout(meta.timerId)
  meta.timerId = null
  meta.remaining = Math.max(0, meta.remaining - (Date.now() - meta.startedAt))
}

function resumeToast(id: string) {
  const meta = timers.get(id)
  if (!meta || meta.timerId || meta.remaining <= 0) return
  meta.startedAt = Date.now()
  meta.timerId = setTimeout(() => {
    removeToast(id)
  }, meta.remaining)
}

function addToast(options: ToastOptions): string {
  const id = options.id ?? `mfs-toast-${++counter}`
  const duration = options.duration ?? 4000
  const item: ToastItem = {
    id,
    title: options.title,
    message: options.message,
    severity: options.severity ?? 'info',
    duration,
    closable: options.closable ?? true
  }

  // Replace if same id already exists
  const existingIdx = toasts.value.findIndex((t) => t.id === id)
  if (existingIdx !== -1) {
    toasts.value.splice(existingIdx, 1, item)
  } else {
    toasts.value.push(item)
  }

  if (duration > 0) {
    startTimer(id, duration)
  }

  return id
}

function clearToasts() {
  for (const id of timers.keys()) {
    clearTimer(id)
  }
  timers.clear()
  toasts.value = []
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    add: addToast,
    show: addToast,
    remove: removeToast,
    clear: clearToasts,
    pause: pauseToast,
    resume: resumeToast
  }
}
