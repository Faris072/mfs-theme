<template>
  <div class="utilities-demo">
    <ComponentPreview
      title="Theme-Adaptive .mfs-* Utilities"
      description="Compose custom cards, inset inputs, interactive surfaces, and semantic badges without writing theme-specific CSS."
      :code="snippetCode"
    >
      <div class="mfs-stack">
        <div class="mfs-grid">
          <div class="mfs-card mfs-stack">
            <div class="mfs-row" style="justify-content: space-between;">
              <strong class="mfs-text">Surface Card</strong>
              <span class="mfs-pill mfs-bg-primary demo-badge">Primary</span>
            </div>
            <p class="mfs-text-muted demo-copy">
              Adapts shadow, border, radius, and blur across Clay, Glass, and Neo.
            </p>
            <div class="mfs-row">
              <span class="mfs-pill mfs-bg-success demo-badge">Success</span>
              <span class="mfs-pill mfs-bg-warning demo-badge">Warning</span>
              <span class="mfs-pill mfs-bg-danger demo-badge">Danger</span>
            </div>
          </div>

          <div class="mfs-surface mfs-rounded-lg mfs-shadow mfs-stack demo-pad">
            <label class="mfs-text demo-label" for="mfs-util-input">Inset Input Surface</label>
            <input
              id="mfs-util-input"
              v-model="sampleText"
              type="text"
              class="mfs-inset demo-input"
              placeholder="Type to test..."
            />
            <div class="mfs-row">
              <button
                type="button"
                class="mfs-surface-subtle mfs-rounded-md mfs-shadow mfs-interactive demo-btn"
                @click="clicks++"
              >
                Interactive ({{ clicks }})
              </button>
              <span class="mfs-text-primary demo-status">{{ sampleText || 'Ready' }}</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentPreview>

    <section class="cheatsheet-card">
      <header class="cheatsheet-header">
        <div>
          <h3 class="cheatsheet-title">Utility Class Cheat Sheet</h3>
          <p class="cheatsheet-desc">All `.mfs-*` classes included in `mfs-theme`.</p>
        </div>
      </header>

      <div class="cheatsheet-table-wrap">
        <table class="cheatsheet-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Category</th>
              <th>Purpose</th>
              <th>Copy</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in utilityRows" :key="row.name">
              <td><code class="class-code">.{{ row.name }}</code></td>
              <td><span class="cat-pill">{{ row.category }}</span></td>
              <td class="purpose-cell">{{ row.purpose }}</td>
              <td>
                <button
                  type="button"
                  class="mini-copy-btn"
                  :class="{ 'is-copied': copiedClass === row.name }"
                  :aria-label="`Copy ${row.name}`"
                  @click="copyClass(row.name)"
                >
                  <Check v-if="copiedClass === row.name" :size="13" />
                  <Copy v-else :size="13" />
                  <span>{{ copiedClass === row.name ? 'Copied' : 'Copy' }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import ComponentPreview from '../ComponentPreview.vue'

defineProps<{
  activeSlug?: string
}>()

const sampleText = ref('MFS Utilities')
const clicks = ref(0)
const copiedClass = ref<string | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const copyClass = async (name: string) => {
  try {
    await navigator.clipboard.writeText(name)
    copiedClass.value = name
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      copiedClass.value = null
    }, 1400)
  } catch {
    // Ignore clipboard errors in restricted environments
  }
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

const snippetCode = `<div class="mfs-grid">
  <div class="mfs-card mfs-stack">
    <div class="mfs-row">
      <strong class="mfs-text">Surface Card</strong>
      <span class="mfs-pill mfs-bg-primary">Primary</span>
    </div>
    <p class="mfs-text-muted">Adapts to Clay, Glass, and Neo.</p>
  </div>

  <div class="mfs-surface mfs-rounded-lg mfs-shadow mfs-stack">
    <input class="mfs-inset" placeholder="Inset input..." />
    <button class="mfs-surface-subtle mfs-rounded-md mfs-shadow mfs-interactive">
      Interactive
    </button>
  </div>
</div>`

