<template />

<script setup lang="ts">
export interface ColumnProps {
  field?: string
  header?: string
  sortable?: boolean
  sortField?: string
  filterField?: string
  headerStyle?: string | Record<string, string>
  bodyStyle?: string | Record<string, string>
  headerClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  bodyClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
  style?: string | Record<string, string>
  frozen?: boolean
  alignFrozen?: 'left' | 'right'
  selectionMode?: 'single' | 'multiple'
  expander?: boolean
  hidden?: boolean
}

defineProps<ColumnProps>()

defineSlots<{
  header?: (props: Record<string, unknown>) => unknown
  body?: (props: { data: Record<string, unknown>; field?: string; index: number }) => unknown
  filter?: (props: Record<string, unknown>) => unknown
  editor?: (props: Record<string, unknown>) => unknown
  footer?: (props: Record<string, unknown>) => unknown
}>()
</script>
