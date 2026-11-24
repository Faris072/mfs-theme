export function getItemKey(item: unknown, index: number, itemKey = 'id'): string | number {
  if (item && typeof item === 'object' && itemKey in item) {
    const key = (item as Record<string, unknown>)[itemKey]
    if (typeof key === 'string' || typeof key === 'number') {
      return key
    }
  }
  return index
}