const utilityRows = [
  { name: 'mfs-bg', category: 'Surface', purpose: 'Theme page background gradient and base text color' },
  { name: 'mfs-surface', category: 'Surface', purpose: 'Primary surface background, border, and backdrop blur' },
  { name: 'mfs-surface-subtle', category: 'Surface', purpose: 'Subtle secondary surface with theme border' },
  { name: 'mfs-card', category: 'Surface', purpose: 'Full card surface with radius, card shadow, and padding' },
  { name: 'mfs-inset', category: 'Surface', purpose: 'Recessed input/well surface with inset shadow' },
  { name: 'mfs-shadow', category: 'Shadow', purpose: 'Standard theme elevation shadow (--clay-shadow)' },
  { name: 'mfs-shadow-card', category: 'Shadow', purpose: 'Card-level elevation shadow (--card-shadow)' },
  { name: 'mfs-shadow-inset', category: 'Shadow', purpose: 'Recessed inset shadow (--input-shadow)' },
  { name: 'mfs-interactive', category: 'Shadow', purpose: 'Hover lift and active press tactile shadow feedback' },
  { name: 'mfs-blur', category: 'Shadow', purpose: 'Theme backdrop blur filter' },
  { name: 'mfs-rounded', category: 'Radius', purpose: 'Theme default border radius (--radius)' },
  { name: 'mfs-rounded-sm', category: 'Radius', purpose: 'Small border radius (--radius-sm)' },
  { name: 'mfs-rounded-md', category: 'Radius', purpose: 'Medium border radius (--radius-md)' },
  { name: 'mfs-rounded-lg', category: 'Radius', purpose: 'Large border radius (--radius-lg)' },
  { name: 'mfs-pill', category: 'Radius', purpose: 'Full pill border radius (9999px)' },
  { name: 'mfs-border', category: 'Radius', purpose: '1px solid theme border (--border)' },
  { name: 'mfs-text', category: 'Color', purpose: 'Primary theme text color' },
  { name: 'mfs-text-muted', category: 'Color', purpose: 'Muted secondary text color' },
  { name: 'mfs-text-primary', category: 'Color', purpose: 'Primary accent text color' },
  { name: 'mfs-text-secondary', category: 'Color', purpose: 'Secondary accent text color' },
  { name: 'mfs-text-success', category: 'Color', purpose: 'Success semantic text color' },
  { name: 'mfs-text-warning', category: 'Color', purpose: 'Warning semantic text color' },
  { name: 'mfs-text-danger', category: 'Color', purpose: 'Danger semantic text color' },
  { name: 'mfs-bg-primary', category: 'Color', purpose: 'Primary accent background + contrast text' },
  { name: 'mfs-bg-secondary', category: 'Color', purpose: 'Secondary accent background + contrast text' },
  { name: 'mfs-bg-success', category: 'Color', purpose: 'Success background + contrast text' },
  { name: 'mfs-bg-warning', category: 'Color', purpose: 'Warning background + contrast text' },
  { name: 'mfs-bg-danger', category: 'Color', purpose: 'Danger background + contrast text' },
  { name: 'mfs-container', category: 'Layout', purpose: 'Centered max-width container with inline padding' },
  { name: 'mfs-stack', category: 'Layout', purpose: 'Vertical flex column with 16px gap' },
  { name: 'mfs-row', category: 'Layout', purpose: 'Horizontal wrapping flex row with 12px gap' },
  { name: 'mfs-grid', category: 'Layout', purpose: 'Responsive auto-fit CSS grid (min 220px)' }
]
</script>

<style scoped>
.utilities-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-pad {
  padding: 20px;
}

.demo-copy {
  font-size: 0.86rem;
  margin: 0;
}

.demo-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 4px 10px;
}

.demo-label {
  font-size: 0.84rem;
  font-weight: 600;
}

.demo-input {
  width: 100%;
  padding: 9px 12px;
  font-size: 0.88rem;
  outline: none;
}

.demo-btn {
  padding: 8px 14px;
  font-size: 0.84rem;
  font-weight: 600;
}

.demo-status {
  font-size: 0.82rem;
  font-weight: 600;
}

.cheatsheet-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg, 18px);
  overflow: hidden;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.cheatsheet-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-subtle);
}

.cheatsheet-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.cheatsheet-desc {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.cheatsheet-table-wrap {
  overflow-x: auto;
}

.cheatsheet-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.83rem;
}

.cheatsheet-table th,
.cheatsheet-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  vertical-align: middle;
}

.cheatsheet-table th {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: var(--surface-subtle);
}

.cheatsheet-table tbody tr:last-child td {
  border-bottom: none;
}

.class-code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
}

.cat-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.purpose-cell {
  color: var(--text-muted);
}

.mini-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.mini-copy-btn:hover,
.mini-copy-btn.is-copied {
  border-color: var(--primary);
  color: var(--primary);
}
</style>
