<template>
  <div
    class="mfs-terminal mfs-w-full mfs-overflow-hidden mfs-surface mfs-font-mono mfs-rounded mfs-shadow-card mfs-blur mfs-p-4"
    @click="focusInput"
  >
    <div v-if="welcomeMessage" class="mfs-terminal__welcome mfs-text-muted">{{ welcomeMessage }}</div>

    <div ref="logRef" class="mfs-terminal__logs mfs-overflow-y-auto mfs-flex mfs-flex-col mfs-gap-1-5">
      <div v-for="(entry, idx) in entries" :key="idx" class="mfs-terminal__entry">
        <div class="mfs-flex mfs-gap-2">
          <span class="mfs-text-primary mfs-font-bold mfs-select-none">{{ prompt }}</span>
          <span class="mfs-terminal__cmd mfs-break-words">{{ entry.command }}</span>
        </div>
        <div v-if="entry.response" class="mfs-terminal__response mfs-break-words">{{ entry.response }}</div>
      </div>
    </div>

    <form class="mfs-flex mfs-items-center mfs-gap-2 mfs-mt-2" @submit.prevent="submitCommand">
      <span class="mfs-text-primary mfs-font-bold mfs-select-none">{{ prompt }}</span>
      <input
        ref="inputRef"
        v-model="currentInput"
        type="text"
        class="mfs-terminal__input mfs-flex-1 mfs-bg-transparent mfs-border-none mfs-outline-none"
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
  font-size: 0.88rem;
  line-height: 1.5;
  cursor: text;
}

.mfs-terminal__welcome {
  margin-bottom: 10px;
}

.mfs-terminal__logs {
  max-height: 260px;
}

.mfs-terminal__response {
  color: color-mix(in srgb, var(--text) 85%, var(--text-muted));
  white-space: pre-wrap;
  padding-left: 16px;
  margin-top: 2px;
}

.mfs-terminal__input {
  color: inherit;
  font-family: inherit;
  font-size: inherit;
}

@media (max-width: 640px) {
  .mfs-terminal {
    font-size: 0.8rem;
    padding: 12px;
  }
}
</style>
