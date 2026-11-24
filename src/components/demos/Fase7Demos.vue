<template>
  <div class="mfs-stack mfs-w-full">
    <!-- AUTO COMPLETE -->
    <template v-if="activeSlug === 'auto-complete'">
      <ComponentPreview
        title="Basic & Loading State"
        description="Type to filter suggestions with keyboard navigation and loading indicator."
        :code="autoCompleteCode"
        :code-tabs="autoCompleteCodeTabs"
        :api="autoCompleteApi"
      >
        <div class="mfs-grid mfs-w-full">
          <AutoComplete
            v-model="acFramework"
            label="Framework"
            placeholder="Search e.g. Vue..."
            :suggestions="acSuggestions"
            @select="(item) => (acSelected = item.label)"
          />
          <AutoComplete
            v-model="acLoadingVal"
            label="Async Search (Loading)"
            placeholder="Fetching results..."
            :suggestions="acSuggestions"
            loading
          />
        </div>
        <p class="mfs-caption mfs-mt-3 mfs-mb-0">
          Selected: <strong>{{ acSelected || 'None' }}</strong>
        </p>
      </ComponentPreview>
    </template>

    <!-- CASCADER -->
    <template v-else-if="activeSlug === 'cascader'">
      <ComponentPreview
        title="Hierarchical Cascader"
        description="Multi-column cascading menu for nested location or category paths."
        :code="cascaderCode"
        :code-tabs="cascaderCodeTabs"
        :api="cascaderApi"
      >
        <div class="mfs-grid mfs-w-full">
          <Cascader
            v-model="cascaderVal"
            label="Region & City"
            placeholder="Choose location..."
            :options="cascaderOptions"
          />
          <Cascader
            v-model="cascaderDisabledVal"
            label="Disabled Cascader"
            :options="cascaderOptions"
            disabled
          />
        </div>
        <p class="mfs-caption mfs-mt-3 mfs-mb-0">
          Value: <code>{{ JSON.stringify(cascaderVal) }}</code>
        </p>
      </ComponentPreview>
    </template>

    <!-- TREE SELECT -->
    <template v-else-if="activeSlug === 'tree-select'">
      <ComponentPreview
        title="Single & Multiple TreeSelect"
        description="Expandable hierarchical tree dropdown supporting single or multi-select."
        :code="treeSelectCode"
        :code-tabs="treeSelectCodeTabs"
        :api="treeSelectApi"
      >
        <div class="mfs-grid mfs-w-full">
          <TreeSelect
            v-model="treeSingle"
            label="Single Node"
            placeholder="Select a folder or file..."
            :options="treeOptions"
          />
          <TreeSelect
            v-model="treeMulti"
            label="Multiple Nodes"
            placeholder="Select multiple..."
            :options="treeOptions"
            multiple
          />
        </div>
      </ComponentPreview>
    </template>

    <!-- KNOB -->
    <template v-else-if="activeSlug === 'knob'">
      <ComponentPreview
        title="Interactive Circular Knob"
        description="Pointer-drag and arrow-key accessible radial dial with custom templates."
        :code="knobCode"
        :api="knobApi"
      >
        <div class="mfs-row mfs-gap-6">
          <Knob v-model="knobVolume" label="Volume" value-template="{value}%" />
          <Knob
            v-model="knobTemp"
            label="Target Temp"
            :min="16"
            :max="30"
            :step="1"
            :size="120"
            :stroke-width="12"
            value-template="{value}°C"
          />
          <Knob :model-value="75" label="Readonly" value-template="{value}%" readonly />
        </div>
      </ComponentPreview>
    </template>

    <!-- SELECT BUTTON -->
    <template v-else-if="activeSlug === 'select-button'">
      <ComponentPreview
        title="Single & Multiple SelectButton"
        description="Segmented button group for mutually exclusive or multi-toggle choices."
        :code="selectButtonCode"
        :api="selectButtonApi"
      >
        <div class="mfs-stack mfs-w-full">
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">View Mode (Single)</span>
            <SelectButton v-model="sbView" :options="['List', 'Grid', 'Board']" />
          </div>
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">Text Style (Multiple)</span>
            <SelectButton
              v-model="sbStyles"
              multiple
              :options="[
                { label: 'Bold', value: 'bold' },
                { label: 'Italic', value: 'italic' },
                { label: 'Underline', value: 'underline' }
              ]"
            />
          </div>
        </div>
      </ComponentPreview>
    </template>

    <!-- TOGGLE BUTTON -->
    <template v-else-if="activeSlug === 'toggle-button'">
      <ComponentPreview
        title="ToggleButton"
        description="Stateful pressable button with on/off labels or custom slot content."
        :code="toggleButtonCode"
        :api="toggleButtonApi"
      >
        <div class="mfs-row">
          <ToggleButton v-model="tbDark" on-label="Notifications On" off-label="Notifications Off" />
          <ToggleButton v-model="tbPin">
            <span>{{ tbPin ? 'Pinned ★' : 'Pin Item ☆' }}</span>
          </ToggleButton>
          <ToggleButton :model-value="false" off-label="Disabled" disabled />
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT OTP -->
    <template v-else-if="activeSlug === 'input-otp'">
      <ComponentPreview
        title="One-Time Password (OTP)"
        description="Auto-advancing verification code cells with paste support and optional masking."
        :code="inputOtpCode"
        :api="inputOtpApi"
      >
        <div class="mfs-stack mfs-w-full">
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">4-Digit Code</span>
            <InputOtp v-model="otpCode" :length="4" @complete="(v) => (otpCompleted = v)" />
            <span class="mfs-caption mfs-m-0">
              Value: <code>{{ otpCode || '—' }}</code>
              <template v-if="otpCompleted"> · Completed: <strong>{{ otpCompleted }}</strong></template>
            </span>
          </div>
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">6-Digit Masked PIN</span>
            <InputOtp v-model="otpPin" :length="6" mask />
          </div>
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT MASK -->
    <template v-else-if="activeSlug === 'input-mask'">
      <ComponentPreview
        title="Masked Inputs"
        description="Enforce structured formats using 9 (digit), a (letter), and * (alphanumeric) tokens."
        :code="inputMaskCode"
        :api="inputMaskApi"
      >
        <div class="mfs-grid mfs-w-full">
          <InputMask
            v-model="maskPhone"
            label="Phone Number"
            mask="(999) 999-9999"
            placeholder="(555) 123-4567"
          />
          <InputMask
            v-model="maskDate"
            label="Date (DD/MM/YYYY)"
            mask="99/99/9999"
            placeholder="20/11/2026"
          />
          <InputMask
            v-model="maskSerial"
            label="License Key"
            mask="aaaa-9999-****"
            placeholder="ABCD-1234-X9Z0"
          />
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT GROUP -->
    <template v-else-if="activeSlug === 'input-group'">
      <ComponentPreview
        title="InputGroup Addons"
        description="Combine static .ig-addon labels, inputs, and action buttons seamlessly."
        :code="inputGroupCode"
        :api="inputGroupApi"
      >
        <div class="mfs-stack mfs-w-full">
          <InputGroup>
            <span class="ig-addon">https://</span>
            <input v-model="igDomain" type="text" class="mfs-flex-1 mfs-px-3 mfs-py-2 mfs-text-base mfs-text demo-raw-input" placeholder="yourdomain.com" />
            <span class="ig-addon">.app</span>
          </InputGroup>

          <InputGroup>
            <span class="ig-addon">$</span>
            <input v-model="igAmount" type="text" class="mfs-flex-1 mfs-px-3 mfs-py-2 mfs-text-base mfs-text demo-raw-input" placeholder="0.00" />
            <Button size="sm">Pay</Button>
          </InputGroup>
        </div>
      </ComponentPreview>
    </template>

    <!-- LISTBOX -->
    <template v-else-if="activeSlug === 'listbox'">
      <ComponentPreview
        title="Filterable & Multi-Select Listbox"
        description="Keyboard-accessible scrollable list with optional search filter."
        :code="listboxCode"
        :api="listboxApi"
      >
        <div class="mfs-grid mfs-w-full">
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">Single with Filter</span>
            <Listbox v-model="lbCity" :options="lbCities" filter />
          </div>
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">Multiple Selection</span>
            <Listbox v-model="lbTags" :options="lbTagOptions" multiple />
          </div>
        </div>
      </ComponentPreview>
    </template>

    <!-- FLOAT LABEL -->
    <template v-else-if="activeSlug === 'float-label'">
      <ComponentPreview
        title="Floating Label"
        description="Label rests inside the input and floats smoothly on focus or when filled."
        :code="floatLabelCode"
        :api="floatLabelApi"
      >
        <div class="mfs-grid mfs-w-full">
          <FloatLabel label="Username" for-id="fl-user" :active="!!flUser">
            <input id="fl-user" v-model="flUser" type="text" placeholder=" " class="mfs-w-full mfs-rounded mfs-surface mfs-px-3 mfs-py-3 mfs-text-base mfs-shadow-inset demo-fl-input" />
          </FloatLabel>
          <FloatLabel label="Email Address" for-id="fl-email" :active="!!flEmail">
            <input id="fl-email" v-model="flEmail" type="email" placeholder=" " class="mfs-w-full mfs-rounded mfs-surface mfs-px-3 mfs-py-3 mfs-text-base mfs-shadow-inset demo-fl-input" />
          </FloatLabel>
        </div>
      </ComponentPreview>
    </template>

    <!-- IFTA LABEL -->
    <template v-else-if="activeSlug === 'ifta-label'">
      <ComponentPreview
        title="Infield Top-Aligned (Ifta) Label"
        description="Compact container with a persistent top-aligned label inside the input surface."
        :code="iftaLabelCode"
        :api="iftaLabelApi"
      >
        <div class="mfs-grid mfs-w-full">
          <IftaLabel label="Project Name" for-id="ifta-project">
            <input id="ifta-project" v-model="iftaProject" type="text" placeholder="mfs-theme" />
          </IftaLabel>
          <IftaLabel label="Environment" for-id="ifta-env">
            <select id="ifta-env" v-model="iftaEnv">
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </IftaLabel>
        </div>
      </ComponentPreview>
    </template>

    <!-- EDITOR -->
    <template v-else-if="activeSlug === 'editor'">
      <ComponentPreview
        title="Rich Text Editor"
        description="Contenteditable rich text editor with formatting toolbar and v-model HTML sync."
        :code="editorCode"
        :api="editorApi"
      >
        <div class="mfs-stack mfs-w-full">
          <Editor v-model="editorHtml" placeholder="Write release notes..." min-height="130px" />
          <p class="mfs-caption mfs-m-0">
            HTML Output: <code>{{ editorHtml }}</code>
          </p>
        </div>
      </ComponentPreview>
    </template>

    <!-- CODE EDITOR -->
    <template v-else-if="activeSlug === 'code-editor'">
      <ComponentPreview
        title="Multi-Tab & Readonly CodeEditor"
        description="XSS-safe VSCode-style code editor supporting multi-file tabs (v-model:tabs + v-model:activeTab), single-file v-model, readonly mode, Tab indentation, and copy action."
        :code="codeEditorCode"
        :code-tabs="codeEditorCodeTabs"
        :api="codeEditorApi"
      >
        <div class="mfs-stack mfs-w-full">
          <CodeEditor
            v-model:tabs="codeEditorTabs"
            v-model:active-tab="codeEditorActiveTab"
            min-height="200px"
          />
          <CodeEditor
            v-model="codeEditorSource"
            language="vue"
            filename="XssSafeDemo.vue"
            min-height="170px"
          />
          <CodeEditor
            :model-value="codeEditorReadonlySource"
            language="ts"
            filename="readonly-config.ts"
            readonly
            min-height="130px"
          />
        </div>
      </ComponentPreview>
    </template>

    <!-- ICON FIELD -->
    <template v-else-if="activeSlug === 'icon-field'">
      <ComponentPreview
        title="Left & Right Icon Positions"
        description="Wrap any input with a leading or trailing icon using iconPosition and fluid props."
        :code="iconFieldCode"
        :api="iconFieldApi"
      >
        <div class="mfs-grid mfs-w-full">
          <IconField icon-position="left" fluid>
            <template #icon><Search :size="16" /></template>
            <input v-model="iconFieldSearch" type="text" placeholder="Search components..." class="mfs-w-full mfs-rounded mfs-surface mfs-px-3 mfs-py-3 mfs-text-base mfs-shadow-inset demo-fl-input" />
          </IconField>
          <IconField icon-position="right" fluid>
            <template #icon><Mail :size="16" /></template>
            <input v-model="iconFieldEmail" type="email" placeholder="you@example.com" class="mfs-w-full mfs-rounded mfs-surface mfs-px-3 mfs-py-3 mfs-text-base mfs-shadow-inset demo-fl-input" />
          </IconField>
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT ICON -->
    <template v-else-if="activeSlug === 'input-icon'">
      <ComponentPreview
        title="InputIcon Wrapper"
        description="Semantic inline icon slot wrapper with muted contrast and aria-hidden for input fields."
        :code="inputIconCode"
        :api="inputIconApi"
      >
        <div class="mfs-grid mfs-w-full">
          <Input v-model="iconQuery" label="Search with InputIcon" placeholder="Search...">
            <template #prepend>
              <InputIcon><Search :size="16" /></InputIcon>
            </template>
          </Input>
          <Input v-model="iconEmail" label="Email with InputIcon" placeholder="you@domain.com">
            <template #prepend>
              <InputIcon><Mail :size="16" /></InputIcon>
            </template>
          </Input>
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT GROUP ADDON -->
    <template v-else-if="activeSlug === 'input-group-addon'">
      <ComponentPreview
        title="InputGroupAddon"
        description="Prefix and suffix text/unit addons paired inside InputGroup."
        :code="inputGroupAddonCode"
        :api="inputGroupAddonApi"
      >
        <div class="mfs-stack mfs-w-full">
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <Input v-model="addonDomain" placeholder="example" />
            <InputGroupAddon>.com</InputGroupAddon>
          </InputGroup>
          <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
            Preview URL: <code class="mfs-font-mono mfs-text-primary">https://{{ addonDomain || 'example' }}.com</code>
          </p>
        </div>
      </ComponentPreview>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Search } from 'lucide-vue-next'
