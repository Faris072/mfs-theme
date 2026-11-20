<template>
  <section class="component-preview">
    <header class="preview-header">
      <div class="preview-heading">
        <h3 class="preview-title">{{ title }}</h3>
        <p v-if="description" class="preview-desc">{{ description }}</p>
      </div>

      <div class="preview-controls">
        <div class="preview-tabs" role="tablist" aria-label="Preview mode">
          <button
            type="button"
            role="tab"
            class="preview-tab-btn"
            :class="{ 'is-active': tab === 'preview' }"
            :aria-selected="tab === 'preview'"
            @click="tab = 'preview'"
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            class="preview-tab-btn"
            :class="{ 'is-active': tab === 'code' }"
            :aria-selected="tab === 'code'"
            @click="tab = 'code'"
          >
            Code
          </button>
        </div>

        <button
          type="button"
          class="copy-btn"
          :class="{ 'is-copied': copied }"
          :aria-label="copied ? 'Code copied' : 'Copy code'"
          @click="handleCopy"
        >
          <Check v-if="copied" :size="14" />
          <Copy v-else :size="14" />
          <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>
      </div>
    </header>

    <div v-show="tab === 'preview'" class="preview-stage">
      <slot />
    </div>

    <div v-if="tab === 'code'" class="preview-code">
      <pre><code>{{ code }}</code></pre>
    </div>

    <div v-if="hasApi" class="preview-api">
      <div v-for="section in apiSections" :key="section.label" class="api-section">
        <h4 class="api-heading">{{ section.label }}</h4>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead>
              <tr>
                <th>Name</th>
                <th v-if="section.showType">Type</th>
                <th v-if="section.showDefault">Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in section.rows" :key="row.name">
                <td><code class="api-name">{{ row.name }}</code></td>
                <td v-if="section.showType">
                  <code v-if="row.type" class="api-type">{{ row.type }}</code>
                  <span v-else class="api-empty">—</span>
                </td>
                <td v-if="section.showDefault">
                  <code v-if="row.default" class="api-default">{{ row.default }}</code>
                  <span v-else class="api-empty">—</span>
                </td>
                <td>{{ row.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import type { ApiRow } from '../data/componentDocs'

const props = defineProps<{
  title: string
  description?: string
  code: string
  api?: {
    props?: ApiRow[]
    events?: ApiRow[]
    slots?: ApiRow[]
  }
}>()

const tab = ref<'preview' | 'code'>('preview')
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
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

const apiSections = computed(() => {
  const sections: Array<{
    label: string
    rows: ApiRow[]
    showType: boolean
    showDefault: boolean
  }> = []
  if (props.api?.props?.length) {
    sections.push({ label: 'Props', rows: props.api.props, showType: true, showDefault: true })
  }
  if (props.api?.events?.length) {
    sections.push({ label: 'Events', rows: props.api.events, showType: true, showDefault: false })
  }
  if (props.api?.slots?.length) {
    sections.push({ label: 'Slots', rows: props.api.slots, showType: false, showDefault: false })
  }
  return sections
})

const hasApi = computed(() => apiSections.value.length > 0)
</script>

<style scoped>
.component-preview {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg, 18px);
  overflow: hidden;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.preview-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-subtle);
}

.preview-heading {
  min-width: 0;
  flex: 1 1 220px;
}

.preview-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.preview-desc {
  font-size: 0.84rem;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-tabs {
  display: inline-flex;
  padding: 3px;
  border-radius: var(--radius-sm, 8px);
  background: var(--surface);
  border: 1px solid var(--border);
  gap: 2px;
}

.preview-tab-btn {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: calc(var(--radius-sm, 8px) - 2px);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.preview-tab-btn:hover {
  color: var(--text);
}

.preview-tab-btn.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.copy-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.copy-btn.is-copied {
  border-color: var(--primary);
  color: var(--primary);
}

.preview-stage {
  padding: 24px 20px;
  background: var(--surface);
}

.preview-code {
  background: var(--surface-subtle);
  border-top: 1px solid var(--border);
  overflow-x: auto;
  max-height: 420px;
}

.preview-code pre {
  margin: 0;
  padding: 18px 20px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text);
  tab-size: 2;
}

.preview-api {
  border-top: 1px solid var(--border);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--surface-subtle);
}

.api-heading {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0 0 8px;
}

.api-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm, 8px);
  background: var(--surface);
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}

.api-table th,
.api-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
  color: var(--text);
}

.api-table th {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--surface-subtle);
}

.api-table tbody tr:last-child td {
  border-bottom: none;
}

.api-name,
.api-type,
.api-default {
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.api-name {
  color: var(--primary);
  font-weight: 600;
}

.api-type,
.api-default {
  color: var(--text-muted);
}

.api-empty {
  color: var(--text-muted);
}

/* Theme overrides */
:global([data-theme='clay']) .component-preview {
  box-shadow: var(--clay-shadow);
}

:global([data-theme='glass']) .component-preview {
  backdrop-filter: var(--backdrop-blur, blur(14px));
}

:global([data-theme='neo']) .component-preview {
  box-shadow: var(--clay-shadow);
}

:global([data-theme='neo']) .preview-tabs,
:global([data-theme='neo']) .copy-btn {
  box-shadow: var(--input-shadow);
}
</style>
