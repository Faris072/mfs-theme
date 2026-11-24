<template>
  <!-- Textarea -->
  <ComponentPreview
    v-if="activeSlug === 'textarea'"
    title="Textarea"
    description="Multi-line text area with auto-resize, character counter, and validation states."
    :code="textareaCode"
    :api="textareaApi"
  >
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <Textarea
          v-model="bio"
          label="Project Bio"
          placeholder="Describe your multi-theme workspace..."
          hint="Auto-resizes as you type."
          :maxlength="160"
          show-count
          required
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">v-model:</span>
          <code>{{ JSON.stringify(bio) }}</code>
        </div>
      </div>

      <div class="mfs-stack">
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
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <InputNumber
          v-model="quantity"
          label="Seat Count"
          :min="1"
          :max="20"
          :step="1"
          hint="Use buttons or Up/Down arrow keys (1–20)."
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">quantity:</span>
          <code>{{ quantity }}</code>
        </div>
      </div>

      <div class="mfs-stack">
        <InputNumber
          v-model="budget"
          label="Monthly Budget"
          prefix="$"
          :min="0"
          :max="10000"
          :step="25.5"
          :decimals="2"
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">budget:</span>
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
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <Password
          v-model="secret"
          label="Account Password"
          placeholder="Enter a strong password"
          hint="Mix uppercase, numbers, and symbols."
          show-strength
          required
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">length:</span>
          <code>{{ secret.length }} chars</code>
        </div>
      </div>

      <div class="mfs-stack">
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
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <Checkbox v-model="agreed" label="Accept terms and conditions" />
        <Checkbox
          :model-value="allThemesSelected"
          :indeterminate="someThemesSelected"
          label="Select all themes (indeterminate)"
          @change="toggleAllThemes"
        />
        <Checkbox :model-value="true" label="Disabled checked" disabled />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">agreed:</span>
          <code>{{ agreed }}</code>
        </div>
      </div>

      <div class="mfs-stack">
        <span class="mfs-text-xs mfs-font-bold mfs-text-muted demo-group-title">Enabled Themes (array v-model)</span>
        <div class="mfs-row">
          <Checkbox v-for="t in themeChoices" :key="t" v-model="selectedThemes" :value="t" :label="t" />
        </div>
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">selectedThemes:</span>
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
    <div class="mfs-stack">
      <div class="mfs-row" role="radiogroup" aria-label="Deployment plan">
        <RadioButton v-model="plan" name="plan" value="starter" label="Starter" />
        <RadioButton v-model="plan" name="plan" value="pro" label="Pro" />
        <RadioButton v-model="plan" name="plan" value="enterprise" label="Enterprise" />
        <RadioButton v-model="plan" name="plan" value="legacy" label="Legacy (Disabled)" disabled />
      </div>
      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
        <span class="mfs-text-muted mfs-font-semibold">plan:</span>
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
    :code-tabs="selectCodeTabs"
    :api="selectApi"
  >
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <Select
          v-model="framework"
          label="Framework"
          :options="frameworkOptions"
          placeholder="Choose a framework"
          searchable
          clearable
          hint="Type to filter or use Arrow keys."
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">framework:</span>
          <code>{{ JSON.stringify(framework) }}</code>
        </div>
      </div>

      <div class="mfs-stack">
        <Select
          v-model="role"
          label="Custom Option Slot"
          :options="roleOptions"
          placeholder="Assign role"
        >
          <template #option="{ option, selected }">
            <span class="mfs-flex mfs-items-center mfs-justify-between mfs-w-full mfs-gap-2">
              <span>{{ option.label }}</span>
              <small v-if="selected" class="mfs-text-xs mfs-font-bold mfs-text-primary">Active</small>
            </span>
          </template>
        </Select>
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">role:</span>
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
    :code-tabs="multiSelectCodeTabs"
    :api="multiSelectApi"
  >
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <MultiSelect
          v-model="tags"
          label="UI Capabilities"
          :options="tagOptions"
          placeholder="Pick capabilities"
          searchable
          select-all
          hint="Click chip × to remove."
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">tags:</span>
          <code>{{ JSON.stringify(tags) }}</code>
        </div>
      </div>

      <div class="mfs-stack">
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
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <Slider v-model="volume" label="Opacity" :min="0" :max="100" :step="5" />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">volume:</span>
          <code>{{ volume }}</code>
        </div>
      </div>

      <div class="mfs-stack">
        <Slider v-model="priceRange" label="Price Range ($)" range :min="0" :max="500" :step="10" />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">priceRange:</span>
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
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <Rating v-model="score" label="Fractional Rating (allow-half)" allow-half />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">score:</span>
          <code>{{ score }} / 5</code>
        </div>
      </div>

      <div class="mfs-stack">
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
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <ColorPicker v-model="accentColor" label="Primary Accent" />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">accentColor:</span>
          <span class="demo-color-dot" :style="{ backgroundColor: accentColor }" />
          <code>{{ accentColor }}</code>
        </div>
      </div>

      <div class="mfs-stack">
        <ColorPicker
          v-model="brandColor"
          label="Custom Presets"
          :presets="['#0ea5e9', '#14b8a6', '#f97316', '#e11d48', '#6366f1']"
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">brandColor:</span>
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
    <div class="mfs-grid mfs-items-start">
      <div class="mfs-stack">
        <DatePicker
          v-model="selectedDate"
          label="Release Date"
          placeholder="Pick a date"
          hint="Single date selection."
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">selectedDate:</span>
          <code>{{ formatDateVal(selectedDate) }}</code>
        </div>
      </div>

      <div class="mfs-stack">
        <DatePicker
          v-model="dateRange"
          label="Sprint Window (Range)"
          range
          placeholder="Select start – end"
          :min="minDate"
        />
        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
          <span class="mfs-text-muted mfs-font-semibold">dateRange:</span>
          <code>{{ formatRangeVal(dateRange) }}</code>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- 12. CHIPS -->
  <ComponentPreview
    v-else-if="activeSlug === 'chips'"
    title="Chips"
    description="Multi-tag text input creating removable Chip pills via Enter, comma separator, or Backspace."
    :code="chipsCode"
    :api="chipsApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Chips
        v-model="chipTags"
        label="Project Tags"
        placeholder="Add tag and press Enter..."
        :max="6"
        hint="Up to 6 tags. Press comma or Enter to add."
      />
      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
        <span class="mfs-text-muted mfs-font-semibold">tags:</span>
        <code>{{ JSON.stringify(chipTags) }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- 13. CHECKBOX GROUP -->
  <ComponentPreview
    v-else-if="activeSlug === 'checkbox-group'"
    title="CheckboxGroup"
    description="Accessible group container coordinating array v-model, direction, and disabled/invalid states."
    :code="checkboxGroupCode"
    :api="checkboxGroupApi"
  >
    <div class="mfs-stack mfs-w-full">
      <CheckboxGroup
        v-model="selectedChannels"
        name="channels"
        direction="row"
        :options="channelOptions"
      />
      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
        <span class="mfs-text-muted mfs-font-semibold">selectedChannels:</span>
        <code>{{ JSON.stringify(selectedChannels) }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- 14. RADIO BUTTON GROUP -->
  <ComponentPreview
    v-else-if="activeSlug === 'radio-button-group'"
    title="RadioButtonGroup"
    description="Accessible radiogroup container coordinating shared name, single-value v-model, and layout direction."
    :code="radioButtonGroupCode"
    :api="radioButtonGroupApi"
  >
    <div class="mfs-stack mfs-w-full">
      <RadioButtonGroup
        v-model="selectedPlan"
        name="billing-plan"
        direction="column"
        :options="planOptions"
      />
      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
        <span class="mfs-text-muted mfs-font-semibold">selectedPlan:</span>
        <code>{{ selectedPlan }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- 15. FORM & FORMFIELD -->
  <ComponentPreview
    v-else-if="activeSlug === 'form'"
    title="Form & FormField"
    description="Form state container with resolver validation, FormField context injection, and 422 server error mapping."
    :code="formCode"
    :code-tabs="formCodeTabs"
    :api="formApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-items-center mfs-justify-between mfs-gap-2">
        <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">
          Submit with empty fields for client resolver, or trigger a simulated Laravel 422 response.
        </span>
        <Button size="sm" variant="surface" @click="simulate422">
          Simulate 422 Error
        </Button>
      </div>

      <Form
        :initial-values="{ name: 'Alya Putri', email: 'alya@example.com' }"
        :errors="formServerErrors"
        :resolver="formResolver"
        :submitting="formSubmitting"
        @submit="onFormSubmit"
        @reset="onFormReset"
      >
        <template #default="{ values, reset }">
          <FormField name="name" label="Full Name" hint="Public display name." required>
            <template #default="{ value, error, setValue }">
              <Input
                id="name"
                :model-value="String(value ?? '')"
                :error="error"
                placeholder="Enter full name"
                @update:model-value="setValue($event)"
              />
            </template>
          </FormField>

          <FormField name="email" label="Work Email" required>
            <template #default="{ value, error, setValue }">
              <Input
                id="email"
                :model-value="String(value ?? '')"
                :error="error"
                placeholder="name@company.com"
                @update:model-value="setValue($event)"
              />
            </template>
          </FormField>

          <div class="mfs-row mfs-items-center mfs-justify-end mfs-gap-2">
            <Button type="button" size="sm" variant="surface" @click="reset">Reset</Button>
            <Button type="submit" size="sm" variant="primary" :loading="formSubmitting">Submit</Button>
          </div>

          <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
            <span class="mfs-text-muted mfs-font-semibold">status:</span>
            <code>{{ formStatus }} · values={{ JSON.stringify(values) }}</code>
          </div>
        </template>
      </Form>
    </div>
  </ComponentPreview>

  <!-- 16. MENTIONS -->
  <ComponentPreview
    v-else-if="activeSlug === 'mentions'"
    title="Mentions"
    description="Textarea with @ trigger detection and async remote user search."
    :code="mentionsCode"
    :code-tabs="mentionsCodeTabs"
    :api="mentionsApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Alert severity="info" title="Local vs Remote @search">
        <div class="mfs-stack mfs-gap-1 mfs-text-xs">
          <span>
            <strong>Local (default):</strong> Omit <code>remote</code> to filter a static team/tag array automatically as the user types after <code>@</code>.
          </span>
          <span>
            <strong>Remote (<code>remote</code> + <code>:loading</code>):</strong> Disables client-side filtering so <code>@search="({ trigger, query }) => ..."</code> can run a debounced API lookup.
          </span>
        </div>
      </Alert>

      <Mentions
        v-model="mentionText"
        :options="mentionOptions"
        :loading="mentionLoading"
        remote
        placeholder="Type @ followed by a name (e.g. @alya or @bima)..."
        :rows="3"
        @search="onMentionSearch"
        @select="onMentionSelect"
      />
      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs demo-readout">
        <span class="mfs-text-muted mfs-font-semibold">lastSelected:</span>
        <code>{{ lastMentioned || 'None' }}</code>
      </div>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import {
  Alert,
  Button,
  Input,
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
import Chips from '../../lib/components/Chips.vue'
import Form, { type MfsFormSubmitPayload } from '../../lib/components/Form.vue'
import FormField from '../../lib/components/FormField.vue'
import Mentions, { type MentionOption } from '../../lib/components/Mentions.vue'
import CheckboxGroup from '../../lib/components/CheckboxGroup.vue'
import RadioButtonGroup from '../../lib/components/RadioButtonGroup.vue'

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
import { Textarea } from '@mfs-atomic/ui'

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
import { InputNumber } from '@mfs-atomic/ui'

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
import { Password } from '@mfs-atomic/ui'

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
import { Checkbox } from '@mfs-atomic/ui'

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
import { RadioButton } from '@mfs-atomic/ui'

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
import { onMounted, ref } from 'vue'
import { Select, type SelectOption } from '@mfs-atomic/ui'
import { frameworkOptions } from './data'
import { fetchFrameworks } from './fetchApi'

const framework = ref<string | null>('vue')
const options = ref<SelectOption[]>(frameworkOptions)

onMounted(async () => {
  options.value = await fetchFrameworks('')
})
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

const selectCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: selectCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { SelectOption } from '@mfs-atomic/ui'

export const frameworkOptions: SelectOption[] = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'Nuxt 3', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
  { label: 'Astro (Disabled)', value: 'astro', disabled: true }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { SelectOption } from '@mfs-atomic/ui'

export async function fetchFrameworks(query: string): Promise<SelectOption[]> {
  const params = new URLSearchParams({ q: query })
  const res = await fetch(\`/api/frameworks?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

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
import { onMounted, ref } from 'vue'
import { MultiSelect, type SelectOption } from '@mfs-atomic/ui'
import { capabilityOptions } from './data'
import { fetchCapabilities } from './fetchApi'

const tags = ref<string[]>(['responsive', 'a11y'])
const options = ref<SelectOption[]>(capabilityOptions)

onMounted(async () => {
  options.value = await fetchCapabilities()
})
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

const multiSelectCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: multiSelectCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { SelectOption } from '@mfs-atomic/ui'

export const capabilityOptions: SelectOption[] = [
  { label: 'Responsive', value: 'responsive' },
  { label: 'Accessible (a11y)', value: 'a11y' },
  { label: 'Claymorphism', value: 'clay' },
  { label: 'Glassmorphism', value: 'glass' }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { SelectOption } from '@mfs-atomic/ui'

export async function fetchCapabilities(): Promise<SelectOption[]> {
  const res = await fetch('/api/capabilities')
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

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
import { Slider } from '@mfs-atomic/ui'

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
import { Rating } from '@mfs-atomic/ui'

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
import { ColorPicker } from '@mfs-atomic/ui'

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
import { DatePicker } from '@mfs-atomic/ui'

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

// ── Chips state & docs ─────────────────────────────────────────────────
const chipTags = ref(['vue3', 'mfs-theme', 'clay'])

const chipsCode = `<template>
  <Chips
    v-model="tags"
    label="Project Tags"
    :max="6"
    placeholder="Add tag and press Enter..."
    hint="Up to 6 tags. Press comma or Enter to add."
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Chips } from '@mfs-atomic/ui'

const tags = ref<string[]>(['vue3', 'mfs-theme', 'clay'])
<\/script>`

const chipsApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'string[]', default: '[]', description: 'Array of tag strings.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Input placeholder when below max.' },
    { name: 'separator', type: 'string', default: "','", description: 'Character splitting pasted or typed tags.' },
    { name: 'max', type: 'number', description: 'Maximum number of allowed tags.' },
    { name: 'allowDuplicate', type: 'boolean', default: 'false', description: 'Permits duplicate tag values.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables adding and removing tags.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies invalid visual state.' },
    { name: 'label', type: 'string', description: 'Field label.' },
    { name: 'hint', type: 'string', description: 'Helper text.' },
    { name: 'error', type: 'string', description: 'Validation error message.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'string[]', description: 'Emitted when tags are added or removed.' },
    { name: 'add', type: 'string', description: 'Emitted with each newly added tag.' },
    { name: 'remove', type: 'string', description: 'Emitted with the removed tag.' }
  ]
}

// ── CheckboxGroup state & docs ─────────────────────────────────────────
const selectedChannels = ref<string[]>(['email', 'push'])
const channelOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Push', value: 'push' },
  { label: 'SMS', value: 'sms' },
  { label: 'Webhook (Locked)', value: 'webhook', disabled: true }
]

const checkboxGroupCode = `<template>
  <CheckboxGroup
    v-model="selected"
    name="channels"
    direction="row"
    :options="options"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckboxGroup } from '@mfs-atomic/ui'

const selected = ref<string[]>(['email', 'push'])
const options = [
  { label: 'Email', value: 'email' },
  { label: 'Push', value: 'push' },
  { label: 'SMS', value: 'sms' },
  { label: 'Webhook (Locked)', value: 'webhook', disabled: true }
]
<\/script>`

const checkboxGroupApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'unknown[]', default: '[]', description: 'Array of selected option values.' },
    { name: 'options', type: 'CheckboxGroupOption[]', default: '[]', description: 'Array of { label, value, disabled? }.' },
    { name: 'direction', type: "'row' | 'column'", default: "'row'", description: 'Layout direction of checkboxes.' },
    { name: 'name', type: 'string', description: 'Optional shared group name.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all checkboxes in the group.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies invalid group state.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'unknown[]', description: 'Emitted when selection changes.' },
    { name: 'change', type: 'unknown[]', description: 'Emitted on toggle.' }
  ],
  slots: [{ name: 'default', description: 'Custom Checkbox children consuming injected group context.' }]
}

// ── RadioButtonGroup state & docs ──────────────────────────────────────
const selectedPlan = ref('pro')
const planOptions = [
  { label: 'Starter — Free', value: 'starter' },
  { label: 'Pro — $19/mo', value: 'pro' },
  { label: 'Enterprise (Contact Sales)', value: 'enterprise', disabled: true }
]

const radioButtonGroupCode = `<template>
  <RadioButtonGroup
    v-model="plan"
    name="billing-plan"
    direction="column"
    :options="options"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RadioButtonGroup } from '@mfs-atomic/ui'

const plan = ref('pro')
const options = [
  { label: 'Starter — Free', value: 'starter' },
  { label: 'Pro — $19/mo', value: 'pro' },
  { label: 'Enterprise (Contact Sales)', value: 'enterprise', disabled: true }
]
<\/script>`

const radioButtonGroupApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'unknown', description: 'Selected option value.' },
    { name: 'options', type: 'RadioGroupOption[]', default: '[]', description: 'Array of { label, value, disabled? }.' },
    { name: 'direction', type: "'row' | 'column'", default: "'row'", description: 'Layout direction of radios.' },
    { name: 'name', type: 'string', description: 'Shared HTML radio group name.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all radio buttons.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies invalid group outline.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'unknown', description: 'Emitted when active radio changes.' },
    { name: 'change', type: 'unknown', description: 'Emitted on selection.' }
  ],
  slots: [{ name: 'default', description: 'Custom RadioButton children consuming injected group context.' }]
}

// ── Form & FormField state & docs ──────────────────────────────────────
const formServerErrors = ref<Record<string, string | string[]>>({})
const formSubmitting = ref(false)
const formStatus = ref('Idle')

const formResolver = (values: Record<string, unknown>) => {
  const errs: Record<string, string | undefined> = {}
  if (!String(values.name ?? '').trim()) {
    errs.name = 'Full name is required.'
  }
  const email = String(values.email ?? '').trim()
  if (!email || !email.includes('@')) {
    errs.email = 'Valid work email is required.'
  }
  return errs
}

const simulate422 = () => {
  formServerErrors.value = {
    email: ['The email has already been taken. (422)']
  }
  formStatus.value = '422 Unprocessable Entity'
}

const onFormSubmit = (payload: MfsFormSubmitPayload) => {
  if (!payload.valid) {
    formStatus.value = 'Client validation failed'
    return
  }
  formSubmitting.value = true
  formServerErrors.value = {}
  formStatus.value = 'Submitting...'
  setTimeout(() => {
    formSubmitting.value = false
    formStatus.value = 'Submitted (200 OK)'
  }, 400)
}

const onFormReset = () => {
  formServerErrors.value = {}
  formStatus.value = 'Reset'
}

const formCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Form, FormField, Input, type MfsFormSubmitPayload } from '@mfs-atomic/ui'
import { initialValues, profileResolver, type FormErrors } from './data'
import { submitProfile } from './fetchApi'

const serverErrors = ref<FormErrors>({})
const submitting = ref(false)

const onSubmit = async (payload: MfsFormSubmitPayload) => {
  if (!payload.valid) return
  submitting.value = true
  serverErrors.value = {}
  try {
    const result = await submitProfile(payload.values)
    if (result.errors) serverErrors.value = result.errors
  } finally {
    submitting.value = false
  }
}
<\/script>

<template>
  <Form
    :initial-values="initialValues"
    :errors="serverErrors"
    :resolver="profileResolver"
    :submitting="submitting"
    @submit="onSubmit"
  >
    <FormField name="name" label="Full Name" required>
      <template #default="{ value, error, setValue }">
        <Input id="name" :model-value="String(value ?? '')" :error="error" @update:model-value="setValue($event)" />
      </template>
    </FormField>
    <FormField name="email" label="Work Email" required>
      <template #default="{ value, error, setValue }">
        <Input id="email" :model-value="String(value ?? '')" :error="error" @update:model-value="setValue($event)" />
      </template>
    </FormField>
    <Button type="submit" variant="primary" :loading="submitting">Submit</Button>
  </Form>
</template>`

const formCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: formCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `export type FormErrors = Record<string, string | string[]>

export interface ProfileFormValues {
  name: string
  email: string
}

export const initialValues: ProfileFormValues = {
  name: 'Alya Putri',
  email: 'alya@example.com'
}

export function profileResolver(values: Record<string, unknown>) {
  const errs: Record<string, string | undefined> = {}
  if (!String(values.name ?? '').trim()) errs.name = 'Full name is required.'
  const email = String(values.email ?? '').trim()
  if (!email || !email.includes('@')) errs.email = 'Valid work email is required.'
  return errs
}`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { FormErrors } from './data'

export async function submitProfile(
  values: Record<string, unknown>
): Promise<{ ok: boolean; errors?: FormErrors }> {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values)
  })
  if (res.status === 422) {
    const body = await res.json()
    return { ok: false, errors: body.errors }
  }
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return { ok: true }
}`
  }
]

const formApi: ApiSpec = {
  props: [
    { name: 'initialValues', type: 'Record<string, unknown>', description: 'Initial field values map.' },
    { name: 'errors', type: 'Record<string, string | string[]>', description: 'External/422 server error map keyed by field name.' },
    { name: 'resolver', type: '(values) => Record<string, string | undefined>', description: 'Client-side validation resolver.' },
    { name: 'submitting', type: 'boolean', default: 'false', description: 'Exposes submitting state to slot.' },
    { name: 'validateOnSubmit', type: 'boolean', default: 'true', description: 'Runs resolver before emitting submit.' }
  ],
  events: [
    { name: 'submit', type: '(payload: MfsFormSubmitPayload)', description: 'Emitted on submit with { values, valid, errors }.' },
    { name: 'reset', type: '()', description: 'Emitted when form is reset.' }
  ],
  slots: [
    { name: 'default', description: 'Form body receiving { values, errors, submitting, reset, validate }.' }
  ]
}

// ── Mentions state & docs ──────────────────────────────────────────────
const mentionDirectory: MentionOption[] = [
  { label: 'Alya Putri', value: 'alya', description: 'Design Lead' },
  { label: 'Bima Pratama', value: 'bima', description: 'Frontend Engineer' },
  { label: 'Citra Lestari', value: 'citra', description: 'QA Specialist' },
  { label: 'Dimas Wijaya', value: 'dimas', description: 'Backend Engineer' },
  { label: 'Eka Saputra', value: 'eka', description: 'Product Manager' }
]
const mentionText = ref('Assigning review to ')
const mentionOptions = ref<MentionOption[]>(mentionDirectory)
const mentionLoading = ref(false)
const lastMentioned = ref('')
let mentionTimer: ReturnType<typeof setTimeout> | null = null

const onMentionSearch = ({ query }: { trigger: string; query: string }) => {
  if (mentionTimer) clearTimeout(mentionTimer)
  mentionLoading.value = true
  const q = query.trim().toLowerCase()
  mentionTimer = setTimeout(() => {
    mentionOptions.value = q
      ? mentionDirectory.filter(
          (u) => u.label.toLowerCase().includes(q) || u.value.toLowerCase().includes(q)
        )
      : mentionDirectory
    mentionLoading.value = false
  }, 220)
}

const onMentionSelect = (option: MentionOption) => {
  lastMentioned.value = `@${option.value} (${option.label})`
}

const mentionsCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Mentions, type MentionOption } from '@mfs-atomic/ui'
import { mentionDirectory } from './data'
import { searchMentions } from './fetchApi'

const text = ref('Assigning review to ')
const options = ref<MentionOption[]>(mentionDirectory)
const loading = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const onSearch = ({ query }: { trigger: string; query: string }) => {
  clearTimeout(timer)
  loading.value = true
  timer = setTimeout(async () => {
    options.value = await searchMentions(query)
    loading.value = false
  }, 220)
}
<\/script>

<template>
  <Mentions v-model="text" :options="options" :loading="loading" remote @search="onSearch" />
</template>`

const mentionsCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: mentionsCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { MentionOption } from '@mfs-atomic/ui'

export const mentionDirectory: MentionOption[] = [
  { label: 'Alya Putri', value: 'alya', description: 'Design Lead' },
  { label: 'Bima Pratama', value: 'bima', description: 'Frontend Engineer' },
  { label: 'Citra Lestari', value: 'citra', description: 'QA Specialist' }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { MentionOption } from '@mfs-atomic/ui'

export async function searchMentions(query: string): Promise<MentionOption[]> {
  const params = new URLSearchParams({ q: query })
  const res = await fetch(\`/api/users/mentions?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

const mentionsApi: ApiSpec = {
  props: [
    { name: 'modelValue', type: 'string', default: "''", description: 'Bound textarea text.' },
    { name: 'options', type: 'MentionOption[]', default: '[]', description: 'Suggestion items ({ label, value, description? }).' },
    { name: 'triggers', type: 'string[]', default: "['@']", description: 'Trigger characters opening the popup.' },
    { name: 'remote', type: 'boolean', default: 'false', description: 'Disables local filtering so parent controls options.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner inside dropdown.' },
    { name: 'emptyText', type: 'string', default: "'No matches found'", description: 'Fallback text when no options match.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: string)', description: 'Emitted when text changes or mention is inserted.' },
    { name: 'search', type: '(payload: { trigger: string; query: string })', description: 'Emitted as user types after a trigger.' },
    { name: 'select', type: '(option: MentionOption)', description: 'Emitted when a suggestion is selected.' }
  ]
}
</script>

<style scoped>
.demo-group-title {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.demo-readout code {
  font-family: var(--font-mono);
  word-break: break-word;
}

.demo-color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.15));
  flex-shrink: 0;
}
</style>
