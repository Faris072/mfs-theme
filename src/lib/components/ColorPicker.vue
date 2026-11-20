<template>
  <div ref="rootRef" class="cp-wrapper" :class="{ 'cp-wrapper--disabled mfs-disabled': disabled }">
    <span v-if="label" class="cp-label mfs-text">{{ label }}</span>

    <div class="cp-container">
      <button
        type="button"
        class="cp-trigger mfs-surface mfs-rounded mfs-shadow mfs-interactive"
        :disabled="disabled"
        :aria-expanded="isOpen"
        aria-label="Pick a color"
        @click="isOpen = !isOpen"
      >
        <span class="cp-swatch" :style="{ backgroundColor: modelValue }" />
        <span class="cp-hex mfs-font-mono">{{ modelValue.toUpperCase() }}</span>
      </button>

      <Transition name="cp-pop">
        <div v-if="isOpen" class="cp-popover mfs-surface mfs-rounded mfs-blur mfs-shadow" role="dialog" aria-label="Color picker">
          <div class="cp-native-row">
            <input
              type="color"
              class="cp-native"
              :value="normalizedHex"
              aria-label="Color palette"
              @input="onHexInput(($event.target as HTMLInputElement).value)"
            />
            <input
              type="text"
              class="cp-input mfs-inset mfs-font-mono"
              :value="modelValue"
              maxlength="7"
              aria-label="Hex color"
              @change="onHexInput(($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="cp-rgb">
            <label class="cp-rgb-item">
              <span>R</span>
              <input type="number" min="0" max="255" :value="rgb.r" @input="onRgbChange('r', $event)" />
            </label>
            <label class="cp-rgb-item">
              <span>G</span>
              <input type="number" min="0" max="255" :value="rgb.g" @input="onRgbChange('g', $event)" />
            </label>
            <label class="cp-rgb-item">
              <span>B</span>
              <input type="number" min="0" max="255" :value="rgb.b" @input="onRgbChange('b', $event)" />
            </label>
          </div>

          <div v-if="presets.length" class="cp-presets">
            <button
              v-for="color in presets"
              :key="color"
              type="button"
              class="cp-preset"
              :class="{ 'cp-preset--active': color.toLowerCase() === normalizedHex.toLowerCase() }"
              :style="{ backgroundColor: color }"
              :aria-label="`Select color ${color}`"
              @click="selectColor(color)"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

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
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) isOpen.value = false
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
.cp-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
}

.cp-wrapper--disabled {
  opacity: 0.55;
  pointer-events: none;
}

.cp-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
}

.cp-container {
  position: relative;
}

.cp-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: var(--radius, 14px);
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--clay-shadow);
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: var(--backdrop-blur, none);
}

.cp-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.cp-hex {
  font-variant-numeric: tabular-nums;
}

.cp-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 45;
  width: 236px;
  padding: 12px;
  border-radius: var(--radius, 16px);
  background-color: var(--surface);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--clay-shadow-hover);
  backdrop-filter: var(--backdrop-blur, blur(14px));
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cp-native-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cp-native {
  width: 40px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  cursor: pointer;
}

.cp-input {
  flex: 1;
  min-width: 0;
  padding: 7px 10px;
  border-radius: var(--radius-sm, 8px);
  background-color: var(--surface-subtle, rgba(148, 163, 184, 0.12));
  border: 1px solid var(--border, transparent);
  color: var(--text);
  font-family: inherit;
  font-size: 0.875rem;
}

.cp-rgb {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.cp-rgb-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
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

.cp-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.cp-preset {
  height: 26px;
  border-radius: var(--radius-sm, 8px);
  border: 2px solid transparent;
  cursor: pointer;
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
