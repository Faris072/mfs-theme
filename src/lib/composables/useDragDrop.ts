import { ref } from 'vue'

export interface DragPayload {
  sourceId: string
  group: string
  index: number
  item: unknown
  onRemove?: (index: number) => void
}

export interface SortableListHandler {
  listId: string
  getGroup: () => string
  getOrientation: () => 'vertical' | 'horizontal'
  isDisabled: () => boolean
  setDropIndicator: (
    index: number | null,
    position: 'before' | 'after' | null,
    containerOver: boolean
  ) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onReceive: (item: unknown, fromIndex: number, toIndex: number, fromGroup: string) => void
  onRemove: (index: number) => void
}

const sortableRegistry = new Map<string, SortableListHandler>()

export function registerSortableList(handler: SortableListHandler) {
  sortableRegistry.set(handler.listId, handler)
}

export function unregisterSortableList(listId: string) {
  sortableRegistry.delete(listId)
}

export function getSortableList(listId: string): SortableListHandler | undefined {
  return sortableRegistry.get(listId)
}

export function getPointDropPosition(
  clientX: number,
  clientY: number,
  el: HTMLElement,
  orientation: 'vertical' | 'horizontal' = 'vertical'
): 'before' | 'after' {
  const rect = el.getBoundingClientRect()
  if (orientation === 'horizontal') {
    return clientX < rect.left + rect.width / 2 ? 'before' : 'after'
  }
  return clientY < rect.top + rect.height / 2 ? 'before' : 'after'
}

export const dragState = ref<DragPayload | null>(null)

export function startDrag(e: DragEvent, payload: DragPayload) {
  dragState.value = payload
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(payload.index))
  }
}

export function endDrag() {
  dragState.value = null
}

export function getDropPosition(
  e: DragEvent,
  el: HTMLElement,
  orientation: 'vertical' | 'horizontal' = 'vertical'
): 'before' | 'after' {
  const rect = el.getBoundingClientRect()
  if (orientation === 'horizontal') {
    return e.clientX < rect.left + rect.width / 2 ? 'before' : 'after'
  }
  return e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
}

export function reorderArray<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    fromIndex >= list.length ||
    toIndex < 0 ||
    toIndex >= list.length
  ) {
    return [...list]
  }
  const next = [...list]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function useDragDrop() {
  return {
    dragState,
    startDrag,
    endDrag,
    getDropPosition,
    reorderArray
  }
}
