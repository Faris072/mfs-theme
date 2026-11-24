import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type CSSProperties,
  type Ref
} from 'vue'

export interface UseFloatingOverlayOptions {
  offset?: number
  matchWidth?: boolean
  align?: 'left' | 'right' | 'center'
}

export function useFloatingOverlay(
  triggerRef: Ref<HTMLElement | null>,
  overlayRef: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  options?: UseFloatingOverlayOptions
): {
  overlayStyle: ComputedRef<CSSProperties>
  updatePosition: () => void
  containsTarget: (target: EventTarget | null) => boolean
} {
  const offset = options?.offset ?? 6
  const matchWidth = options?.matchWidth ?? false
  const align = options?.align ?? 'left'

  const top = ref(0)
  const left = ref(0)
  const minWidth = ref<number | undefined>(undefined)

  const updatePosition = () => {
    if (typeof window === 'undefined' || !triggerRef.value) return

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const overlayRect = overlayRef.value?.getBoundingClientRect()
    const overlayWidth = Math.max(
      overlayRect?.width ?? 0,
      matchWidth ? triggerRect.width : 0
    ) || triggerRect.width
    const overlayHeight = overlayRect?.height ?? 0

    let nextLeft = triggerRect.left
    if (align === 'right') {
      nextLeft = triggerRect.right - overlayWidth
    } else if (align === 'center') {
      nextLeft = triggerRect.left + (triggerRect.width - overlayWidth) / 2
    }

    const viewportPadding = 8
    const maxLeft = Math.max(viewportPadding, window.innerWidth - overlayWidth - viewportPadding)
    nextLeft = Math.min(Math.max(viewportPadding, nextLeft), maxLeft)

    const spaceBelow = window.innerHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top
    let nextTop = triggerRect.bottom + offset

    if (
      overlayHeight > 0 &&
      triggerRect.bottom + offset + overlayHeight > window.innerHeight - viewportPadding &&
      spaceAbove > spaceBelow
    ) {
      nextTop = Math.max(viewportPadding, triggerRect.top - overlayHeight - offset)
    }

    top.value = nextTop
    left.value = nextLeft
    minWidth.value = matchWidth ? triggerRect.width : undefined
  }

  const overlayStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {
      position: 'fixed',
      top: `${top.value}px`,
      left: `${left.value}px`,
      zIndex: 10100
    }
    if (matchWidth && minWidth.value !== undefined) {
      style.minWidth = `${minWidth.value}px`
    }
    return style
  })

  const containsTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof Node)) return false
    return Boolean(triggerRef.value?.contains(target) || overlayRef.value?.contains(target))
  }

  const handleViewportChange = () => {
    if (isOpen.value) {
      updatePosition()
    }
  }

  watch(isOpen, (open) => {
    if (open) {
      updatePosition()
      nextTick(updatePosition)
    }
  })

  watch(overlayRef, (el) => {
    if (el && isOpen.value) {
      updatePosition()
    }
  })

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', handleViewportChange, true)
    window.addEventListener('resize', handleViewportChange)
    if (isOpen.value) {
      updatePosition()
    }
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleViewportChange, true)
    window.removeEventListener('resize', handleViewportChange)
  })

  return {
    overlayStyle,
    updatePosition,
    containsTarget
  }
}
