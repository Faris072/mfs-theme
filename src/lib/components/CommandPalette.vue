<template>
  <Teleport to="body">
    <Transition name="mfs-cmd-fade">
      <div
        v-if="modelValue"
        class="cmd-backdrop mfs-backdrop mfs-flex mfs-justify-center mfs-p-4"
        @click="close"
      >
        <div
          class="cmd-dialog mfs-overlay mfs-surface mfs-rounded-lg mfs-shadow-card mfs-w-full mfs-flex mfs-flex-col mfs-overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          @click.stop
          @keydown="onKeydown"
        >
          <div class="cmd-header mfs-flex mfs-items-center mfs-gap-2 mfs-border-b">
            <svg
              class="cmd-search-icon mfs-text-muted"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="cmd-input mfs-text mfs-bg-transparent mfs-border-none mfs-outline-none mfs-w-full"
              :placeholder="placeholder"
              autocomplete="off"
              spellcheck="false"
              @input="onInput"
            />
            <span v-if="loading" class="mfs-spinner mfs-spinner--sm" role="status" aria-label="Loading" />
            <kbd v-else class="cmd-kbd mfs-surface-subtle mfs-rounded-sm mfs-text-muted">ESC</kbd>
          </div>

          <div ref="listRef" class="cmd-list" role="listbox">
            <div v-if="loading && flatItems.length === 0" class="mfs-empty-state">
              <span class="mfs-spinner mfs-spinner--sm" aria-label="Loading" />
            </div>

            <div v-else-if="flatItems.length === 0" class="mfs-empty-state">
              <slot name="empty">
                <span>{{ emptyText }}</span>
              </slot>
            </div>

            <template v-else>
              <div
                v-for="section in groupedSections"
                :key="section.group"
                class="cmd-group"
                role="group"
              >
                <div v-if="section.group" class="cmd-group-label mfs-text-muted">
                  {{ section.group }}
                </div>
                <button
                  v-for="entry in section.entries"
                  :key="entry.item.id"
                  :ref="(el) => setItemRef(entry.flatIndex, el as HTMLElement | null)"
                  type="button"
                  role="option"
                  :aria-selected="activeIndex === entry.flatIndex"
                  :aria-disabled="entry.item.disabled || undefined"
                  :disabled="entry.item.disabled"
                  class="cmd-item mfs-flex mfs-items-center mfs-justify-between mfs-gap-3 mfs-rounded-sm mfs-w-full mfs-text mfs-transition"
                  :class="{
                    'cmd-item--active': activeIndex === entry.flatIndex,
                    'mfs-disabled': entry.item.disabled,
                    'mfs-cursor-pointer': !entry.item.disabled
                  }"
                  @mouseenter="setActive(entry.flatIndex, entry.item)"
                  @click="selectItem(entry.item)"
                >
                  <div class="cmd-item-main mfs-flex mfs-flex-col">
                    <span class="cmd-item-label">{{ entry.item.label }}</span>
                    <span v-if="entry.item.description" class="cmd-item-desc mfs-text-muted">
                      {{ entry.item.description }}
                    </span>
                  </div>
                  <kbd v-if="entry.item.shortcut" class="cmd-kbd mfs-surface-subtle mfs-rounded-sm mfs-text-muted">
                    {{ entry.item.shortcut }}
                  </kbd>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface CommandItem {
  id: string
  label: string
  group?: string
  description?: string
  shortcut?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    items?: CommandItem[]
    remote?: boolean
    loading?: boolean
    placeholder?: string
    emptyText?: string
    shortcut?: boolean
  }>(),
  {
    modelValue: false,
    items: () => [],
    remote: false,
    loading: false,
    placeholder: 'Type a command or search...',
    emptyText: 'No results found.',
    shortcut: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'search', query: string): void
  (e: 'select', item: CommandItem): void
}>()

defineSlots<{
  empty?: () => unknown
}>()

const query = ref('')
const activeIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const itemRefs = new Map<number, HTMLElement>()

const setItemRef = (index: number, el: HTMLElement | null) => {
  if (el) {
    itemRefs.set(index, el)
  } else {
    itemRefs.delete(index)
  }
}

const filteredItems = computed<CommandItem[]>(() => {
  if (props.remote) {
    return props.items
  }
  const q = query.value.trim().toLowerCase()
  if (!q) {
    return props.items
  }
  return props.items.filter((item) => {
    return (
      item.label.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.group && item.group.toLowerCase().includes(q))
    )
  })
})

