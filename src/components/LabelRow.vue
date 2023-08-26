<template>
  <div>
    <div class="row items-center q-gutter-md">
      <span>{{ props.label }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
})

</script>