import ComponentPreview from '../ComponentPreview.vue'
import type { CodeTab } from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import { Button, Input, InputGroupAddon, InputIcon } from '../../lib'
import AutoComplete from '../../lib/components/AutoComplete.vue'
import Cascader, { type CascaderOption } from '../../lib/components/Cascader.vue'
import TreeSelect, { type TreeSelectNode } from '../../lib/components/TreeSelect.vue'
import Knob from '../../lib/components/Knob.vue'
import SelectButton from '../../lib/components/SelectButton.vue'
import ToggleButton from '../../lib/components/ToggleButton.vue'
import InputOtp from '../../lib/components/InputOtp.vue'
import InputMask from '../../lib/components/InputMask.vue'
import InputGroup from '../../lib/components/InputGroup.vue'
import Listbox from '../../lib/components/Listbox.vue'
import FloatLabel from '../../lib/components/FloatLabel.vue'
import IftaLabel from '../../lib/components/IftaLabel.vue'
import Editor from '../../lib/components/Editor.vue'
import CodeEditor, { type CodeEditorTab } from '../../lib/components/CodeEditor.vue'
import IconField from '../../lib/components/IconField.vue'

defineProps<{ activeSlug: string }>()

// AutoComplete
const acFramework = ref('')
const acLoadingVal = ref('')
const acSelected = ref('')
const acSuggestions = ['Vue 3', 'Vite', 'TypeScript', 'Pinia', 'Vue Router', 'Nuxt', 'Vitest']

