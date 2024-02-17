<template>
  <!-- notice dialogRef here -->
  <q-dialog v-model="model">
    <q-card class="q-dialog-plugin">
      <q-card-section>{{ props.message }}</q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="close('ok')" />
        <q-btn label="Cancel" @click="close('cancel')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({ message: String, modelValue: Boolean })
const emit = defineEmits(['cancel', 'ok', 'update:modelValue'])

const model = computed({
  get(): boolean {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  }
})

function close(event: 'cancel' | 'ok') {
  model.value = false
  emit(event)
}
</script>

<style lang="scss" scoped>
</style>
