<template>
  <div class="cp-wrapper mfs-inline-flex mfs-flex-col mfs-gap-1-5" :class="{ 'cp-wrapper--disabled mfs-disabled': disabled }">
    <span v-if="label" class="cp-label mfs-text mfs-text-sm mfs-font-semibold">{{ label }}</span>

    <div class="cp-container mfs-relative">
      <button
        ref="triggerRef"
        type="button"
        class="cp-trigger mfs-surface mfs-rounded mfs-shadow mfs-interactive mfs-inline-flex mfs-items-center mfs-gap-2-5 mfs-font-semibold"
        :disabled="disabled"
        :aria-expanded="isOpen"
        aria-label="Pick a color"
        @click="isOpen = !isOpen"
      >
        <span class="cp-swatch mfs-rounded-full" :style="{ backgroundColor: modelValue }" />
        <span class="cp-hex mfs-font-mono">{{ modelValue.toUpperCase() }}</span>
      </button>

      <Teleport to="body">
        <Transition name="cp-pop">
          <div v-if="isOpen" ref="overlayRef" :style="overlayStyle" class="cp-popover mfs-surface mfs-overlay mfs-rounded mfs-blur mfs-shadow mfs-p-3 mfs-flex mfs-flex-col mfs-gap-2-5" role="dialog" aria-label="Color picker">
          <div class="cp-native-row mfs-flex mfs-items-center mfs-gap-2">
            <input
              type="color"
              class="cp-native mfs-p-0 mfs-border-none mfs-rounded-sm mfs-bg-transparent mfs-cursor-pointer"
              :value="normalizedHex"
              aria-label="Color palette"
              @input="onHexInput(($event.target as HTMLInputElement).value)"
            />
            <input
              type="text"
              class="cp-input mfs-inset mfs-font-mono mfs-flex-1 mfs-min-w-0 mfs-rounded-sm mfs-text-sm"
              :value="modelValue"
              maxlength="7"
              aria-label="Hex color"
              @change="onHexInput(($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="cp-rgb mfs-grid mfs-grid-cols-3 mfs-gap-1-5">
            <label class="cp-rgb-item mfs-flex mfs-flex-col mfs-font-semibold mfs-text-muted">
              <span>R</span>
              <input type="number" min="0" max="255" :value="rgb.r" @input="onRgbChange('r', $event)" />
            </label>
            <label class="cp-rgb-item mfs-flex mfs-flex-col mfs-font-semibold mfs-text-muted">
              <span>G</span>
              <input type="number" min="0" max="255" :value="rgb.g" @input="onRgbChange('g', $event)" />
            </label>
            <label class="cp-rgb-item mfs-flex mfs-flex-col mfs-font-semibold mfs-text-muted">
              <span>B</span>
              <input type="number" min="0" max="255" :value="rgb.b" @input="onRgbChange('b', $event)" />
            </label>
          </div>

          <div v-if="presets.length" class="cp-presets mfs-grid mfs-grid-cols-4 mfs-gap-2">
            <button
              v-for="color in presets"
              :key="color"
              type="button"
              class="cp-preset mfs-rounded-sm mfs-cursor-pointer"
              :class="{ 'cp-preset--active': color.toLowerCase() === normalizedHex.toLowerCase() }"
              :style="{ backgroundColor: color }"
              :aria-label="`Select color ${color}`"
              @click="selectColor(color)"
            />
          </div>
        </div>
      </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useFloatingOverlay } from '../composables/useFloatingOverlay'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    presets?: string[]
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '#8b5cf6',
    presets: () => ['#8b5cf6', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#64748b', '#0f172a'],
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const { overlayStyle, containsTarget } = useFloatingOverlay(triggerRef, overlayRef, isOpen, { offset: 8 })

const normalizedHex = computed(() => (/^#[0-9a-fA-F]{6}$/.test(props.modelValue) ? props.modelValue : '#8b5cf6'))

const rgb = computed(() => {
  const hex = normalizedHex.value.slice(1)
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  }
})

const selectColor = (hex: string) => {
  emit('update:modelValue', hex)
  emit('change', hex)
}

const onHexInput = (val: string) => {
  const clean = val.startsWith('#') ? val : `#${val}`
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
    selectColor(clean.toLowerCase())
  }
}

const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')

const onRgbChange = (channel: 'r' | 'g' | 'b', e: Event) => {
  const num = Number((e.target as HTMLInputElement).value)
  if (Number.isNaN(num)) return
  const next = { ...rgb.value, [channel]: num }
  selectColor(`#${toHex(next.r)}${toHex(next.g)}${toHex(next.b)}`)
}

const handleClickOutside = (e: MouseEvent) => {
  if (isOpen.value && !containsTarget(e.target)) isOpen.value = false
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.cp-trigger {
  padding: 8px 14px;
  font-family: inherit;
  font-size: 0.9rem;
}

.cp-swatch {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.cp-hex {
  font-variant-numeric: tabular-nums;
}

.cp-popover {
  z-index: 45;
  width: 236px;
  box-shadow: var(--clay-shadow-hover);
}

.cp-native {
  width: 40px;
  height: 36px;
}

.cp-input {
  padding: 7px 10px;
  font-family: inherit;
}

.cp-rgb-item {
  gap: 2px;
  font-size: 0.72rem;
}

.cp-rgb-item input {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 6px;
  border-radius: var(--radius-sm, 8px);
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.12));
  border: 1px solid var(--border, transparent);
  color: var(--text);
  font-size: 0.8rem;
  text-align: center;
}

.cp-preset {
  height: 26px;
  border: 2px solid transparent;
  transition: transform 0.15s ease;
}

.cp-preset:hover {
  transform: scale(1.1);
}

.cp-preset--active {
  border-color: var(--text);
}

.cp-pop-enter-active,
.cp-pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.cp-pop-enter-from,
.cp-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

[data-theme="clay"] .cp-trigger {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .cp-trigger,
[data-theme="glass"] .cp-popover {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .cp-trigger {
  box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.55), -4px -4px 8px rgba(255, 255, 255, 0.85);
}
</style>
