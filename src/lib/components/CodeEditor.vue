<template>
  <div
    class="mfs-code-editor mfs-rounded mfs-shadow-card"
    :class="{
      'mfs-code-editor--readonly': isTabReadonly,
      'mfs-code-editor--disabled mfs-disabled': disabled,
      'mfs-code-editor--invalid': invalid,
      'mfs-code-editor--focused': isFocused
    }"
  >
    <!-- VSCode-style Header Bar -->
    <div class="mfs-code-editor__header">
      <div class="mfs-code-editor__dots" aria-hidden="true">
        <span class="mfs-code-editor__dot mfs-code-editor__dot--red" />
        <span class="mfs-code-editor__dot mfs-code-editor__dot--yellow" />
        <span class="mfs-code-editor__dot mfs-code-editor__dot--green" />
      </div>

      <div
        v-if="hasTabs"
        class="mfs-code-editor__tabs"
        role="tablist"
        aria-label="Code editor files"
      >
        <button
          v-for="(tab, idx) in tabs"
          :key="`${tab.filename || tab.label}-${idx}`"
          type="button"
          role="tab"
          class="mfs-code-editor__tab mfs-font-mono"
          :class="{ 'mfs-code-editor__tab--active': idx === activeIndex }"
          :aria-selected="idx === activeIndex"
          @click="selectTab(idx)"
        >
          {{ tab.filename || tab.label }}
        </button>
      </div>

      <div v-else class="mfs-code-editor__tabs">
        <span
          v-if="currentFilename"
          class="mfs-code-editor__tab mfs-code-editor__tab--active mfs-code-editor__tab--single mfs-font-mono"
        >
          {{ currentFilename }}
        </span>
      </div>

      <div class="mfs-code-editor__actions">
        <span class="mfs-code-editor__lang-pill mfs-font-mono">{{ currentLanguage.toUpperCase() }}</span>
        <button
          v-if="copyable"
          type="button"
          class="mfs-code-editor__copy-btn"
          :aria-label="copied ? 'Copied' : 'Copy code'"
          :title="copied ? 'Copied!' : 'Copy code'"
          @click="handleCopy"
        >
          <Check v-if="copied" :size="14" />
          <Copy v-else :size="14" />
          <span>{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
      </div>
    </div>

    <!-- Editor Body -->
    <div
      ref="bodyRef"
      class="mfs-code-editor__body"
      :style="{ minHeight, maxHeight }"
      @click="focusTextarea"
    >
      <!-- Line Number Gutter -->
      <div
        v-if="lineNumbers"
        class="mfs-code-editor__gutter mfs-font-mono"
        aria-hidden="true"
      >
        <div
          v-for="lineNo in lineCount"
          :key="lineNo"
          class="mfs-code-editor__line-no"
        >
          {{ lineNo }}
        </div>
      </div>

      <!-- Synchronized Highlight + Textarea Stage -->
      <div class="mfs-code-editor__stage">
        <pre
          class="mfs-code-editor__highlight mfs-font-mono"
          :aria-hidden="!isTabReadonly"
          :style="{ tabSize: String(tabSize) }"
        ><code class="mfs-code-editor__code"><span
          v-for="(lineTokens, lineIdx) in tokenizedLines"
          :key="lineIdx"
          class="mfs-code-editor__line"
        ><template v-if="lineTokens.length > 0"><span
            v-for="(tok, tokIdx) in lineTokens"
            :key="tokIdx"
            :class="`mfs-tok--${tok.type}`"
          >{{ tok.text }}</span></template><template v-else>{{ '\u200b' }}</template>{{ '\n' }}</span></code></pre>

        <textarea
          v-if="!isTabReadonly"
          ref="textareaRef"
          class="mfs-code-editor__textarea mfs-font-mono"
          :value="currentValue"
          :disabled="disabled"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :style="{ tabSize: String(tabSize) }"
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          aria-label="Code editor"
          :aria-invalid="invalid || undefined"
          @input="onInput"
          @keydown.tab.prevent="onTab"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>

    <!-- Status Footer -->
    <div class="mfs-code-editor__footer mfs-font-mono">
      <div class="mfs-code-editor__status-group">
        <span>Lines: {{ lineCount }}</span>
        <span>
          Chars: {{ charCount }}<template v-if="maxLength !== undefined"> / {{ maxLength }}</template>
        </span>
      </div>
      <div class="mfs-code-editor__status-group">
        <span>{{ currentLanguage.toUpperCase() }}</span>
        <span class="mfs-code-editor__mode-badge">{{ isTabReadonly ? 'Readonly' : 'Editable' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Check, Copy } from 'lucide-vue-next'

export type CodeLanguage = 'vue' | 'ts' | 'js' | 'html' | 'css' | 'json' | 'bash' | 'sql' | 'text'
export type CodeEditorLanguage = CodeLanguage

export interface CodeEditorTab {
  label: string
  filename?: string
  language?: CodeEditorLanguage
  code: string
  readonly?: boolean
}

export type TokenType =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'tag'
  | 'attr'
  | 'number'
  | 'operator'

export interface CodeToken {
  type: TokenType
  text: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    language?: CodeEditorLanguage
    filename?: string
    tabs?: CodeEditorTab[]
    activeTab?: number
    readonly?: boolean
    disabled?: boolean
    lineNumbers?: boolean
    copyable?: boolean
    placeholder?: string
    minHeight?: string
    maxHeight?: string
    maxLength?: number
    tabSize?: number
    invalid?: boolean
  }>(),
  {
    modelValue: '',
    language: 'vue',
    activeTab: 0,
    readonly: false,
    disabled: false,
    lineNumbers: true,
    copyable: true,
    placeholder: 'Write code here...',
    minHeight: '180px',
    maxHeight: '420px',
    tabSize: 2,
    invalid: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:tabs', tabs: CodeEditorTab[]): void
  (e: 'update:activeTab', index: number): void
  (e: 'tab-change', payload: { index: number; tab: CodeEditorTab }): void
  (e: 'change', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'copy', value: string): void
}>()

const bodyRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isFocused = ref(false)
const copied = ref(false)
const internalActiveTab = ref(props.activeTab)
let copyTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.activeTab,
  (val) => {
    internalActiveTab.value = val
  }
)

const hasTabs = computed(() => Boolean(props.tabs && props.tabs.length > 0))
const activeIndex = computed(() => {
  if (!hasTabs.value || !props.tabs) return 0
  return Math.min(Math.max(0, internalActiveTab.value), props.tabs.length - 1)
})
const activeTabItem = computed(() => (hasTabs.value && props.tabs ? props.tabs[activeIndex.value] : undefined))

const currentValue = computed(() => (hasTabs.value ? (activeTabItem.value?.code ?? '') : (props.modelValue ?? '')))
const currentLanguage = computed<CodeEditorLanguage>(() =>
  hasTabs.value ? (activeTabItem.value?.language ?? props.language) : props.language
)
const currentFilename = computed(() =>
  hasTabs.value ? (activeTabItem.value?.filename || activeTabItem.value?.label) : props.filename
)
const isTabReadonly = computed(() => (hasTabs.value ? (activeTabItem.value?.readonly ?? props.readonly) : props.readonly))

const rawLines = computed(() => currentValue.value.split('\n'))
const lineCount = computed(() => Math.max(1, rawLines.value.length))
const charCount = computed(() => currentValue.value.length)

const JS_KEYWORDS = new Set([
  'as', 'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends',
  'false', 'finally', 'for', 'from', 'function', 'if', 'implements', 'import',
  'in', 'instanceof', 'interface', 'let', 'new', 'null', 'of', 'package',
  'private', 'protected', 'public', 'readonly', 'return', 'static', 'super',
  'switch', 'this', 'throw', 'true', 'try', 'type', 'typeof', 'undefined',
  'var', 'void', 'while', 'with', 'yield'
])

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'JOIN', 'LEFT', 'RIGHT',
  'INNER', 'OUTER', 'ON', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT', 'COUNT',
  'ASC', 'DESC', 'TRUE', 'FALSE', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
])

