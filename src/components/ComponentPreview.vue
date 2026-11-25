<template>
  <section class="component-preview mfs-surface mfs-rounded-lg mfs-shadow">
    <header class="mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-3 mfs-py-5 mfs-px-6 mfs-surface-subtle mfs-border-none mfs-border-b">
      <div class="preview-heading mfs-min-w-0">
        <h3 class="mfs-text-base mfs-font-bold mfs-text mfs-m-0">{{ title }}</h3>
        <p v-if="description" class="preview-desc mfs-text-muted mfs-mt-1">{{ description }}</p>
      </div>

      <div class="mfs-flex mfs-items-center mfs-gap-2">
        <SelectButton
          v-model="tab"
          :options="previewModeOptions"
          aria-label="Preview mode"
        />

        <Button
          size="sm"
          variant="surface"
          class="copy-btn"
          :class="{ 'is-copied': copied }"
          :aria-label="copied ? 'Code copied' : 'Copy code'"
          @click="handleCopy"
        >
          <template #prepend>
            <Check v-if="copied" :size="14" />
            <Copy v-else :size="14" />
          </template>
          <span>{{ copied ? 'Copied' : 'Copy' }}</span>
        </Button>
      </div>
    </header>

    <div v-show="tab === 'preview'" class="preview-stage mfs-surface mfs-border-none">
      <slot />
    </div>

    <div v-if="tab === 'code'" class="preview-code mfs-border-none mfs-border-t">
      <CodeEditor
        readonly
        :model-value="code ?? ''"
        :tabs="codeTabs as CodeEditorTab[]"
        :filename="resolvedFilename"
        :max-height="'460px'"
        @tab-change="onCodeTabChange"
      />
    </div>

    <div v-if="hasApi && docContext?.activeTab.value !== 'features'" class="api-section mfs-py-5 mfs-px-6 mfs-flex mfs-flex-col mfs-gap-4 mfs-surface-subtle mfs-border-none mfs-border-t">
      <div class="mfs-flex mfs-items-center mfs-justify-between mfs-flex-wrap mfs-gap-2">
        <span class="api-heading mfs-font-bold mfs-text-muted">API Reference</span>
        <SelectButton
          v-model="activeApiTab"
          :options="apiTabOptions"
          aria-label="API reference sections"
        />
      </div>

      <div v-if="currentApiSection" class="mfs-rounded-sm mfs-surface mfs-overflow-x-auto">
        <table class="api-table mfs-w-full mfs-text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th v-if="currentApiSection.showType">Type</th>
              <th v-if="currentApiSection.showDefault">Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in currentApiSection.rows" :key="row.name">
              <td><code class="api-code mfs-font-mono mfs-text-primary mfs-font-semibold">{{ row.name }}</code></td>
              <td v-if="currentApiSection.showType">
                <code v-if="row.type" class="api-code mfs-font-mono mfs-text-muted">{{ row.type }}</code>
                <span v-else class="mfs-text-muted">—</span>
              </td>
              <td v-if="currentApiSection.showDefault">
                <code v-if="row.default" class="api-code mfs-font-mono mfs-text-muted">{{ row.default }}</code>
                <span v-else class="mfs-text-muted">—</span>
              </td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { Button, CodeEditor, SelectButton, type CodeEditorLanguage, type CodeEditorTab } from '../lib'
import type { ApiRow } from '../data/componentDocs'

export type CodeTab = Omit<CodeEditorTab, 'language'> & {
  language?: CodeEditorLanguage | (string & {})
}

export interface ComponentApiSpec {
  props?: ApiRow[]
  events?: ApiRow[]
  slots?: ApiRow[]
}

export interface DocsContext {
  activeTab: Ref<'features' | 'api' | 'theming'>
  registerApi: (api: ComponentApiSpec) => void
}

const props = defineProps<{
  title: string
  description?: string
  code?: string
  codeTabs?: CodeTab[]
  api?: ComponentApiSpec
}>()

const docContext = inject<DocsContext | null>('docContext', null)

watch(
  () => props.api,
  (api) => {
    if (api && docContext) {
      docContext.registerApi(api)
    }
  },
  { immediate: true }
)

const previewModeOptions = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' }
]
const tab = ref<'preview' | 'code'>('preview')
const activeCodeTabIndex = ref(0)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const resolvedFilename = computed(() => `${props.title.replace(/[^a-zA-Z0-9_-]/g, '') || 'Example'}.vue`)

const onCodeTabChange = (payload: { index: number; tab: CodeEditorTab }) => {
  activeCodeTabIndex.value = payload.index
}

watch(
  () => props.codeTabs,
  () => {
    activeCodeTabIndex.value = 0
  }
)

const handleCopy = async () => {
  try {
    const textToCopy =
      props.codeTabs?.[activeCodeTabIndex.value]?.code ??
      props.codeTabs?.[0]?.code ??
      props.code ??
      ''
    await navigator.clipboard.writeText(textToCopy)
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

type ApiTabKey = 'props' | 'events' | 'slots'

const apiSections = computed(() => {
  const sections: Array<{
    key: ApiTabKey
    label: string
    rows: ApiRow[]
    showType: boolean
    showDefault: boolean
  }> = []
  if (props.api?.props?.length) {
    sections.push({ key: 'props', label: 'Props', rows: props.api.props, showType: true, showDefault: true })
  }
  if (props.api?.events?.length) {
    sections.push({ key: 'events', label: 'Events', rows: props.api.events, showType: true, showDefault: false })
  }
  if (props.api?.slots?.length) {
    sections.push({ key: 'slots', label: 'Slots', rows: props.api.slots, showType: false, showDefault: false })
  }
  return sections
})

const hasApi = computed(() => apiSections.value.length > 0)
const activeApiTab = ref<ApiTabKey>('props')
const apiTabOptions = computed(() =>
  apiSections.value.map((section) => ({
    label: `${section.label} (${section.rows.length})`,
    value: section.key
  }))
)

watch(
  apiSections,
  (sections) => {
    if (sections.length > 0 && !sections.some((s) => s.key === activeApiTab.value)) {
      activeApiTab.value = sections[0].key
    }
  },
  { immediate: true }
)

const currentApiSection = computed(
  () => apiSections.value.find((s) => s.key === activeApiTab.value) ?? apiSections.value[0]
)
</script>

<style scoped>
.preview-heading {
  flex: 1 1 220px;
}

.preview-desc {
  font-size: 0.84rem;
}

.preview-tabs {
  padding: 3px;
  gap: 2px;
}

.preview-tab-btn {
  font-size: 0.78rem;
  padding: 5px 12px;
  color: var(--text-muted);
  background: transparent;
  border-radius: calc(var(--radius-sm, 8px) - 2px);
}

.preview-tab-btn:hover {
  color: var(--text);
}

.preview-tab-btn.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
}

.copy-btn {
  padding: 6px 12px;
  font-size: 0.78rem;
}

.copy-btn:hover,
.copy-btn.is-copied {
  border-color: var(--primary);
  color: var(--primary);
}

.preview-stage {
  padding: 28px 32px;
  background: var(--surface);
  box-shadow: inset 0 1px 0 var(--border);
}

@media (max-width: 768px) {
  .preview-stage {
    padding: 20px;
  }
}

.preview-code {
  overflow: hidden;
  padding: 16px;
  background: var(--surface-subtle);
}

.api-heading {
  font-size: 0.78rem;
}

.api-table {
  border-collapse: collapse;
  font-size: 0.84rem;
  line-height: 1.5;
}

.api-table th,
.api-table td {
  padding: 12px 16px;
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

.api-code {
  font-size: 0.78rem;
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
