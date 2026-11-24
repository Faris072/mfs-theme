<template>
  <nav class="pagination mfs-row mfs-text" aria-label="Pagination" :aria-busy="loading || undefined">
    <div class="pagination__controls">
      <button
        type="button"
        class="pagination__btn mfs-surface mfs-shadow mfs-rounded-md mfs-interactive"
        :disabled="isDisabled || currentPage <= 1"
        aria-label="First page"
        @click="goToPage(1)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>

      <button
        type="button"
        class="pagination__btn mfs-surface mfs-shadow mfs-rounded-md mfs-interactive"
        :disabled="isDisabled || currentPage <= 1"
        aria-label="Previous page"
        @click="goToPage(currentPage - 1)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <template v-for="(entry, idx) in pages" :key="idx">
        <span v-if="entry === 'ellipsis'" class="pagination__ellipsis mfs-text-muted" aria-hidden="true">
          &hellip;
        </span>
        <button
          v-else
          type="button"
          class="pagination__btn pagination__btn--page mfs-surface mfs-shadow mfs-rounded-md mfs-interactive"
          :class="{ 'pagination__btn--active': entry === currentPage }"
          :disabled="isDisabled"
          :aria-label="`Page ${entry}`"
          :aria-current="entry === currentPage ? 'page' : undefined"
          @click="goToPage(entry)"
        >
          {{ entry }}
        </button>
      </template>

      <button
        type="button"
        class="pagination__btn mfs-surface mfs-shadow mfs-rounded-md mfs-interactive"
        :disabled="isDisabled || currentPage >= totalPages"
        aria-label="Next page"
        @click="goToPage(currentPage + 1)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        type="button"
        class="pagination__btn mfs-surface mfs-shadow mfs-rounded-md mfs-interactive"
        :disabled="isDisabled || currentPage >= totalPages"
        aria-label="Last page"
        @click="goToPage(totalPages)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      </button>
    </div>

    <div v-if="perPageOptions.length || showJumpTo" class="pagination__extras">
      <label v-if="perPageOptions.length" class="pagination__per-page">
        <span class="pagination__label mfs-text-muted">Rows</span>
        <select
          class="pagination__select mfs-surface mfs-rounded-md mfs-shadow-inset"
          :value="perPage"
          :disabled="isDisabled"
          aria-label="Items per page"
          @change="handlePerPageChange"
        >
          <option v-for="opt in perPageOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </label>

      <form v-if="showJumpTo" class="pagination__jump" @submit.prevent="handleJumpSubmit">
        <label class="pagination__label mfs-text-muted">
          Go
          <input
            v-model="jumpInput"
            type="number"
            min="1"
            :max="totalPages"
            :disabled="isDisabled"
            class="pagination__input mfs-surface mfs-rounded-md mfs-shadow-inset"
            aria-label="Jump to page"
          />
        </label>
      </form>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    total: number
    perPage?: number
    perPageOptions?: number[]
    showJumpTo?: boolean
    siblingCount?: number
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    perPage: 10,
    perPageOptions: () => [10, 20, 50, 100],
    showJumpTo: false,
    siblingCount: 1,
    loading: false,
    disabled: false
  }
)

const isDisabled = computed(() => props.disabled || props.loading)

const emit = defineEmits<{
  (e: 'update:modelValue', page: number): void
  (e: 'update:perPage', perPage: number): void
  (e: 'change', payload: { page: number; perPage: number }): void
}>()

const jumpInput = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, props.perPage))))
const currentPage = computed(() => Math.min(Math.max(1, props.modelValue), totalPages.value))

const pages = computed<(number | 'ellipsis')[]>(() => {
  const total = totalPages.value
  const current = currentPage.value
  const siblings = props.siblingCount
  const totalNumbers = siblings * 2 + 5

  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  const result: (number | 'ellipsis')[] = [1]

  if (showLeftEllipsis) {
    result.push('ellipsis')
  } else {
    for (let i = 2; i < leftSibling; i++) result.push(i)
  }

  for (let i = Math.max(2, leftSibling); i <= Math.min(total - 1, rightSibling); i++) {
    result.push(i)
  }

  if (showRightEllipsis) {
    result.push('ellipsis')
  } else {
    for (let i = rightSibling + 1; i < total; i++) result.push(i)
  }

  if (total > 1) result.push(total)
  return result
})

const goToPage = (page: number) => {
  if (isDisabled.value) return
  const clamped = Math.min(Math.max(1, page), totalPages.value)
  if (clamped === currentPage.value) return
  emit('update:modelValue', clamped)
  emit('change', { page: clamped, perPage: props.perPage })
}

const handlePerPageChange = (e: Event) => {
  if (isDisabled.value) return
  const nextPerPage = Number((e.target as HTMLSelectElement).value)
  const nextTotalPages = Math.max(1, Math.ceil(props.total / Math.max(1, nextPerPage)))
  const nextPage = Math.min(currentPage.value, nextTotalPages)
  emit('update:perPage', nextPerPage)
  if (nextPage !== currentPage.value) {
    emit('update:modelValue', nextPage)
  }
  emit('change', { page: nextPage, perPage: nextPerPage })
}

const handleJumpSubmit = () => {
  if (isDisabled.value) return
  const parsed = Number.parseInt(jumpInput.value, 10)
  if (!Number.isNaN(parsed)) {
    goToPage(parsed)
  }
  jumpInput.value = ''
}
</script>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text);
}

.pagination__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border, transparent);
  background-color: var(--surface);
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  cursor: pointer;
  transition: all 0.18s ease;
  user-select: none;
}

.pagination__btn:hover:not(:disabled):not(.pagination__btn--active) {
  background-color: var(--surface-subtle);
  transform: translateY(-1px);
}

.pagination__btn:active:not(:disabled) {
  box-shadow: var(--clay-shadow-active);
  transform: scale(0.96);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__btn--active {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
  box-shadow: var(--clay-shadow-active);
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  color: var(--text-muted);
  font-weight: 600;
  user-select: none;
}

.pagination__extras {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination__per-page,
.pagination__jump {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pagination__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.pagination__select,
.pagination__input {
  height: 36px;
  padding: 0 10px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border, transparent);
  background-color: var(--surface);
  color: var(--text);
  font-family: inherit;
  font-size: 0.88rem;
  box-shadow: var(--input-shadow);
  outline: none;
}

.pagination__input {
  width: 64px;
}

[data-theme="neo"] .pagination__btn--active {
  box-shadow: var(--clay-shadow);
}

@media (max-width: 640px) {
  .pagination {
    justify-content: center;
  }

  .pagination__btn {
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
  }
}
</style>