// Cascader
const cascaderVal = ref<string[]>(['id', 'jkt'])
const cascaderDisabledVal = ref<string[]>([])
const cascaderOptions: CascaderOption[] = [
  {
    label: 'Indonesia',
    value: 'id',
    children: [
      { label: 'Jakarta', value: 'jkt' },
      { label: 'Bandung', value: 'bdg' },
      { label: 'Surabaya', value: 'sby' }
    ]
  },
  {
    label: 'Japan',
    value: 'jp',
    children: [
      { label: 'Tokyo', value: 'tyo' },
      { label: 'Osaka', value: 'osa' }
    ]
  }
]

// TreeSelect
const treeSingle = ref<string | null>('tokens')
const treeMulti = ref<string[]>(['clay', 'glass'])
const treeOptions: TreeSelectNode[] = [
  {
    label: 'Themes',
    value: 'themes',
    children: [
      { label: 'Claymorphism', value: 'clay' },
      { label: 'Glassmorphism', value: 'glass' },
      { label: 'Neumorphism', value: 'neo' }
    ]
  },
  {
    label: 'Design Tokens',
    value: 'tokens',
    children: [
      { label: 'Colors', value: 'colors' },
      { label: 'Shadows', value: 'shadows' }
    ]
  }
]

// Knob
const knobVolume = ref(65)
const knobTemp = ref(22)