const BASH_KEYWORDS = new Set([
  'if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while',
  'until', 'case', 'esac', 'function', 'return', 'export', 'local', 'readonly',
  'echo', 'exit', 'cd', 'ls', 'cat', 'grep', 'sed', 'awk', 'npm', 'bun', 'yarn',
  'npx', 'git', 'curl', 'sudo', 'chmod', 'mkdir', 'rm', 'cp', 'mv', 'true', 'false'
])

const CSS_KEYWORDS = new Set([
  'important', 'inherit', 'initial', 'unset', 'none', 'auto', 'block', 'inline',
  'flex', 'grid', 'absolute', 'relative', 'fixed', 'sticky', 'solid', 'dashed',
  'transparent', 'currentColor', 'var', 'calc', 'rgb', 'rgba', 'hsl', 'hsla'
])

const JSON_KEYWORDS = new Set(['true', 'false', 'null'])

function pushToken(tokens: CodeToken[], type: TokenType, text: string): void {
  if (!text) return
  const prev = tokens[tokens.length - 1]
  if (prev && prev.type === type) {
    prev.text += text
  } else {
    tokens.push({ type, text })
  }
}

function isIdentStart(ch: string): boolean {
  return /[A-Za-z_$]/.test(ch)
}

function isIdentChar(ch: string): boolean {
  return /[A-Za-z0-9_$-]/.test(ch)
}

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9'
}

