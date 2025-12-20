<template>
  <span :class="'fi fi-' + props.region"></span>
</template>

<script setup lang="ts">

import '/node_modules/flag-icons/css/flag-icons.min.css'

const props = defineProps(['region'])

</script>

<style scoped>
</style>