// SelectButton
const sbView = ref('Grid')
const sbStyles = ref<string[]>(['bold'])

// ToggleButton
const tbDark = ref(true)
const tbPin = ref(false)

// InputOtp
const otpCode = ref('42')
const otpCompleted = ref('')
const otpPin = ref('')

// InputMask
const maskPhone = ref('')
const maskDate = ref('')
const maskSerial = ref('')

// InputGroup / InputIcon / InputGroupAddon
const igDomain = ref('mfs-theme')
const igAmount = ref('49.00')
const iconQuery = ref('')
const iconEmail = ref('')
const addonDomain = ref('mfs-theme')

// Listbox
const lbCity = ref('Tokyo')
const lbCities = ['Jakarta', 'Tokyo', 'Singapore', 'Seoul', 'Berlin', 'London']
const lbTags = ref<string[]>(['vue'])
const lbTagOptions = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'CSS Variables', value: 'css' },
  { label: 'Legacy (Disabled)', value: 'legacy', disabled: true }
]

// FloatLabel
const flUser = ref('')
const flEmail = ref('hello@mfs.dev')

// IftaLabel
const iftaProject = ref('mfs-theme')
const iftaEnv = ref('production')

// Editor
const editorHtml = ref('<p><strong>MFS Theme</strong> supports Clay, Glass, and Neo.</p>')

// CodeEditor
const codeEditorActiveTab = ref(0)
const codeEditorTabs = ref<CodeEditorTab[]>([
  {
    label: 'App.vue',
    filename: 'App.vue',
    language: 'vue',
    code: `<template>
  <main class="mfs-stack">
    <h2>{{ title }}</h2>
    <p>{{ greeting }}</p>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { initialGreeting } from './data'

const title = ref('MFS Multi-Tab Editor')
const greeting = ref(initialGreeting)
<\/script>`
  },
  {
    label: 'data.ts',
    filename: 'data.ts',
    language: 'ts',
    code: `export const initialGreeting = 'Switch tabs and edit any file live!'

export interface EditorStats {
  files: number
  xssSafe: boolean
}`
  },
  {
    label: 'api.ts',
    filename: 'api.ts',
    language: 'ts',
    readonly: true,
    code: `// Readonly tab example
export async function fetchSnippet(id: string): Promise<string> {
  return \`// Loaded snippet: \${id}\`
}`
  }
])

