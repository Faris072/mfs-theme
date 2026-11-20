<template>
  <!-- Textarea -->
  <ComponentPreview
    v-if="activeSlug === 'textarea'"
    title="Textarea"
    description="Multi-line text area with auto-resize, character counter, and validation states."
    :code="textareaCode"
    :api="textareaApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <Textarea
          v-model="bio"
          label="Project Bio"
          placeholder="Describe your multi-theme workspace..."
          hint="Auto-resizes as you type."
          :maxlength="160"
          show-count
          required
        />
        <div class="demo-readout">
          <span class="demo-readout-label">v-model:</span>
          <code>{{ JSON.stringify(bio) }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <Textarea
          v-model="notes"
          label="Validation & Disabled"
          :rows="2"
          :auto-resize="false"
          error="Description must be at least 20 characters."
        />
        <Textarea
          model-value="Read-only system configuration note."
          label="Disabled State"
          :rows="2"
          disabled
        />
      </div>
    </div>
  </ComponentPreview>

  <!-- InputNumber -->
  <ComponentPreview
    v-else-if="activeSlug === 'input-number'"
    title="InputNumber"
    description="Numeric stepper with min/max bounds, decimal precision, prefix, and arrow-key support."
    :code="inputNumberCode"
    :api="inputNumberApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <InputNumber
          v-model="quantity"
          label="Seat Count"
          :min="1"
          :max="20"
          :step="1"
          hint="Use buttons or Up/Down arrow keys (1–20)."
        />
        <div class="demo-readout">
          <span class="demo-readout-label">quantity:</span>
          <code>{{ quantity }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <InputNumber
          v-model="budget"
          label="Monthly Budget"
          prefix="$"
          :min="0"
          :max="10000"
          :step="25.5"
          :decimals="2"
        />
        <div class="demo-readout">
          <span class="demo-readout-label">budget:</span>
          <code>{{ budget }}</code>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- Password -->
  <ComponentPreview
    v-else-if="activeSlug === 'password'"
    title="Password"
    description="Secure password input with visibility toggle and live strength meter."
    :code="passwordCode"
    :api="passwordApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <Password
          v-model="secret"
          label="Account Password"
          placeholder="Enter a strong password"
          hint="Mix uppercase, numbers, and symbols."
          show-strength
          required
        />
        <div class="demo-readout">
          <span class="demo-readout-label">length:</span>
          <code>{{ secret.length }} chars</code>
        </div>
      </div>

      <div class="demo-stack">
        <Password
          model-value="123"
          label="Invalid Password"
          error="Password does not meet minimum length."
        />
        <Password
          model-value="locked-token"
          label="Disabled"
          disabled
        />
      </div>
    </div>
  </ComponentPreview>

  <!-- Checkbox -->
  <ComponentPreview
    v-else-if="activeSlug === 'checkbox'"
    title="Checkbox"
    description="Boolean or array-bound checkbox supporting indeterminate state and custom label slots."
    :code="checkboxCode"
    :api="checkboxApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <Checkbox v-model="agreed" label="Accept terms and conditions" />
        <Checkbox
          :model-value="allThemesSelected"
          :indeterminate="someThemesSelected"
          label="Select all themes (indeterminate)"
          @change="toggleAllThemes"
        />
        <Checkbox :model-value="true" label="Disabled checked" disabled />
        <div class="demo-readout">
          <span class="demo-readout-label">agreed:</span>
          <code>{{ agreed }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <span class="demo-group-title">Enabled Themes (array v-model)</span>
        <div class="demo-row">
          <Checkbox v-for="t in themeChoices" :key="t" v-model="selectedThemes" :value="t" :label="t" />
        </div>
        <div class="demo-readout">
          <span class="demo-readout-label">selectedThemes:</span>
          <code>{{ JSON.stringify(selectedThemes) }}</code>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- RadioButton -->
  <ComponentPreview
    v-else-if="activeSlug === 'radio-button'"
    title="RadioButton"
    description="Mutually exclusive radio options with accessible group semantics."
    :code="radioCode"
    :api="radioApi"
  >
    <div class="demo-stack">
      <div class="demo-row" role="radiogroup" aria-label="Deployment plan">
        <RadioButton v-model="plan" name="plan" value="starter" label="Starter" />
        <RadioButton v-model="plan" name="plan" value="pro" label="Pro" />
        <RadioButton v-model="plan" name="plan" value="enterprise" label="Enterprise" />
        <RadioButton v-model="plan" name="plan" value="legacy" label="Legacy (Disabled)" disabled />
      </div>
      <div class="demo-readout">
        <span class="demo-readout-label">plan:</span>
        <code>{{ JSON.stringify(plan) }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- Select -->
  <ComponentPreview
    v-else-if="activeSlug === 'select'"
    title="Select"
    description="Single-select dropdown with search filter, clearable button, keyboard navigation, and custom option slot."
    :code="selectCode"
    :api="selectApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <Select
          v-model="framework"
          label="Framework"
          :options="frameworkOptions"
          placeholder="Choose a framework"
          searchable
          clearable
          hint="Type to filter or use Arrow keys."
        />
        <div class="demo-readout">
          <span class="demo-readout-label">framework:</span>
          <code>{{ JSON.stringify(framework) }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <Select
          v-model="role"
          label="Custom Option Slot"
          :options="roleOptions"
          placeholder="Assign role"
        >
          <template #option="{ option, selected }">
            <span class="demo-opt-custom">
              <span>{{ option.label }}</span>
              <small v-if="selected" class="demo-opt-tag">Active</small>
            </span>
          </template>
        </Select>
        <div class="demo-readout">
          <span class="demo-readout-label">role:</span>
          <code>{{ JSON.stringify(role) }}</code>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- MultiSelect -->
  <ComponentPreview
    v-else-if="activeSlug === 'multi-select'"
    title="MultiSelect"
    description="Multi-value selector rendering chosen items as removable chips with search and Select All."
    :code="multiSelectCode"
    :api="multiSelectApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <MultiSelect
          v-model="tags"
          label="UI Capabilities"
          :options="tagOptions"
          placeholder="Pick capabilities"
          searchable
          select-all
          hint="Click chip × to remove."
        />
        <div class="demo-readout">
          <span class="demo-readout-label">tags:</span>
          <code>{{ JSON.stringify(tags) }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <MultiSelect
          :model-value="['clay', 'glass']"
          label="Disabled MultiSelect"
          :options="['clay', 'glass', 'neo']"
          disabled
        />
      </div>
    </div>
  </ComponentPreview>

  <!-- Slider -->
  <ComponentPreview
    v-else-if="activeSlug === 'slider'"
    title="Slider"
    description="Continuous or stepped slider supporting single values, dual-thumb ranges, and keyboard arrows."
    :code="sliderCode"
    :api="sliderApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <Slider v-model="volume" label="Opacity" :min="0" :max="100" :step="5" />
        <div class="demo-readout">
          <span class="demo-readout-label">volume:</span>
          <code>{{ volume }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <Slider v-model="priceRange" label="Price Range ($)" range :min="0" :max="500" :step="10" />
        <div class="demo-readout">
          <span class="demo-readout-label">priceRange:</span>
          <code>{{ JSON.stringify(priceRange) }}</code>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- Rating -->
  <ComponentPreview
    v-else-if="activeSlug === 'rating'"
    title="Rating"
    description="Interactive star rating with half-star precision, custom star count, and keyboard control."
    :code="ratingCode"
    :api="ratingApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <Rating v-model="score" label="Fractional Rating (allow-half)" allow-half />
        <div class="demo-readout">
          <span class="demo-readout-label">score:</span>
          <code>{{ score }} / 5</code>
        </div>
      </div>

      <div class="demo-stack">
        <Rating :model-value="4" label="Readonly (6 stars)" :stars="6" readonly />
        <Rating :model-value="2" label="Disabled" disabled />
      </div>
    </div>
  </ComponentPreview>

  <!-- ColorPicker -->
  <ComponentPreview
    v-else-if="activeSlug === 'color-picker'"
    title="ColorPicker"
    description="Color swatch trigger with native palette, hex/RGB inputs, and preset swatches."
    :code="colorPickerCode"
    :api="colorPickerApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <ColorPicker v-model="accentColor" label="Primary Accent" />
        <div class="demo-readout">
          <span class="demo-readout-label">accentColor:</span>
          <span class="demo-color-dot" :style="{ backgroundColor: accentColor }" />
          <code>{{ accentColor }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <ColorPicker
          v-model="brandColor"
          label="Custom Presets"
          :presets="['#0ea5e9', '#14b8a6', '#f97316', '#e11d48', '#6366f1']"
        />
        <div class="demo-readout">
          <span class="demo-readout-label">brandColor:</span>
          <span class="demo-color-dot" :style="{ backgroundColor: brandColor }" />
          <code>{{ brandColor }}</code>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- DatePicker -->
  <ComponentPreview
    v-else-if="activeSlug === 'date-picker'"
    title="DatePicker"
    description="Calendar popover selector supporting single dates, date ranges, and min/max constraints."
    :code="datePickerCode"
    :api="datePickerApi"
  >
    <div class="demo-grid">
      <div class="demo-stack">
        <DatePicker
          v-model="selectedDate"
          label="Release Date"
          placeholder="Pick a date"
          hint="Single date selection."
        />
        <div class="demo-readout">
          <span class="demo-readout-label">selectedDate:</span>
          <code>{{ formatDateVal(selectedDate) }}</code>
        </div>
      </div>

      <div class="demo-stack">
        <DatePicker
          v-model="dateRange"
          label="Sprint Window (Range)"
          range
          placeholder="Select start – end"
          :min="minDate"
        />
        <div class="demo-readout">
          <span class="demo-readout-label">dateRange:</span>
          <code>{{ formatRangeVal(dateRange) }}</code>
        </div>
      </div>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import {
  Textarea,
  InputNumber,
  Password,
  Checkbox,
  RadioButton,
  Select,
  MultiSelect,
  Slider,
  Rating,
  ColorPicker,
  DatePicker
} from '../../lib'

defineProps<{ activeSlug: string }>()

type ApiSpec = {
  props?: ApiRow[]
  events?: ApiRow[]
  slots?: ApiRow[]
}

// ── Textarea state & docs ──────────────────────────────────────────────
const bio = ref('Adaptive Clay, Glass, and Neo components for Vue 3.')
const notes = ref('Too short')

const textareaCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from 'mfs-theme'

const bio = ref('')
<\/script>

<template>
  <Textarea
    v-model="bio"
    label="Project Bio"
    placeholder="Describe your workspace..."
    :maxlength="160"
    show-count
    auto-resize
  />
</template>`

const textareaApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Bound text value.' },
    { name: 'id', type: 'string', default: 'auto', description: 'Optional HTML id for label association.' },
    { name: 'label', type: 'string', description: 'Field label text.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
    { name: 'hint', type: 'string', description: 'Helper text shown below field.' },
    { name: 'error', type: 'string', description: 'Error message; marks field invalid.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks label with required asterisk.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing.' },
    { name: 'rows', type: 'number', default: '3', description: 'Initial visible text rows.' },
    { name: 'maxlength', type: 'number', description: 'Maximum character limit.' },
    { name: 'showCount', type: 'boolean', default: 'false', description: 'Displays character counter.' },
    { name: 'autoResize', type: 'boolean', default: 'true', description: 'Automatically grows height with content.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: string)', description: 'Emitted on input.' },
    { name: 'focus', type: '(event: FocusEvent)', description: 'Emitted when textarea gains focus.' },
    { name: 'blur', type: '(event: FocusEvent)', description: 'Emitted when textarea loses focus.' }
  ]
}

// ── InputNumber state & docs ───────────────────────────────────────────
const quantity = ref<number | null>(4)
const budget = ref<number | null>(250)

const inputNumberCode = `<script setup lang="ts">
import { ref } from 'vue'
import { InputNumber } from 'mfs-theme'

const budget = ref<number | null>(250)
<\/script>

<template>
  <InputNumber
    v-model="budget"
    label="Monthly Budget"
    prefix="$"
    :min="0"
    :max="10000"
    :step="25.5"
    :decimals="2"
  />
</template>`

const inputNumberApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'number | null', default: 'null', description: 'Bound numeric value.' },
    { name: 'id', type: 'string', default: 'auto', description: 'Optional HTML id.' },
    { name: 'label', type: 'string', description: 'Field label text.' },
    { name: 'placeholder', type: 'string', default: "'0'", description: 'Placeholder when empty.' },
    { name: 'hint', type: 'string', description: 'Helper text below field.' },
    { name: 'error', type: 'string', description: 'Error message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables stepper and input.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing.' },
    { name: 'min', type: 'number', description: 'Minimum allowed value.' },
    { name: 'max', type: 'number', description: 'Maximum allowed value.' },
    { name: 'step', type: 'number', default: '1', description: 'Increment/decrement step size.' },
    { name: 'decimals', type: 'number', default: '0', description: 'Fixed decimal places on blur.' },
    { name: 'prefix', type: 'string', description: 'Optional prefix symbol (e.g. $).' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: number | null)', description: 'Emitted when value changes.' },
    { name: 'change', type: '(value: number | null)', description: 'Emitted on step or blur commit.' }
  ]
}

// ── Password state & docs ──────────────────────────────────────────────
const secret = ref('MfsTheme#2026')

const passwordCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Password } from 'mfs-theme'

const secret = ref('')
<\/script>

<template>
  <Password
    v-model="secret"
    label="Account Password"
    placeholder="Enter a strong password"
    show-strength
  />
</template>`

const passwordApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Bound password string.' },
    { name: 'id', type: 'string', default: 'auto', description: 'Optional HTML id.' },
    { name: 'label', type: 'string', description: 'Field label text.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
    { name: 'hint', type: 'string', description: 'Helper text.' },
    { name: 'error', type: 'string', description: 'Error message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables input and toggle.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing.' },
    { name: 'showStrength', type: 'boolean', default: 'false', description: 'Shows 4-bar password strength meter.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: string)', description: 'Emitted on input.' },
    { name: 'focus', type: '(event: FocusEvent)', description: 'Emitted on focus.' },
    { name: 'blur', type: '(event: FocusEvent)', description: 'Emitted on blur.' }
  ]
}

// ── Checkbox state & docs ──────────────────────────────────────────────
const agreed = ref(true)
const themeChoices = ['Clay', 'Glass', 'Neo']
const selectedThemes = ref<string[]>(['Clay', 'Glass'])

const allThemesSelected = computed(() => selectedThemes.value.length === themeChoices.length)
const someThemesSelected = computed(
  () => selectedThemes.value.length > 0 && selectedThemes.value.length < themeChoices.length
)
const toggleAllThemes = (checked: boolean | any[]) => {
  selectedThemes.value = checked ? [...themeChoices] : []
}

const checkboxCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'mfs-theme'

const agreed = ref(true)
const selected = ref(['Clay', 'Glass'])
<\/script>

<template>
  <Checkbox v-model="agreed" label="Accept terms" />
  <Checkbox v-model="selected" value="Clay" label="Clay" />
  <Checkbox v-model="selected" value="Glass" label="Glass" />
</template>`

const checkboxApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'boolean | any[]', default: 'false', description: 'Boolean or array of checked values.' },
    { name: 'value', type: 'any', description: 'Item value when bound to an array.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Renders mixed/indeterminate dash state.' },
    { name: 'label', type: 'string', description: 'Checkbox label text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
    { name: 'id', type: 'string', description: 'Optional input id.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: boolean | any[])', description: 'Emitted when checked state changes.' },
    { name: 'change', type: '(value: boolean | any[])', description: 'Emitted on user toggle.' }
  ],
  slots: [{ name: 'default', description: 'Custom label content (overrides label prop).' }]
}

// ── RadioButton state & docs ───────────────────────────────────────────
const plan = ref('pro')

const radioCode = `<script setup lang="ts">
import { ref } from 'vue'
import { RadioButton } from 'mfs-theme'

const plan = ref('pro')
<\/script>

<template>
  <RadioButton v-model="plan" name="plan" value="starter" label="Starter" />
  <RadioButton v-model="plan" name="plan" value="pro" label="Pro" />
  <RadioButton v-model="plan" name="plan" value="enterprise" label="Enterprise" />
</template>`

const radioApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'any', description: 'Selected group value.' },
    { name: 'value', type: 'any', description: 'Value represented by this radio option (required).' },
    { name: 'name', type: 'string', description: 'Native radio group name.' },
    { name: 'label', type: 'string', description: 'Option label text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this option.' },
    { name: 'id', type: 'string', description: 'Optional input id.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: any)', description: 'Emitted when option is selected.' },
    { name: 'change', type: '(value: any)', description: 'Emitted on selection change.' }
  ],
  slots: [{ name: 'default', description: 'Custom label content.' }]
}

// ── Select state & docs ────────────────────────────────────────────────
const framework = ref<string | null>('vue')
const frameworkOptions = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'Nuxt 3', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
  { label: 'Astro (Disabled)', value: 'astro', disabled: true }
]
const role = ref('architect')
const roleOptions = ['Architect', 'Builder', 'Guardian', 'Assistant'].map((r) => ({
  label: r,
  value: r.toLowerCase()
}))

const selectCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'mfs-theme'

const framework = ref('vue')
const options = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'Nuxt 3', value: 'nuxt' },
  { label: 'Vite', value: 'vite' }
]
<\/script>

<template>
  <Select
    v-model="framework"
    label="Framework"
    :options="options"
    searchable
    clearable
  />
</template>`

const selectApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'any', description: 'Selected option value.' },
    { name: 'options', type: 'Array<string | SelectOption>', default: '[]', description: 'List of strings or { label, value, disabled }.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'placeholder', type: 'string', default: "'Select an option'", description: 'Placeholder text.' },
    { name: 'hint', type: 'string', description: 'Helper text.' },
    { name: 'error', type: 'string', description: 'Error message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables trigger.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Adds search input in dropdown.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows clear button when value is set.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: any)', description: 'Emitted when selection changes.' },
    { name: 'change', type: '(value: any)', description: 'Emitted on option select or clear.' }
  ],
  slots: [{ name: 'option', description: 'Custom option template receiving { option, selected }.' }]
}

// ── MultiSelect state & docs ───────────────────────────────────────────
const tags = ref<string[]>(['responsive', 'a11y'])
const tagOptions = [
  { label: 'Responsive', value: 'responsive' },
  { label: 'Accessible (a11y)', value: 'a11y' },
  { label: 'Claymorphism', value: 'clay' },
  { label: 'Glassmorphism', value: 'glass' },
  { label: 'Neumorphism', value: 'neo' }
]

const multiSelectCode = `<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect } from 'mfs-theme'

const tags = ref(['responsive', 'a11y'])
const options = [
  { label: 'Responsive', value: 'responsive' },
  { label: 'Accessible (a11y)', value: 'a11y' },
  { label: 'Claymorphism', value: 'clay' }
]
<\/script>

<template>
  <MultiSelect
    v-model="tags"
    label="UI Capabilities"
    :options="options"
    searchable
    select-all
  />
</template>`

const multiSelectApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'any[]', default: '[]', description: 'Array of selected option values.' },
    { name: 'options', type: 'Array<string | MultiSelectOption>', default: '[]', description: 'Strings or { label, value, disabled }.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'placeholder', type: 'string', default: "'Select items'", description: 'Placeholder when empty.' },
    { name: 'hint', type: 'string', description: 'Helper text.' },
    { name: 'error', type: 'string', description: 'Error message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables selector and chip removal.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows search input in dropdown.' },
    { name: 'selectAll', type: 'boolean', default: 'false', description: 'Shows Select All toggle.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: any[])', description: 'Emitted when selected array changes.' },
    { name: 'change', type: '(value: any[])', description: 'Emitted on option toggle or chip removal.' }
  ]
}

// ── Slider state & docs ────────────────────────────────────────────────
const volume = ref(65)
const priceRange = ref<[number, number]>([120, 360])

const sliderCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'mfs-theme'

const volume = ref(65)
const priceRange = ref<[number, number]>([120, 360])
<\/script>

<template>
  <Slider v-model="volume" label="Opacity" :min="0" :max="100" :step="5" />
  <Slider v-model="priceRange" label="Price Range ($)" range :min="0" :max="500" :step="10" />
</template>`

const sliderApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'number | [number, number]', default: '0', description: 'Single number or [min, max] tuple.' },
    { name: 'range', type: 'boolean', default: 'false', description: 'Enables dual-thumb range mode.' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum track value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum track value.' },
    { name: 'step', type: 'number', default: '1', description: 'Step snap interval.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables dragging and keyboard.' },
    { name: 'label', type: 'string', description: 'Header label with live readout.' },
    { name: 'showTooltip', type: 'boolean', default: 'true', description: 'Shows value tooltip on thumb.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: number | [number, number])', description: 'Emitted during drag or key press.' },
    { name: 'change', type: '(value: number | [number, number])', description: 'Emitted on release or key press.' }
  ]
}

// ── Rating state & docs ────────────────────────────────────────────────
const score = ref(3.5)

const ratingCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'mfs-theme'

const score = ref(3.5)
<\/script>

<template>
  <Rating v-model="score" label="Rating" allow-half />
</template>`

const ratingApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'number', default: '0', description: 'Current rating value.' },
    { name: 'stars', type: 'number', default: '5', description: 'Total number of stars.' },
    { name: 'allowHalf', type: 'boolean', default: 'false', description: 'Enables 0.5-step fractional ratings.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Displays rating without interaction.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables star buttons.' },
    { name: 'label', type: 'string', description: 'Label displayed next to stars.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: number)', description: 'Emitted when rating changes.' },
    { name: 'change', type: '(value: number)', description: 'Emitted on click or arrow-key change.' }
  ]
}