const groupedSections = computed(() => {
  const map = new Map<string, { item: CommandItem; flatIndex: number }[]>()
  let idx = 0
  for (const item of filteredItems.value) {
    const group = item.group ?? ''
    if (!map.has(group)) {
      map.set(group, [])
    }
    map.get(group)!.push({ item, flatIndex: idx++ })
  }
  return Array.from(map.entries()).map(([group, entries]) => ({ group, entries }))
})

const flatItems = computed<CommandItem[]>(() =>
  groupedSections.value.flatMap((section) => section.entries.map((entry) => entry.item))
)

const firstEnabledIndex = (list: CommandItem[]): number => {
  return list.findIndex((item) => !item.disabled)
}

watch(
  flatItems,
  (list) => {
    itemRefs.clear()
    activeIndex.value = firstEnabledIndex(list)
  },
  { immediate: true }
)

const close = () => {
  emit('update:modelValue', false)
}

const onInput = () => {
  emit('search', query.value)
}

const setActive = (index: number, item: CommandItem) => {
  if (!item.disabled) {
    activeIndex.value = index
  }
}

const selectItem = (item: CommandItem) => {
  if (item.disabled) return
  emit('select', item)
  close()
}

const moveActive = (step: 1 | -1) => {
  const list = flatItems.value
  const len = list.length
  if (len === 0) return

  let idx = activeIndex.value
  for (let i = 0; i < len; i++) {
    idx = (idx + step + len) % len
    if (!list[idx]?.disabled) {
      activeIndex.value = idx
      nextTick(() => {
        itemRefs.get(idx)?.scrollIntoView({ block: 'nearest' })
      })
      return
    }
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    moveActive(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    moveActive(-1)
  } else if (e.key === 'Enter') {
    const item = flatItems.value[activeIndex.value]
    if (item && !item.disabled) {
      e.preventDefault()
      selectItem(item)
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

const onGlobalKeydown = (e: KeyboardEvent) => {
  if (!props.shortcut) return
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    emit('update:modelValue', !props.modelValue)
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      query.value = ''
      activeIndex.value = firstEnabledIndex(flatItems.value)
      await nextTick()
      inputRef.value?.focus()
    }
  }
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onGlobalKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onGlobalKeydown)
  }
})
</script>

<style scoped>
.cmd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  align-items: flex-start;
  padding-top: min(14vh, 110px);
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}

.cmd-dialog {
  max-width: 580px;
  max-height: 70vh;
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.cmd-header {
  padding: 12px 16px;
  border-bottom-color: var(--border);
}

.cmd-search-icon {
  flex-shrink: 0;
}

.cmd-input {
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 2px 0;
  color: var(--text);
}

.cmd-input::placeholder {
  color: var(--text-muted);
}

.cmd-kbd {
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 6px;
  line-height: 1.3;
  flex-shrink: 0;
  background: var(--surface-subtle);
  color: var(--text-muted);
  border: 1px solid color-mix(in srgb, var(--border, rgba(148, 163, 184, 0.3)) 70%, transparent);
}

.cmd-list {
  overflow-y: auto;
  padding: 8px;
  max-height: calc(70vh - 56px);
}

.cmd-group + .cmd-group {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid color-mix(in srgb, var(--border, rgba(148, 163, 184, 0.35)) 85%, transparent);
}

.cmd-group-label {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  color: var(--text-muted);
}

.cmd-item {
  background: transparent;
  border: 0;
  padding: 8px 10px;
  text-align: left;
  font-family: inherit;
  color: var(--text);
}

.cmd-item + .cmd-item {
  border-top: 1px solid color-mix(in srgb, var(--border, rgba(148, 163, 184, 0.25)) 60%, transparent);
}

.cmd-item--active,
.cmd-item:hover:not(:disabled) {
  background: color-mix(in srgb, var(--primary) 10%, var(--surface-subtle));
  color: var(--text);
  box-shadow: inset 2px 0 0 var(--primary);
}

.cmd-item-main {
  min-width: 0;
  gap: 2px;
}

.cmd-item-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.cmd-item-desc {
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mfs-cmd-fade-enter-active,
.mfs-cmd-fade-leave-active {
  transition: opacity 0.16s ease;
}

.mfs-cmd-fade-enter-from,
.mfs-cmd-fade-leave-to {
  opacity: 0;
}
</style>
