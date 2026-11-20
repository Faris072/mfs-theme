<template>
  <div
    class="mfs-terminal mfs-rounded mfs-shadow-card mfs-blur"
    @click="focusInput"
  >
    <div v-if="welcomeMessage" class="mfs-terminal__welcome">{{ welcomeMessage }}</div>

    <div ref="logRef" class="mfs-terminal__logs">
      <div v-for="(entry, idx) in entries" :key="idx" class="mfs-terminal__entry">
        <div class="mfs-terminal__cmd-line">
          <span class="mfs-terminal__prompt">{{ prompt }}</span>
          <span class="mfs-terminal__cmd">{{ entry.command }}</span>
        </div>
        <div v-if="entry.response" class="mfs-terminal__response">{{ entry.response }}</div>
      </div>
    </div>

    <form class="mfs-terminal__input-row" @submit.prevent="submitCommand">
      <span class="mfs-terminal__prompt">{{ prompt }}</span>
      <input
        ref="inputRef"
        v-model="currentInput"
        type="text"
        class="mfs-terminal__input"
        autocomplete="off"
        spellcheck="false"
        aria-label="Terminal command input"
        @keydown.up.prevent="historyUp"
        @keydown.down.prevent="historyDown"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

export interface TerminalCommandPayload {
  command: string
  args: string[]
  raw: string
  respond: (output: string) => void
}

interface TerminalEntry {
  command: string
  response?: string
}

const props = withDefaults(
  defineProps<{
    welcomeMessage?: string
    prompt?: string
    commands?: Record<string, (args: string[]) => string | Promise<string>>
  }>(),
  {
    welcomeMessage: '',
    prompt: '$'
  }
)

const emit = defineEmits<{
  (e: 'command', payload: TerminalCommandPayload): void
}>()

const entries = ref<TerminalEntry[]>([])
const history = ref<string[]>([])
const historyIdx = ref(-1)
const currentInput = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const logRef = ref<HTMLElement | null>(null)

const focusInput = () => {
  inputRef.value?.focus()
}

const scrollToBottom = async () => {
  await nextTick()
  if (logRef.value) {
    logRef.value.scrollTop = logRef.value.scrollHeight
  }
}

const submitCommand = async () => {
  const raw = currentInput.value.trim()
  if (!raw) return

  currentInput.value = ''
  history.value.push(raw)
  historyIdx.value = history.value.length

  const [cmd, ...args] = raw.split(/\s+/)
  if (cmd === 'clear') {
    entries.value = []
    return
  }

  const entry: TerminalEntry = { command: raw }
  entries.value.push(entry)
  const index = entries.value.length - 1

  const respond = (output: string) => {
    entries.value[index].response = output
    void scrollToBottom()
  }

  if (props.commands && cmd in props.commands) {
    const res = await props.commands[cmd](args)
    respond(res)
  } else {
    emit('command', { command: cmd, args, raw, respond })
  }

  void scrollToBottom()
}

const historyUp = () => {
  if (history.value.length === 0) return
  historyIdx.value = Math.max(0, historyIdx.value - 1)
  currentInput.value = history.value[historyIdx.value] ?? ''
}

const historyDown = () => {
  if (history.value.length === 0) return
  historyIdx.value = Math.min(history.value.length, historyIdx.value + 1)
  currentInput.value = history.value[historyIdx.value] ?? ''
}

defineExpose({ clear: () => { entries.value = [] } })
</script>

<style scoped>
.mfs-terminal {
  font-family: var(--font-mono, monospace);
  font-size: 0.88rem;
  line-height: 1.5;
  padding: 16px;
  background-color: #0f172a;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.14);
  cursor: text;
}

.mfs-terminal__welcome {
  color: #94a3b8;
  margin-bottom: 10px;
}

.mfs-terminal__logs {
  max-height: 260px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mfs-terminal__cmd-line {
  display: flex;
  gap: 8px;
}

.mfs-terminal__prompt {
  color: var(--primary, #38bdf8);
  font-weight: 700;
  user-select: none;
}

.mfs-terminal__response {
  color: #cbd5e1;
  white-space: pre-wrap;
  padding-left: 16px;
  margin-top: 2px;
}

.mfs-terminal__input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.mfs-terminal__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
}

[data-theme="clay"] .mfs-terminal {
  background-color: #1e1538;
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .mfs-terminal {
  background-color: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(16px);
}

[data-theme="neo"] .mfs-terminal {
  background-color: #1e293b;
  box-shadow: var(--clay-shadow);
  border: none;
}
</style>
