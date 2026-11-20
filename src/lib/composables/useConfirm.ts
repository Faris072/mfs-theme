import { ref, readonly } from 'vue'

export type ConfirmVariant = 'primary' | 'success' | 'warning' | 'danger'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  onAccept?: () => void | Promise<void>
  onReject?: () => void | Promise<void>
}

interface ConfirmState {
  isOpen: boolean
  options: ConfirmOptions | null
}

const state = ref<ConfirmState>({
  isOpen: false,
  options: null
})

let activeResolve: ((value: boolean) => void) | null = null

function settle(accepted: boolean) {
  const currentOptions = state.value.options
  const resolve = activeResolve
  activeResolve = null
  state.value = { isOpen: false, options: null }

  if (accepted) {
    void currentOptions?.onAccept?.()
  } else {
    void currentOptions?.onReject?.()
  }

  resolve?.(accepted)
}

function confirm(options: ConfirmOptions): Promise<boolean> {
  if (activeResolve) {
    activeResolve(false)
    activeResolve = null
  }

  state.value = {
    isOpen: true,
    options: {
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      variant: 'primary',
      ...options
    }
  }

  return new Promise<boolean>((resolve) => {
    activeResolve = resolve
  })
}

export function useConfirm() {
  return {
    state: readonly(state),
    confirm,
    accept: () => settle(true),
    reject: () => settle(false)
  }
}
