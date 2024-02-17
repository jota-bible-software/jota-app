<template>
  <div>
    <div class="row items-center q-gutter-md">
      <div v-if="!!props.label" :style="styleObject">{{ props.label }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps({
  label: String,
  lifted: Boolean
})

const styleObject = reactive({
  paddingBottom: props.lifted ? '20px' : 'inherit'
})

</script>

