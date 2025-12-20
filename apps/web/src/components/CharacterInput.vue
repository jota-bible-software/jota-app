<template>
  <q-input v-model="inputValue" class="short-input" dense outlined @keydown="handleEnterKey" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

function handleEnterKey(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    emit('update:modelValue', props.modelValue + '⏎')
  }
}
</script>

<style lang="scss" scoped>
.short-input {
  max-width: 4em;

  :deep(input) {
    text-align: center;
  }
}
</style>
