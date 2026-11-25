<template>
  <div class="mask-wrapper" :class="{ 'mask-wrapper--disabled mfs-disabled': disabled }">
    <label v-if="label" :for="inputId" class="mask-label mfs-text">{{ label }}</label>
    <div class="mask-box mfs-surface mfs-rounded mfs-shadow-inset">
      <input
        :id="inputId"
        type="text"
        :value="modelValue"
        :placeholder="placeholder || mask"
        :disabled="disabled"
        class="mask-input mfs-text mfs-font-mono"
        @input="onInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    mask: string
    label?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = `mfs-mask-${useId()}`

const matchesToken = (token: string, ch: string) => {
  if (token === '9') return /^\d$/.test(ch)
  if (token === 'a') return /^[a-zA-Z]$/.test(ch)
  if (token === '*') return /^[a-zA-Z0-9]$/.test(ch)
  return false
}

const formatWithMask = (raw: string) => {
  const chars = raw.split('')
  let out = ''
  let ci = 0
  for (let mi = 0; mi < props.mask.length && ci < chars.length; mi++) {
    const token = props.mask[mi]
    if (token === '9' || token === 'a' || token === '*') {
      while (ci < chars.length && !matchesToken(token, chars[ci])) ci++
      if (ci < chars.length) {
        out += chars[ci]
        ci++
      }
    } else {
      out += token
      if (chars[ci] === token) ci++
    }
  }
  return out
}

const onInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const formatted = formatWithMask(input.value)
  input.value = formatted
  emit('update:modelValue', formatted)
}
</script>

<style scoped>
.mask-wrapper { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.mask-wrapper--disabled { opacity: 0.6; pointer-events: none; }
.mask-label { font-size: 0.875rem; font-weight: 600; }
.mask-box { display: flex; align-items: center; padding: 2px 14px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.mask-box:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow); }
.mask-input { flex: 1; width: 100%; background: transparent; border: none; outline: none; font-family: inherit; font-size: 0.95rem; padding: 10px 0; font-variant-numeric: tabular-nums; }
.mask-input::placeholder { color: var(--text-muted); opacity: 0.7; }

[data-theme="glass"] .mask-box { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .mask-box { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
</style>