function tokenizeLine(
  line: string,
  lang: CodeLanguage,
  state: { inBlockComment: boolean; inHtmlComment: boolean }
): CodeToken[] {
  if (!line) return []
  if (lang === 'text') return [{ type: 'plain', text: line }]

  const tokens: CodeToken[] = []
  const len = line.length
  let i = 0
  let inTag = false

  while (i < len) {
    if (state.inHtmlComment) {
      const endIdx = line.indexOf('--' + '>', i)
      if (endIdx === -1) {
        pushToken(tokens, 'comment', line.slice(i))
        i = len
      } else {
        pushToken(tokens, 'comment', line.slice(i, endIdx + 3))
        i = endIdx + 3
        state.inHtmlComment = false
      }
      continue
    }

    if (state.inBlockComment) {
      const endIdx = line.indexOf('*' + '/', i)
      if (endIdx === -1) {
        pushToken(tokens, 'comment', line.slice(i))
        i = len
      } else {
        pushToken(tokens, 'comment', line.slice(i, endIdx + 2))
        i = endIdx + 2
        state.inBlockComment = false
      }
      continue
    }

    const ch = line[i]
    const next = line[i + 1] ?? ''

    // Whitespace
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      let j = i + 1
      while (j < len && (line[j] === ' ' || line[j] === '\t' || line[j] === '\r')) j++
      pushToken(tokens, 'plain', line.slice(i, j))
      i = j
      continue
    }

    // HTML / Vue comments
    if ((lang === 'vue' || lang === 'html') && line.startsWith('<' + '!--', i)) {
      const endIdx = line.indexOf('--' + '>', i + 4)
      if (endIdx === -1) {
        pushToken(tokens, 'comment', line.slice(i))
        state.inHtmlComment = true
        i = len
      } else {
        pushToken(tokens, 'comment', line.slice(i, endIdx + 3))
        i = endIdx + 3
      }
      continue
    }

    // Block comments
    if ((lang === 'js' || lang === 'ts' || lang === 'vue' || lang === 'css' || lang === 'sql') && ch === '/' && next === '*') {
      const endIdx = line.indexOf('*' + '/', i + 2)
      if (endIdx === -1) {
        pushToken(tokens, 'comment', line.slice(i))
        state.inBlockComment = true
        i = len
      } else {
        pushToken(tokens, 'comment', line.slice(i, endIdx + 2))
        i = endIdx + 2
      }
      continue
    }

    // Line comments
    if ((lang === 'js' || lang === 'ts' || lang === 'vue' || lang === 'css') && ch === '/' && next === '/') {
      pushToken(tokens, 'comment', line.slice(i))
      i = len
      continue
    }
    if (lang === 'bash' && ch === '#') {
      pushToken(tokens, 'comment', line.slice(i))
      i = len
      continue
    }
    if (lang === 'sql' && ch === '-' && next === '-') {
      pushToken(tokens, 'comment', line.slice(i))
      i = len
      continue
    }

    // Strings: ', ", `
    if (ch === '"' || ch === "'" || (ch === '`' && lang !== 'sql')) {
      const quote = ch
      let j = i + 1
      while (j < len) {
        if (line[j] === '\\' && j + 1 < len) {
          j += 2
          continue
        }
        if (line[j] === quote) {
          j++
          break
        }
        j++
      }
      pushToken(tokens, 'string', line.slice(i, j))
      i = j
      continue
    }

    // HTML / Vue tags
    if ((lang === 'vue' || lang === 'html') && ch === '<') {
      const isClosing = next === '/'
      let j = i + (isClosing ? 2 : 1)
      if (j < len && /[A-Za-z]/.test(line[j])) {
        while (j < len && /[A-Za-z0-9_:-]/.test(line[j])) j++
        pushToken(tokens, 'operator', line.slice(i, i + (isClosing ? 2 : 1)))
        pushToken(tokens, 'tag', line.slice(i + (isClosing ? 2 : 1), j))
        inTag = !isClosing
        i = j
        continue
      }
    }

    if ((lang === 'vue' || lang === 'html') && inTag) {
      if (ch === '/' && next === '>') {
        pushToken(tokens, 'operator', '/>')
        inTag = false
        i += 2
        continue
      }
      if (ch === '>') {
        pushToken(tokens, 'operator', '>')
        inTag = false
        i++
        continue
      }
      // Vue / HTML attributes (including :prop, @event, v-model, #slot)
      if (/[A-Za-z:@#]/.test(ch)) {
        let j = i + 1
        while (j < len && /[A-Za-z0-9_.:-]/.test(line[j])) j++
        pushToken(tokens, 'attr', line.slice(i, j))
        i = j
        continue
      }
    }

    // CSS hex colors or properties
    if (lang === 'css' && ch === '#' && /[0-9A-Fa-f]/.test(next)) {
      let j = i + 1
      while (j < len && /[0-9A-Fa-f]/.test(line[j])) j++
      pushToken(tokens, 'number', line.slice(i, j))
      i = j
      continue
    }

    // Numbers
    if (isDigit(ch) || (ch === '.' && isDigit(next))) {
      let j = i + 1
      while (j < len && /[0-9._xXa-fA-F]/.test(line[j])) j++
      pushToken(tokens, 'number', line.slice(i, j))
      i = j
      continue
    }

    // Identifiers & keywords
    if (isIdentStart(ch)) {
      let j = i + 1
      while (j < len && isIdentChar(line[j])) j++
      const word = line.slice(i, j)

      let isKw = false
      if (lang === 'js' || lang === 'ts' || lang === 'vue') {
        isKw = JS_KEYWORDS.has(word)
      } else if (lang === 'sql') {
        isKw = SQL_KEYWORDS.has(word.toUpperCase())
      } else if (lang === 'bash') {
        isKw = BASH_KEYWORDS.has(word)
      } else if (lang === 'css') {
        isKw = CSS_KEYWORDS.has(word)
      } else if (lang === 'json') {
        isKw = JSON_KEYWORDS.has(word)
      }

      if (lang === 'json' && line[j] === undefined) {
        pushToken(tokens, isKw ? 'keyword' : 'plain', word)
      } else if (lang === 'css' && line.slice(j).trimStart().startsWith(':')) {
        pushToken(tokens, 'attr', word)
      } else {
        pushToken(tokens, isKw ? 'keyword' : 'plain', word)
      }
      i = j
      continue
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(ch)) {
      let j = i + 1
      while (j < len && /[+\-*/%=<>!&|^~?:]/.test(line[j])) j++
      pushToken(tokens, 'operator', line.slice(i, j))
      i = j
      continue
    }

    // Punctuation / other single chars
    pushToken(tokens, 'plain', ch)
    i++
  }

  return tokens
}

