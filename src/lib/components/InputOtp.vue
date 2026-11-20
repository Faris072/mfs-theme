<template>
  <div class="otp-wrapper" :class="{ 'otp-wrapper--disabled mfs-disabled': disabled }" role="group" aria-label="One-time password">
    <input
      v-for="idx in length"
      :key="idx"
      :ref="(el) => setRef(el, idx - 1)"
      :type="mask ? 'password' : 'text'"
      :inputmode="integerOnly ? 'numeric' : 'text'"
      maxlength="1"
      :value="chars[idx - 1]"
      :disabled="disabled"
      :aria-label="`Digit ${idx} of ${length}`"
      class="otp-cell mfs-surface mfs-rounded mfs-shadow-inset mfs-text mfs-font-mono"
      @input="onInput(idx - 1, $event)"
      @keydown="onKeydown(idx - 1, $event)"
      @paste="onPaste(idx - 1, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    length?: number
    mask?: boolean
    integerOnly?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    length: 4,
    mask: false,
    integerOnly: true,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
}>()

const inputs = ref<(HTMLInputElement | null)[]>([])
const setRef = (el: unknown, idx: number) => {
  inputs.value[idx] = el as HTMLInputElement | null
}

const chars = computed(() =>
  Array.from({ length: props.length }, (_, i) => props.modelValue[i] ?? '')
)

const updateAt = (nextArr: string[]) => {
  const joined = nextArr.join('').slice(0, props.length)
  emit('update:modelValue', joined)
  if (joined.length === props.length && !nextArr.includes('')) {
    emit('complete', joined)
  }
}

const onInput = (idx: number, e: Event) => {
  const raw = (e.target as HTMLInputElement).value
  const ch = raw.slice(-1)
  if (props.integerOnly && ch && !/^\d$/.test(ch)) {
    ;(e.target as HTMLInputElement).value = chars.value[idx]
    return
  }
  const next = [...chars.value]
  next[idx] = ch
  updateAt(next)
  if (ch && idx < props.length - 1) inputs.value[idx + 1]?.focus()
}

const onKeydown = (idx: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !chars.value[idx] && idx > 0) {
    inputs.value[idx - 1]?.focus()
  } else if (e.key === 'ArrowLeft' && idx > 0) {
    e.preventDefault()
    inputs.value[idx - 1]?.focus()
  } else if (e.key === 'ArrowRight' && idx < props.length - 1) {
    e.preventDefault()
    inputs.value[idx + 1]?.focus()
  }
}

const onPaste = (idx: number, e: ClipboardEvent) => {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') ?? ''
  const filtered = props.integerOnly ? pasted.replace(/\D/g, '') : pasted
  if (!filtered) return
  const next = [...chars.value]
  for (let i = 0; i < filtered.length && idx + i < props.length; i++) {
    next[idx + i] = filtered[i]
  }
  updateAt(next)
  const focusIdx = Math.min(props.length - 1, idx + filtered.length)
  inputs.value[focusIdx]?.focus()
}
</script>

<style scoped>
.otp-wrapper { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.otp-wrapper--disabled { opacity: 0.55; pointer-events: none; }
.otp-cell { width: 46px; height: 50px; text-align: center; font-family: inherit; font-size: 1.2rem; font-weight: 700; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.otp-cell:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow); }

[data-theme="glass"] .otp-cell { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .otp-cell { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
</style>