const codeEditorSource = ref(`<template>
  <!-- Harmless XSS test payload: rendered safely via Vue text interpolation -->
  <div class="card" data-test="<img src=x onerror=alert('xss')>">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
const message = '<script>alert("never-executed")<\\/script>'
<\/script>`)

const codeEditorReadonlySource = `export interface ThemeConfig {
  name: 'clay' | 'glass' | 'neo'
  tabSize: number
  safeMode: boolean
}

export const defaultConfig: ThemeConfig = {
  name: 'clay',
  tabSize: 2,
  safeMode: true
}`

// Code Snippets
const autoCompleteCode = `<template>
  <AutoComplete
    v-model="framework"
    label="Framework"
    :suggestions="suggestions"
    :loading="loading"
    @complete="onComplete"
    @select="(item) => (selected = item.label)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AutoComplete, type AutoCompleteItem } from '@mfs-atomic/ui'
import { defaultSuggestions } from './data'
import { searchSuggestions } from './fetchApi'

const framework = ref('')
const selected = ref('')
const loading = ref(false)
const suggestions = ref<AutoCompleteItem[]>(defaultSuggestions)

const onComplete = async ({ query }: { query: string }) => {
  loading.value = true
  try {
    suggestions.value = await searchSuggestions(query)
  } finally {
    loading.value = false
  }
}
<\/script>`

const autoCompleteCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: autoCompleteCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { AutoCompleteItem } from '@mfs-atomic/ui'

export const defaultSuggestions: AutoCompleteItem[] = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'Vite', value: 'vite' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Pinia', value: 'pinia' }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { AutoCompleteItem } from '@mfs-atomic/ui'

export async function searchSuggestions(query: string): Promise<AutoCompleteItem[]> {
  const params = new URLSearchParams({ q: query })
  const res = await fetch(\`/api/frameworks/search?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

const cascaderCode = `<template>
  <Cascader v-model="location" label="Region & City" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Cascader } from '@mfs-atomic/ui'
import { options } from './data'

const location = ref<string[]>(['id', 'jkt'])
<\/script>`

const cascaderCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: cascaderCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { CascaderOption } from '@mfs-atomic/ui'

export const options: CascaderOption[] = [
  {
    label: 'Indonesia',
    value: 'id',
    children: [
      { label: 'Jakarta', value: 'jkt' },
      { label: 'Bandung', value: 'bdg' },
      { label: 'Surabaya', value: 'sby' }
    ]
  },
  {
    label: 'Japan',
    value: 'jp',
    children: [
      { label: 'Tokyo', value: 'tyo' },
      { label: 'Osaka', value: 'osa' }
    ]
  }
]`
  }
]

const treeSelectCode = `<template>
  <TreeSelect v-model="single" label="Single Node" :options="options" />
  <TreeSelect v-model="multi" label="Multiple Nodes" :options="options" multiple />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TreeSelect } from '@mfs-atomic/ui'
import { options } from './data'

const single = ref<string | null>('tokens')
const multi = ref<string[]>(['clay', 'glass'])
<\/script>`

const treeSelectCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: treeSelectCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { TreeSelectNode } from '@mfs-atomic/ui'

export const options: TreeSelectNode[] = [
  {
    label: 'Themes',
    value: 'themes',
    children: [
      { label: 'Claymorphism', value: 'clay' },
      { label: 'Glassmorphism', value: 'glass' },
      { label: 'Neumorphism', value: 'neo' }
    ]
  },
  {
    label: 'Design Tokens',
    value: 'tokens',
    children: [
      { label: 'Colors', value: 'colors' },
      { label: 'Shadows', value: 'shadows' }
    ]
  }
]`
  }
]

const knobCode = `<template>
  <Knob v-model="volume" label="Volume" value-template="{value}%" />
  <Knob v-model="temp" label="Target Temp" :min="16" :max="30" value-template="{value}°C" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Knob } from '@mfs-atomic/ui'

const volume = ref(65)
const temp = ref(22)
<\/script>`

const selectButtonCode = `<template>
  <SelectButton v-model="view" :options="['List', 'Grid', 'Board']" />
  <SelectButton v-model="styles" multiple :options="['bold', 'italic', 'underline']" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SelectButton } from '@mfs-atomic/ui'

const view = ref('Grid')
const styles = ref(['bold'])
<\/script>`

const toggleButtonCode = `<template>
  <ToggleButton v-model="enabled" on-label="Notifications On" off-label="Notifications Off" />
  <ToggleButton v-model="pinned">
    {{ pinned ? 'Pinned ★' : 'Pin Item ☆' }}
  </ToggleButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ToggleButton } from '@mfs-atomic/ui'