const tokenizedLines = computed<CodeToken[][]>(() => {
  const state = { inBlockComment: false, inHtmlComment: false }
  return rawLines.value.map((line) => tokenizeLine(line, currentLanguage.value, state))
})

const selectTab = (index: number) => {
  if (!hasTabs.value || !props.tabs) return
  const tab = props.tabs[index]
  if (!tab) return
  internalActiveTab.value = index
  emit('update:activeTab', index)
  emit('tab-change', { index, tab })
}

const emitCodeUpdate = (nextVal: string) => {
  if (hasTabs.value && props.tabs) {
    const nextTabs = props.tabs.map((tab, idx) =>
      idx === activeIndex.value ? { ...tab, code: nextVal } : tab
    )
    emit('update:tabs', nextTabs)
  } else {
    emit('update:modelValue', nextVal)
  }
  emit('change', nextVal)
}

const focusTextarea = () => {
  if (!isTabReadonly.value && !props.disabled) {
    textareaRef.value?.focus()
  }
}

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emitCodeUpdate(target.value)
}

const onTab = async (event: KeyboardEvent) => {
  if (isTabReadonly.value || props.disabled) return
  const el = event.target as HTMLTextAreaElement
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const indent = ' '.repeat(Math.max(1, props.tabSize))
  const val = currentValue.value
  const nextVal = val.slice(0, start) + indent + val.slice(end)

  if (props.maxLength !== undefined && nextVal.length > props.maxLength) return

  emitCodeUpdate(nextVal)

  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.selectionStart = start + indent.length
    textareaRef.value.selectionEnd = start + indent.length
  }
}

const onFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const onBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleCopy = async () => {
  const text = currentValue.value
  let success = false

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      success = true
    } catch {
      success = false
    }
  }

  if (!success && typeof document !== 'undefined') {
    const temp = document.createElement('textarea')
    temp.value = text
    temp.setAttribute('readonly', '')
    temp.style.position = 'fixed'
    temp.style.opacity = '0'
    document.body.appendChild(temp)
    temp.select()
    try {
      success = document.execCommand('copy')
    } catch {
      success = false
    }
    document.body.removeChild(temp)
  }

  if (success) {
    copied.value = true
    emit('copy', text)
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1800)
  }
}
</script>

<style scoped>
.mfs-code-editor {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background-color: #0f172a;
  color: #e2e8f0;
  border: 1px solid var(--border, rgba(148, 163, 184, 0.25));
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.mfs-code-editor--focused {
  border-color: var(--primary, #38bdf8);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary, #38bdf8) 22%, transparent);
}

.mfs-code-editor--invalid {
  border-color: var(--danger, #ef4444);
}

.mfs-code-editor--invalid.mfs-code-editor--focused {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger, #ef4444) 22%, transparent);
}

.mfs-code-editor--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.mfs-code-editor__header {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 10px;
  min-height: 40px;
  padding: 0 12px 0 14px;
  background-color: #181825;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.mfs-code-editor__dots {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-right: 4px;
}

.mfs-code-editor__dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
}

.mfs-code-editor__dot--red { background-color: #ff5f56; }
.mfs-code-editor__dot--yellow { background-color: #ffbd2e; }
.mfs-code-editor__dot--green { background-color: #27c93f; }

.mfs-code-editor__tabs {
  display: flex;
  align-items: stretch;
  gap: 0;
  min-width: 0;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.mfs-code-editor__tabs::-webkit-scrollbar {
  display: none;
}

.mfs-code-editor__tab {
  display: inline-flex;
  align-items: center;
  appearance: none;
  border: 0;
  border-top: 2px solid transparent;
  border-right: 1px solid rgba(148, 163, 184, 0.14);
  background: transparent;
  color: #94a3b8;
  font-size: 0.76rem;
  font-weight: 500;
  padding: 0 14px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
}

.mfs-code-editor__tab--single {
  cursor: default;
}

.mfs-code-editor__tab:not(.mfs-code-editor__tab--single):hover {
  color: #e2e8f0;
  background-color: rgba(15, 23, 42, 0.45);
}

.mfs-code-editor__tab--active {
  color: #f8fafc;
  background-color: #0f172a;
  border-top-color: var(--primary, #38bdf8);
  margin-bottom: -1px;
  padding-bottom: 1px;
}

.mfs-code-editor__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 6px 0;
}

.mfs-code-editor__lang-pill {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 9999px;
  background-color: rgba(56, 189, 248, 0.14);
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.25);
  flex-shrink: 0;
}

.mfs-code-editor__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background-color: rgba(15, 23, 42, 0.55);
  color: #e2e8f0;
  font-size: 0.74rem;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.mfs-code-editor__copy-btn:hover {
  background-color: rgba(56, 189, 248, 0.16);
  border-color: var(--primary, #38bdf8);
}

.mfs-code-editor__body {
  display: flex;
  align-items: stretch;
  overflow: auto;
  position: relative;
  cursor: text;
}

.mfs-code-editor--readonly .mfs-code-editor__body {
  cursor: default;
}

.mfs-code-editor__gutter {
  position: sticky;
  left: 0;
  z-index: 2;
  flex-shrink: 0;
  padding: 14px 10px 14px 12px;
  min-width: 44px;
  text-align: right;
  user-select: none;
  background-color: #0f172a;
  border-right: 1px solid rgba(148, 163, 184, 0.14);
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.6;
}

.mfs-code-editor__line-no {
  height: calc(0.84rem * 1.6);
}

.mfs-code-editor__stage {
  position: relative;
  flex: 1;
  min-width: 0;
}

.mfs-code-editor__highlight,
.mfs-code-editor__textarea {
  margin: 0;
  padding: 14px 16px;
  font-size: 0.84rem;
  line-height: 1.6;
  letter-spacing: normal;
  white-space: pre;
  word-wrap: normal;
  box-sizing: border-box;
  border: 0;
}

.mfs-code-editor__highlight {
  position: relative;
  min-height: 100%;
  pointer-events: none;
  color: #e2e8f0;
}

.mfs-code-editor--readonly .mfs-code-editor__highlight {
  pointer-events: auto;
  user-select: text;
}

.mfs-code-editor__code {
  display: block;
  font-family: inherit;
}

.mfs-code-editor__line {
  display: block;
}

.mfs-code-editor__textarea {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  resize: none;
  overflow: hidden;
  background: transparent;
  color: transparent;
  caret-color: #38bdf8;
  outline: none;
  z-index: 1;
}

.mfs-code-editor__textarea::placeholder {
  color: #64748b;
  opacity: 0.75;
}

.mfs-code-editor__textarea::selection {
  background: rgba(56, 189, 248, 0.28);
}

.mfs-code-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 12px;
  background-color: #1e293b;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
  color: #94a3b8;
  font-size: 0.72rem;
}

.mfs-code-editor__status-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mfs-code-editor__mode-badge {
  color: #cbd5e1;
}

/* Syntax Token Colors (VSCode Dark+ inspired) */
.mfs-tok--plain { color: #e2e8f0; }
.mfs-tok--comment { color: #64748b; font-style: italic; }
.mfs-tok--string { color: #a5f3fc; }
.mfs-tok--keyword { color: #c084fc; font-weight: 500; }
.mfs-tok--tag { color: #f472b6; }
.mfs-tok--attr { color: #7dd3fc; }
.mfs-tok--number { color: #fbbf24; }
.mfs-tok--operator { color: #94a3b8; }

[data-theme="glass"] .mfs-code-editor {
  border-color: rgba(255, 255, 255, 0.22);
}
</style>
