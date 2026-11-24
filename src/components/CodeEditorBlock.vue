<template>
  <div class="code-editor">
    <div class="code-editor__titlebar">
      <div class="code-editor__left">
        <div class="code-editor__dots" aria-hidden="true">
          <span class="dot dot--red" />
          <span class="dot dot--yellow" />
          <span class="dot dot--green" />
        </div>
        <div v-if="hasTabs" class="code-editor__tabs" role="tablist" aria-label="Code files">
          <button
            v-for="(item, idx) in tabs"
            :key="`${item.filename || item.label}-${idx}`"
            type="button"
            role="tab"
            class="code-editor__tab code-editor__tab--btn"
            :class="{ 'is-active': idx === activeTabIndex }"
            :aria-selected="idx === activeTabIndex"
            @click="selectTab(idx)"
          >
            <span class="code-editor__filename">{{ item.filename || item.label }}</span>
          </button>
        </div>
        <div v-else class="code-editor__tab is-active">
          <span class="code-editor__filename">{{ resolvedFilename }}</span>
        </div>
      </div>

      <div class="code-editor__actions">
        <span class="code-editor__lang">{{ resolvedLanguage }}</span>
        <button
          v-if="showCopy"
          type="button"
          class="code-editor__copy"
          :class="{ 'is-copied': copied }"
          :aria-label="copied ? 'Code copied' : 'Copy code'"
          @click.prevent.stop="handleCopy"
        >
          <Check v-if="copied" :size="13" />
          <Copy v-else :size="13" />
          <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>
      </div>
    </div>

    <div
      class="code-editor__body"
      :style="maxHeight ? { maxHeight, overflowY: 'auto' } : undefined"
    >
      <div class="code-editor__grid">
        <div class="code-editor__gutter" aria-hidden="true">
          <span
            v-for="lineNum in lineCount"
            :key="lineNum"
            class="code-editor__line-num"
          >{{ lineNum }}</span>
        </div>
        <pre class="code-editor__pre"><code class="code-editor__code"><span
          v-for="(lineHtml, idx) in highlightedLines"
          :key="idx"
          class="code-editor__line"
          v-html="lineHtml || ' '"
        /></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Check, Copy } from 'lucide-vue-next'

export interface CodeTab {
  label: string
  filename?: string
  language?: string
  code: string
}

const props = withDefaults(
  defineProps<{
    code?: string
    tabs?: CodeTab[]
    filename?: string
    language?: string
    showCopy?: boolean
    maxHeight?: string
  }>(),
  {
    code: '',
    showCopy: true
  }
)

const emit = defineEmits<{
  (e: 'tab-change', index: number): void
}>()

const activeTabIndex = ref(0)

watch(
  () => props.tabs,
  (newTabs) => {
    if (!newTabs || activeTabIndex.value >= newTabs.length) {
      activeTabIndex.value = 0
    }
  }
)

const hasTabs = computed(() => Boolean(props.tabs && props.tabs.length > 0))
const activeTab = computed(() => (hasTabs.value ? props.tabs![activeTabIndex.value] ?? props.tabs![0] : null))
const activeCode = computed(() => activeTab.value?.code ?? props.code ?? '')

const selectTab = (index: number) => {
  activeTabIndex.value = index
  emit('tab-change', index)
}

const resolvedFilename = computed(() => {
  if (activeTab.value) return activeTab.value.filename || activeTab.value.label
  if (props.filename) return props.filename
  const src = activeCode.value
  if (/<template[\s>]|<script[\s>]/i.test(src)) return 'Example.vue'
  if (/^\s*import\s+/m.test(src)) return 'main.ts'
  if (/\[data-theme|^\s*--[\w-]+\s*:|\{\s*[\w-]+\s*:/m.test(src)) return 'theme.css'
  return 'snippet.vue'
})

const resolvedLanguage = computed(() => {
  const lang = activeTab.value ? activeTab.value.language : props.language
  if (lang) return lang.toUpperCase()
  const name = resolvedFilename.value.toLowerCase()
  if (name.endsWith('.vue')) return 'VUE'
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'TS'
  if (name.endsWith('.js') || name.endsWith('.jsx')) return 'JS'
  if (name.endsWith('.css')) return 'CSS'
  if (name.endsWith('.json')) return 'JSON'
  if (name.endsWith('.html')) return 'HTML'
  return 'CODE'
})

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const wrapSpan = (cls: string, text: string): string => {
  if (!text.includes('\n')) {
    return `<span class="${cls}">${escapeHtml(text)}</span>`
  }
  return text
    .split('\n')
    .map((part) => (part ? `<span class="${cls}">${escapeHtml(part)}</span>` : ''))
    .join('\n')
}

// Single-pass tokenizer so regexes never run over inserted <span> HTML.
const TOKEN_REGEX = new RegExp(
  [
    // 1: HTML / block / line comments
    '(<!--[\s\S]*?-->|\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)',
    // 2: Strings (single, double, template)
    "('(?:\\\\.|[^'\\\\\\n])*'|\"(?:\\\\.|[^\"\\\\\\n])*\"|`(?:\\\\.|[^`\\\\])*`)",
    // 3: Opening/closing tag brackets + tag name (e.g. <div, </template)
    '(<\\/?[A-Za-z][\\w-]*)',
    // 4: Self-closing or closing angle brackets
    '(\\/?>)',
    // 5: Vue directives & shorthand attributes (v-*, :*, @*)
    '((?:v-[\\w-]+|:[\\w-]+|@[\\w.-]+)(?=\\s*=|\\s|>|\\/))',
    // 6: CSS custom properties (--var-name)
    '(--[A-Za-z0-9_-]+)',
    // 7: JS/TS keywords
    '\\b(import|export|from|const|let|var|function|return|async|await|type|interface|true|false|null|undefined|default|if|else|for|of|in|new|as)\\b',
    // 8: Numbers (hex colors or numeric literals)
    '(#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|ms|s)?\\b)'
  ].join('|'),
  'g'
)

const highlightCode = (raw: string): string[] => {
  const normalized = raw.replace(/\r\n/g, '\n')
  let result = ''
  let lastIndex = 0

  TOKEN_REGEX.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = TOKEN_REGEX.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(normalized.slice(lastIndex, match.index))
    }

    const [
      full,
      comment,
      str,
      tagOpen,
      tagClose,
      directive,
      cssProp,
      keyword,
      num
    ] = match

    if (comment) {
      result += wrapSpan('tok-comment', comment)
    } else if (str) {
      result += wrapSpan('tok-string', str)
    } else if (tagOpen) {
      const bracket = tagOpen.startsWith('</') ? '</' : '<'
      const tagName = tagOpen.slice(bracket.length)
      result += `<span class="tok-bracket">${escapeHtml(bracket)}</span><span class="tok-tag">${escapeHtml(tagName)}</span>`
    } else if (tagClose) {
      result += wrapSpan('tok-bracket', tagClose)
    } else if (directive) {
      result += wrapSpan('tok-directive', directive)
    } else if (cssProp) {
      result += wrapSpan('tok-css-prop', cssProp)
    } else if (keyword) {
      result += wrapSpan('tok-keyword', keyword)
    } else if (num) {
      result += wrapSpan('tok-number', num)
    } else {
      result += escapeHtml(full)
    }

    lastIndex = TOKEN_REGEX.lastIndex
  }

  if (lastIndex < normalized.length) {
    result += escapeHtml(normalized.slice(lastIndex))
  }

  return result.split('\n')
}