const enabled = ref(true)
const pinned = ref(false)
<\/script>`

const inputOtpCode = `<template>
  <InputOtp v-model="code" :length="4" @complete="onComplete" />
  <InputOtp v-model="pin" :length="6" mask />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InputOtp } from '@mfs-atomic/ui'

const code = ref('')
const pin = ref('')
const onComplete = (val: string) => console.log('OTP:', val)
<\/script>`

const inputMaskCode = `<template>
  <InputMask v-model="phone" label="Phone Number" mask="(999) 999-9999" />
  <InputMask v-model="date" label="Date" mask="99/99/9999" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InputMask } from '@mfs-atomic/ui'

const phone = ref('')
const date = ref('')
<\/script>`

const inputGroupCode = `<template>
  <InputGroup>
    <span class="ig-addon">https://</span>
    <input v-model="domain" type="text" placeholder="yourdomain.com" />
    <span class="ig-addon">.app</span>
  </InputGroup>

  <InputGroup>
    <span class="ig-addon">$</span>
    <input v-model="amount" type="text" placeholder="0.00" />
    <Button size="sm">Pay</Button>
  </InputGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, InputGroup } from '@mfs-atomic/ui'

const domain = ref('mfs-theme')
const amount = ref('49.00')
<\/script>`

const listboxCode = `<template>
  <Listbox v-model="city" :options="cities" filter />
  <Listbox v-model="tags" :options="tagOptions" multiple />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Listbox } from '@mfs-atomic/ui'

const city = ref('Tokyo')
const cities = ['Jakarta', 'Tokyo', 'Singapore', 'Seoul']
const tags = ref(['vue'])
const tagOptions = [{ label: 'Vue 3', value: 'vue' }, { label: 'TypeScript', value: 'ts' }]
<\/script>`

const floatLabelCode = `<template>
  <FloatLabel label="Username" for-id="fl-user" :active="!!username">
    <input id="fl-user" v-model="username" type="text" placeholder=" " />
  </FloatLabel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FloatLabel } from '@mfs-atomic/ui'

const username = ref('')
<\/script>`

const iftaLabelCode = `<template>
  <IftaLabel label="Project Name" for-id="ifta-project">
    <input id="ifta-project" v-model="project" type="text" placeholder="mfs-theme" />
  </IftaLabel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IftaLabel } from '@mfs-atomic/ui'

const project = ref('mfs-theme')
<\/script>`

const editorCode = `<template>
  <Editor v-model="html" placeholder="Write release notes..." min-height="130px" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@mfs-atomic/ui'

const html = ref('<p><strong>MFS Theme</strong> supports Clay, Glass, and Neo.</p>')
<\/script>`

const codeEditorCode = `<template>
  <CodeEditor
    v-model:tabs="tabs"
    v-model:active-tab="activeTab"
    min-height="200px"
  />
  <CodeEditor
    v-model="source"
    language="vue"
    filename="Example.vue"
    min-height="170px"
  />
  <CodeEditor
    :model-value="readonlySnippet"
    language="ts"
    filename="config.ts"
    readonly
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from '@mfs-atomic/ui'
import { initialTabs } from './data'
import { fetchSnippet } from './api'

const activeTab = ref(0)
const tabs = ref(initialTabs)
const source = ref('<template>\\n  <div>Hello MFS UI</div>\\n</template>')
const readonlySnippet = ref('export const tabSize = 2')
void fetchSnippet
<\/script>`

const codeEditorCodeTabs: CodeTab[] = [
  { label: 'App.vue', code: codeEditorCode },
  {
    label: 'data.ts',
    code: `import type { CodeEditorTab } from '@mfs-atomic/ui'

export const initialTabs: CodeEditorTab[] = [
  {
    label: 'App.vue',
    filename: 'App.vue',
    language: 'vue',
    code: '<template>\\n  <div>Multi-tab demo</div>\\n</template>'
  },
  {
    label: 'data.ts',
    filename: 'data.ts',
    language: 'ts',
    code: "export const greeting = 'Hello MFS UI'"
  },
  {
    label: 'api.ts',
    filename: 'api.ts',
    language: 'ts',
    readonly: true,
    code: '// Readonly tab\\nexport const version = 1'
  }
]`
  },
  {
    label: 'api.ts',
    code: `export async function fetchSnippet(id: string): Promise<string> {
  return \`// Loaded snippet: \${id}\`
}`
  }
]

// Verified API Tables
const autoCompleteApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Bound text query.' },
    { name: 'suggestions', type: 'Array<string | AutoCompleteItem>', default: '[]', description: 'List of suggestion items.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'placeholder', type: 'string', default: "'Type to search...'", description: 'Input placeholder.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables input and dropdown.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Displays loading spinner.' },
    { name: 'minLength', type: 'number', default: '1', description: 'Minimum characters before triggering complete.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'string', description: 'Emitted on input or selection.' },
    { name: 'complete', type: '{ query: string }', description: 'Emitted when query meets minLength.' },
    { name: 'select', type: 'AutoCompleteItem', description: 'Emitted when a suggestion is chosen.' }
  ]
}

const cascaderApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'any[]', default: '[]', description: 'Array of selected values along the path.' },
    { name: 'options', type: 'CascaderOption[]', default: '[]', description: 'Hierarchical option tree.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'placeholder', type: 'string', default: "'Select...'", description: 'Placeholder when empty.' },
    { name: 'separator', type: 'string', default: "' / '", description: 'Delimiter between selected labels.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables trigger and panel.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'any[]', description: 'Emitted when a leaf node is selected.' },
    { name: 'change', type: 'any[]', description: 'Emitted with the selected value path.' }
  ]
}

const treeSelectApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'any | any[]', default: 'null', description: 'Selected node value or array.' },
    { name: 'options', type: 'TreeSelectNode[]', default: '[]', description: 'Tree node hierarchy.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows selecting multiple nodes.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'placeholder', type: 'string', default: "'Select node...'", description: 'Placeholder when empty.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables tree selection.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'any', description: 'Emitted when selection changes.' },
    { name: 'change', type: 'any', description: 'Emitted with the updated selection.' }
  ]
}

const knobApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'number', default: '0', description: 'Current numeric value.' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value.' },
    { name: 'step', type: 'number', default: '1', description: 'Step increment for drag and keys.' },
    { name: 'size', type: 'number', default: '112', description: 'Diameter in pixels.' },
    { name: 'strokeWidth', type: 'number', default: '10', description: 'Arc stroke thickness.' },
    { name: 'valueTemplate', type: 'string', default: "'{value}'", description: 'Display format string.' },
    { name: 'label', type: 'string', description: 'Caption below the knob.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents value changes.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'number', description: 'Emitted continuously while dragging.' },
    { name: 'change', type: 'number', description: 'Emitted on drag end or key press.' }
  ]
}

const selectButtonApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'any | any[]', description: 'Selected value or array in multiple mode.' },
    { name: 'options', type: 'Array<string | SelectButtonOption>', default: '[]', description: 'Button options.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Enables multi-selection.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all buttons.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'any', description: 'Emitted on option toggle.' },
    { name: 'change', type: 'any', description: 'Emitted with updated value.' }
  ]
}

const toggleButtonApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Pressed state.' },
    { name: 'onLabel', type: 'string', default: "'On'", description: 'Label when active.' },
    { name: 'offLabel', type: 'string', default: "'Off'", description: 'Label when inactive.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables button.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'boolean', description: 'Emitted on click.' },
    { name: 'change', type: 'boolean', description: 'Emitted with new boolean state.' }
  ],
  slots: [{ name: 'default', description: 'Custom button content (overrides onLabel/offLabel).' }]
}

const inputOtpApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Combined OTP string.' },
    { name: 'length', type: 'number', default: '4', description: 'Number of character cells.' },
    { name: 'mask', type: 'boolean', default: 'false', description: 'Renders cells as password inputs.' },
    { name: 'integerOnly', type: 'boolean', default: 'true', description: 'Restricts input to digits.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all cells.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'string', description: 'Emitted as characters change.' },
    { name: 'complete', type: 'string', description: 'Emitted when all cells are filled.' }
  ]
}

const inputMaskApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Formatted value.' },
    { name: 'mask', type: 'string', description: 'Required pattern using 9 (digit), a (letter), * (alphanumeric).' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'placeholder', type: 'string', description: 'Placeholder (defaults to mask).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables input.' }
  ],
  events: [{ name: 'update:modelValue', type: 'string', description: 'Emitted with masked string.' }]
}

const inputGroupApi: { slots: ApiRow[] } = {
  slots: [{ name: 'default', description: 'Inputs, buttons, and .ig-addon elements grouped together.' }]
}

const listboxApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'any | any[]', description: 'Selected value or array.' },
    { name: 'options', type: 'Array<string | ListboxOption>', default: '[]', description: 'List items.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows multiple selections.' },
    { name: 'filter', type: 'boolean', default: 'false', description: 'Shows search input above list.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables list interaction.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'any', description: 'Emitted when an item is selected.' },
    { name: 'change', type: 'any', description: 'Emitted with the updated value.' }
  ]
}

const floatLabelApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'label', type: 'string', description: 'Floating label text.' },
    { name: 'forId', type: 'string', description: 'Matches the inner input id.' },
    { name: 'active', type: 'boolean', description: 'Forces label into the floated state.' }
  ],
  slots: [{ name: 'default', description: 'Input or textarea element.' }]
}

const iftaLabelApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'label', type: 'string', description: 'Infield top-aligned label text.' },
    { name: 'forId', type: 'string', description: 'Matches the inner control id.' }
  ],
  slots: [{ name: 'default', description: 'Input, textarea, or select element.' }]
}

const editorApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'HTML content string.' },
    { name: 'placeholder', type: 'string', default: "'Write something...'", description: 'Placeholder when empty.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Hides toolbar and locks editing.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables editing.' },
    { name: 'minHeight', type: 'string', default: "'140px'", description: 'Minimum height of editor area.' }
  ],
  events: [{ name: 'update:modelValue', type: 'string', description: 'Emitted with updated HTML.' }]
}

const codeEditorApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Bound source code string (single-file mode).' },
    { name: 'tabs', type: 'CodeEditorTab[]', description: 'Optional list of file tabs enabling multi-tab mode.' },
    { name: 'activeTab', type: 'number', default: '0', description: 'Active tab index when tabs are provided (supports v-model:activeTab).' },
    { name: 'language', type: 'CodeEditorLanguage', default: "'vue'", description: 'Syntax highlighting language.' },
    { name: 'filename', type: 'string', description: 'Optional filename shown in the header bar.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Renders as a readonly VSCode-style code viewer.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables editing and interaction.' },
    { name: 'lineNumbers', type: 'boolean', default: 'true', description: 'Toggles the line-number gutter.' },
    { name: 'copyable', type: 'boolean', default: 'true', description: 'Toggles the header Copy button.' },
    { name: 'placeholder', type: 'string', default: "'Write code here...'", description: 'Placeholder shown when empty.' },
    { name: 'minHeight', type: 'string', default: "'180px'", description: 'Minimum height of the editor body.' },
    { name: 'maxHeight', type: 'string', default: "'420px'", description: 'Maximum height before scrolling.' },
    { name: 'maxLength', type: 'number', description: 'Optional maximum character limit.' },
    { name: 'tabSize', type: 'number', default: '2', description: 'Spaces inserted on Tab key.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies invalid error border styling.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'string', description: 'Emitted when source code changes in single-file mode.' },
    { name: 'update:tabs', type: 'CodeEditorTab[]', description: 'Emitted with cloned tabs when the active tab code changes.' },
    { name: 'update:activeTab', type: 'number', description: 'Emitted when the active tab index changes.' },
    { name: 'tab-change', type: '{ index: number; tab: CodeEditorTab }', description: 'Emitted when user selects another tab.' },
    { name: 'change', type: 'string', description: 'Emitted on user input or Tab indentation.' },
    { name: 'focus', type: 'FocusEvent', description: 'Emitted when the editor gains focus.' },
    { name: 'blur', type: 'FocusEvent', description: 'Emitted when the editor loses focus.' },
    { name: 'copy', type: 'string', description: 'Emitted with copied text when Copy succeeds.' }
  ]
}

// IconField
const iconFieldSearch = ref('')
const iconFieldEmail = ref('')

const iconFieldCode = `<template>
  <IconField icon-position="left" fluid>
    <template #icon><Search :size="16" /></template>
    <input v-model="search" type="text" placeholder="Search components..." />
  </IconField>

  <IconField icon-position="right" fluid>
    <template #icon><Mail :size="16" /></template>
    <input v-model="email" type="email" placeholder="you@example.com" />
  </IconField>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Search } from 'lucide-vue-next'
import { IconField } from '@mfs-atomic/ui'

const search = ref('')
const email = ref('')
<\/script>`

const iconFieldApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", description: 'Places the icon on the left or right side.' },
    { name: 'fluid', type: 'boolean', default: 'false', description: 'Expands wrapper to 100% width.' }
  ],
  slots: [
    { name: 'icon', description: 'Icon element positioned inside the input.' },
    { name: 'default', description: 'Wrapped input or Input component.' }
  ]
}

const inputIconCode = `<template>
  <Input v-model="query" label="Search" placeholder="Search...">
    <template #prepend>
      <InputIcon><Search :size="16" /></InputIcon>
    </template>
  </Input>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { Input, InputIcon } from '@mfs-atomic/ui'

const query = ref('')
<\/script>`

const inputIconApi: { slots: ApiRow[] } = {
  slots: [{ name: 'default', description: 'Icon element (e.g. Lucide icon) wrapped with aria-hidden="true".' }]
}

const inputGroupAddonCode = `<template>
  <InputGroup>
    <InputGroupAddon>https://</InputGroupAddon>
    <Input v-model="domain" placeholder="example" />
    <InputGroupAddon>.com</InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Input, InputGroup, InputGroupAddon } from '@mfs-atomic/ui'

const domain = ref('mfs-theme')
<\/script>`

const inputGroupAddonApi: { slots: ApiRow[] } = {
  slots: [{ name: 'default', description: 'Static text, unit, or symbol addon rendered inside InputGroup.' }]
}
</script>

<style scoped>
.demo-raw-input {
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
}

.demo-fl-input {
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
}

.demo-fl-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), var(--input-shadow);
}
</style>
