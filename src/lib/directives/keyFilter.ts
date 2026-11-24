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
  onKeyPress: (e: KeyboardEvent) => void
  onPaste: (e: ClipboardEvent) => void
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

export const vKeyFilter: Directive<KeyFilterElement, KeyFilterBindingValue> = {
  mounted(el, binding: DirectiveBinding<KeyFilterBindingValue>) {
    const state: KeyFilterState = {
      filter: binding.value,
      onKeyPress(e: KeyboardEvent) {
        if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) {
          return
        }
        if (!isCharAllowed(e.key, state.filter)) {
          e.preventDefault()
        }
      },
      onPaste(e: ClipboardEvent) {
        const pasted = e.clipboardData?.getData('text') ?? ''
        if (!isPasteAllowed(pasted, state.filter)) {
          e.preventDefault()
        }
      }
    }

    el.__mfsKeyFilterState = state
    el.addEventListener('keypress', state.onKeyPress)
    el.addEventListener('paste', state.onPaste)
  },
  updated(el, binding: DirectiveBinding<KeyFilterBindingValue>) {
    if (el.__mfsKeyFilterState) {
      el.__mfsKeyFilterState.filter = binding.value
    }
  },
  unmounted(el) {
    const state = el.__mfsKeyFilterState
    if (!state) return
    el.removeEventListener('keypress', state.onKeyPress)
    el.removeEventListener('paste', state.onPaste)
    delete el.__mfsKeyFilterState
  }
}

export const KeyFilter = vKeyFilter
export default vKeyFilter