const highlightedLines = computed(() => highlightCode(activeCode.value))
const lineCount = computed(() => highlightedLines.value.length)

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(activeCode.value)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    // Clipboard may be unavailable in restricted contexts
  }
}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<style scoped>
.code-editor {
  border-radius: 10px;
  overflow: hidden;
  background: #1e1e2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  color: #cdd6f4;
  text-align: left;
}

.code-editor__titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: #181825;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  padding-right: 0.75rem;
  min-height: 38px;
}

.code-editor__left {
  display: flex;
  align-items: stretch;
  min-width: 0;
}

.code-editor__dots {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 0.85rem;
  flex-shrink: 0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  display: inline-block;
}

.dot--red {
  background: #ff5f56;
}

.dot--yellow {
  background: #ffbd2e;
}

.dot--green {
  background: #27c93f;
}

.code-editor__tabs {
  display: flex;
  align-items: stretch;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.code-editor__tabs::-webkit-scrollbar {
  display: none;
}

.code-editor__tab {
  display: flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  background: #1e1e2e;
  border-top: 2px solid var(--primary, #89b4fa);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  min-width: 0;
  flex-shrink: 0;
}

.code-editor__tab--btn {
  appearance: none;
  border-bottom: none;
  border-left: none;
  border-top: 2px solid transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.code-editor__tab--btn .code-editor__filename {
  color: #7f849c;
}

.code-editor__tab--btn:hover:not(.is-active) {
  background: rgba(255, 255, 255, 0.04);
}

.code-editor__tab--btn:hover:not(.is-active) .code-editor__filename {
  color: #bac2de;
}

.code-editor__tab--btn.is-active {
  background: #1e1e2e;
  border-top-color: var(--primary, #89b4fa);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
}

.code-editor__tab--btn.is-active .code-editor__filename {
  color: #f5f7ff;
}

.code-editor__filename {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: #cdd6f4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.code-editor__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.code-editor__lang {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #a6adc8;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.code-editor__copy {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #cdd6f4;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.code-editor__copy:hover {
  background: rgba(255, 255, 255, 0.12);
}

.code-editor__copy.is-copied {
  color: #a6e3a1;
  border-color: rgba(166, 227, 161, 0.4);
  background: rgba(166, 227, 161, 0.1);
}

.code-editor__body {
  background: #1e1e2e;
  overflow-x: auto;
}

.code-editor__grid {
  display: flex;
  align-items: stretch;
  min-width: max-content;
  padding: 0.85rem 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.65;
}

.code-editor__gutter {
  display: flex;
  flex-direction: column;
  padding: 0 0.85rem 0 0.75rem;
  margin-right: 0.9rem;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  text-align: right;
  user-select: none;
  color: #585b70;
  flex-shrink: 0;
}

.code-editor__line-num {
  display: block;
}

.code-editor__pre {
  margin: 0;
  padding-right: 1.1rem;
  flex: 1;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  background: transparent;
}

.code-editor__code {
  display: flex;
  flex-direction: column;
  font-family: inherit;
}

.code-editor__line {
  display: block;
  white-space: pre;
}

:deep(.tok-comment) {
  color: #6c7086;
  font-style: italic;
}

:deep(.tok-string) {
  color: #a6e3a1;
}

:deep(.tok-tag) {
  color: #f38ba8;
}

:deep(.tok-bracket) {
  color: #89dceb;
}

:deep(.tok-directive) {
  color: #f9e2af;
}

:deep(.tok-css-prop) {
  color: #89b4fa;
}

:deep(.tok-keyword) {
  color: #cba6f7;
}

:deep(.tok-number) {
  color: #fab387;
}
</style>
