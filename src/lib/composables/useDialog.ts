import { markRaw, readonly, ref, type Component } from 'vue'

export interface DialogOptions {
  props?: Record<string, unknown>
  header?: string
  width?: string
  onClose?: (data?: unknown) => void
}

export interface DialogInstance {
  id: string
  component: Component
  options: DialogOptions
}

export interface DialogRef {
  close: (data?: unknown) => void
}

const dialogs = ref<DialogInstance[]>([])
let nextId = 1

function open(component: Component, options: DialogOptions = {}): string {
  const id = `mfs-dialog-${nextId++}`
  dialogs.value = [
    ...dialogs.value,
    {
      id,
      component: markRaw(component),
      options
    }
  ]
  return id
}

function close(id: string, data?: unknown): void {
  const index = dialogs.value.findIndex((item) => item.id === id)
  if (index === -1) return

  const target = dialogs.value[index]
  dialogs.value = dialogs.value.filter((item) => item.id !== id)
  target.options.onClose?.(data)
}

export function useDialog() {
  return {
    dialogs: readonly(dialogs),
    open,
    close
  }
}