// ── ColorPicker state & docs ───────────────────────────────────────────
const accentColor = ref('#8b5cf6')
const brandColor = ref('#0ea5e9')

const colorPickerCode = `<script setup lang="ts">
import { ref } from 'vue'
import { ColorPicker } from 'mfs-theme'

const accentColor = ref('#8b5cf6')
<\/script>

<template>
  <ColorPicker
    v-model="accentColor"
    label="Primary Accent"
    :presets="['#8b5cf6', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e']"
  />
</template>`

const colorPickerApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'string', default: "'#8b5cf6'", description: 'Bound hex color string.' },
    { name: 'presets', type: 'string[]', default: '8-color palette', description: 'Quick-select preset hex swatches.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables popover trigger.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: string)', description: 'Emitted when hex color updates.' },
    { name: 'change', type: '(value: string)', description: 'Emitted on preset, RGB, or hex change.' }
  ]
}

// ── DatePicker state & docs ────────────────────────────────────────────
const today = new Date()
const selectedDate = ref<Date | null>(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
const dateRange = ref<[Date, Date] | null>([
  new Date(today.getFullYear(), today.getMonth(), 5),
  new Date(today.getFullYear(), today.getMonth(), 14)
])
const minDate = new Date(today.getFullYear(), today.getMonth(), 1)

const formatDateVal = (val: Date | [Date, Date] | null) => {
  if (!val || Array.isArray(val)) return 'null'
  return val.toISOString().slice(0, 10)
}

const formatRangeVal = (val: Date | [Date, Date] | null) => {
  if (!Array.isArray(val)) return 'null'
  return `${val[0].toISOString().slice(0, 10)} → ${val[1].toISOString().slice(0, 10)}`
}

const datePickerCode = `<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from 'mfs-theme'

const selectedDate = ref<Date | null>(new Date())
const dateRange = ref<[Date, Date] | null>(null)
<\/script>

<template>
  <DatePicker v-model="selectedDate" label="Release Date" />
  <DatePicker v-model="dateRange" label="Sprint Window" range />
</template>`

const datePickerApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'DateInput | [DateInput, DateInput] | null', default: 'null', description: 'Selected Date/string or [start, end] tuple.' },
    { name: 'range', type: 'boolean', default: 'false', description: 'Enables start–end range selection.' },
    { name: 'min', type: 'Date | string', description: 'Minimum selectable date.' },
    { name: 'max', type: 'Date | string', description: 'Maximum selectable date.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Placeholder when empty.' },
    { name: 'hint', type: 'string', description: 'Helper text.' },
    { name: 'error', type: 'string', description: 'Error message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables calendar trigger.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: Date | [Date, Date] | null)', description: 'Emitted when date or range is picked.' },
    { name: 'change', type: '(value: Date | [Date, Date] | null)', description: 'Emitted on selection.' }
  ]
}
</script>

<style scoped>
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  align-items: start;
}

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  align-items: center;
}

.demo-group-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.demo-readout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm, 10px);
  background: var(--surface-alt);
  border: 1px solid var(--border, transparent);
  font-size: 0.8rem;
  color: var(--text);
}

.demo-readout-label {
  color: var(--text-muted);
  font-weight: 600;
}

.demo-readout code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  word-break: break-word;
}

.demo-color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.15));
  flex-shrink: 0;
}

.demo-opt-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.demo-opt-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
}
</style>
