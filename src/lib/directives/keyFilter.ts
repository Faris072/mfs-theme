import type { Directive, DirectiveBinding } from 'vue'

export type KeyFilterPreset = 'int' | 'pint' | 'num' | 'pnum' | 'money' | 'hex' | 'alpha' | 'alphanum'

export type KeyFilterBindingValue = KeyFilterPreset | RegExp | null | undefined

interface PresetRule {
  charPattern: RegExp
  pastePattern: RegExp
}

const PRESET_RULES: Record<KeyFilterPreset, PresetRule> = {
  int: { charPattern: /^[\d-]$/, pastePattern: /^-?\d+$/ },
  pint: { charPattern: /^\d$/, pastePattern: /^\d+$/ },
  num: { charPattern: /^[\d.-]$/, pastePattern: /^-?\d*(\.\d*)?$/ },
  pnum: { charPattern: /^[\d.]$/, pastePattern: /^\d*(\.\d*)?$/ },
  money: { charPattern: /^[\d.,\s]$/, pastePattern: /^[\d.,\s]+$/ },
  hex: { charPattern: /^[0-9a-fA-F]$/, pastePattern: /^[0-9a-fA-F]+$/ },
  alpha: { charPattern: /^[a-zA-Z]$/, pastePattern: /^[a-zA-Z]+$/ },
  alphanum: { charPattern: /^[a-zA-Z0-9]$/, pastePattern: /^[a-zA-Z0-9]+$/ }
}

interface KeyFilterState {
  filter: KeyFilterBindingValue
  target: HTMLElement
  isComposing: boolean
  isDispatching: boolean
  onKeyPress: (e: KeyboardEvent) => void
  onBeforeInput: (e: InputEvent) => void
  onPaste: (e: ClipboardEvent) => void
  onCompositionStart: () => void
  onCompositionEnd: () => void
  onInput: () => void
}

interface KeyFilterElement extends HTMLElement {
  __mfsKeyFilterState?: KeyFilterState
}

function testRegexSafe(regex: RegExp, value: string): boolean {
  if (regex.global || regex.sticky) {
    regex.lastIndex = 0
  }
  return regex.test(value)
}

function isCharAllowed(char: string, filter: KeyFilterBindingValue): boolean {
  if (!filter) return true
  if (filter instanceof RegExp) {
    return testRegexSafe(filter, char)
  }
  const preset = PRESET_RULES[filter]
  return preset ? preset.charPattern.test(char) : true
}

function isPasteAllowed(text: string, filter: KeyFilterBindingValue): boolean {
  if (!filter || text === '') return true
  if (filter instanceof RegExp) {
    if (filter.source.startsWith('^') || filter.source.endsWith('$')) {
      return testRegexSafe(filter, text)
    }
    return [...text].every((ch) => testRegexSafe(filter, ch))
  }
  const preset = PRESET_RULES[filter]
  return preset ? preset.pastePattern.test(text) : true
}

function resolveTargetElement(el: HTMLElement): HTMLElement {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el
  }
  return el.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea') ?? el
}

function applyInputMode(target: HTMLElement, filter: KeyFilterBindingValue): void {
  if (filter === 'int' && target instanceof HTMLInputElement && !target.hasAttribute('inputmode')) {
    target.setAttribute('inputmode', 'numeric')
  }
}

function sanitizeValue(value: string, filter: KeyFilterBindingValue): string {
  if (!filter || value === '') return value

  if (filter === 'int' || filter === 'num' || filter === 'pnum') {
    let out = ''
    let hasDot = false
    const allowSign = filter !== 'pnum'
    const allowDot = filter !== 'int'

    for (const ch of value) {
      if (ch >= '0' && ch <= '9') {
        out += ch
      } else if (allowSign && ch === '-' && out.length === 0) {
        out += ch
      } else if (allowDot && ch === '.' && !hasDot) {
        out += ch
        hasDot = true
      }
    }
    return out
  }

  return [...value].filter((ch) => isCharAllowed(ch, filter)).join('')
}

function sanitizeAndSync(target: HTMLElement, state: KeyFilterState): void {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return

  const raw = target.value
  const sanitized = sanitizeValue(raw, state.filter)
  if (sanitized === raw) return

  const selStart = target.selectionStart
  const newPos = selStart !== null ? sanitizeValue(raw.slice(0, selStart), state.filter).length : null

  target.value = sanitized

  if (newPos !== null && document.activeElement === target) {
    try {
      const clamped = Math.min(newPos, sanitized.length)
      target.setSelectionRange(clamped, clamped)
    } catch {
      // Some input types do not support setSelectionRange
    }
  }

  state.isDispatching = true
  try {
    target.dispatchEvent(new Event('input', { bubbles: true }))
  } finally {
    state.isDispatching = false
  }
}

export const vKeyFilter: Directive<KeyFilterElement, KeyFilterBindingValue> = {
  mounted(el, binding: DirectiveBinding<KeyFilterBindingValue>) {
    const target = resolveTargetElement(el)
    applyInputMode(target, binding.value)

    const state: KeyFilterState = {
      filter: binding.value,
      target,
      isComposing: false,
      isDispatching: false,
      onKeyPress(e: KeyboardEvent) {
        if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) {
          return
        }
        if (!isCharAllowed(e.key, state.filter)) {
          e.preventDefault()
        }
      },
      onBeforeInput(e: InputEvent) {
        if (state.isComposing || e.isComposing || !e.data || e.inputType.startsWith('delete')) {
          return
        }
        if (e.inputType === 'insertFromPaste') {
          if (!isPasteAllowed(e.data, state.filter)) {
            e.preventDefault()
          }
          return
        }
        if (![...e.data].every((ch) => isCharAllowed(ch, state.filter))) {
          e.preventDefault()
        }
      },
      onPaste(e: ClipboardEvent) {
        const pasted = e.clipboardData?.getData('text') ?? ''
        if (!isPasteAllowed(pasted, state.filter)) {
          e.preventDefault()
        }
      },
      onCompositionStart() {
        state.isComposing = true
      },
      onCompositionEnd() {
        state.isComposing = false
        sanitizeAndSync(target, state)
      },
      onInput() {
        if (state.isDispatching) return
        sanitizeAndSync(target, state)
      }
    }

    el.__mfsKeyFilterState = state
    target.addEventListener('keypress', state.onKeyPress)
    target.addEventListener('beforeinput', state.onBeforeInput as EventListener)
    target.addEventListener('paste', state.onPaste)
    target.addEventListener('compositionstart', state.onCompositionStart)
    target.addEventListener('compositionend', state.onCompositionEnd)
    target.addEventListener('input', state.onInput)
  },
  updated(el, binding: DirectiveBinding<KeyFilterBindingValue>) {
    const state = el.__mfsKeyFilterState
    if (state) {
      state.filter = binding.value
      applyInputMode(state.target, binding.value)
    }
  },
  unmounted(el) {
    const state = el.__mfsKeyFilterState
    if (!state) return
    const { target } = state
    target.removeEventListener('keypress', state.onKeyPress)
    target.removeEventListener('beforeinput', state.onBeforeInput as EventListener)
    target.removeEventListener('paste', state.onPaste)
    target.removeEventListener('compositionstart', state.onCompositionStart)
    target.removeEventListener('compositionend', state.onCompositionEnd)
    target.removeEventListener('input', state.onInput)
    delete el.__mfsKeyFilterState
  }
}

export const KeyFilter = vKeyFilter
export default vKeyFilter
