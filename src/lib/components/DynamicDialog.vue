<template>
  <Modal
    v-for="dialog in dialogs"
    :key="dialog.id"
    :model-value="true"
    :title="dialog.options.header"
    @update:model-value="(visible) => !visible && close(dialog.id)"
  >
    <div :style="dialog.options.width ? { width: dialog.options.width, maxWidth: '100%' } : undefined">
      <DialogContent
        :component="(dialog.component as Component)"
        :component-props="dialog.options.props"
        :on-close="(data) => close(dialog.id, data)"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { defineComponent, h, provide, type Component, type PropType } from 'vue'
import Modal from './Modal.vue'
import { useDialog, type DialogRef } from '../composables/useDialog'

const { dialogs, close } = useDialog()

const DialogContent = defineComponent({
  name: 'MfsDynamicDialogContent',
  props: {
    component: {
      type: Object as PropType<Component>,
      required: true
    },
    componentProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({})
    },
    onClose: {
      type: Function as PropType<(data?: unknown) => void>,
      required: true
    }
  },
  setup(props) {
    const dialogRef: DialogRef = {
      close: (data?: unknown) => props.onClose(data)
    }
    provide('dialogRef', dialogRef)

    return () => h(props.component, props.componentProps)
  }
})
</script>
