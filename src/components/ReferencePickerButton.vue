<template>
  <q-btn outline no-caps dense :color="color" class="q-px-sm" @click="$emit('select')">
    {{ value }}
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['value', 'alternate'])
const color = computed(() => props.alternate === 1 ? 'primary' : props.alternate === 2 ? 'accent' : '')
</script>

<style lang="scss" scoped>
.q-btn {
  min-width: 36px;
}

.q-btn--outline:before {
  background: var(--q-background-05);
  border: 1px solid var(--q-border);
}
</style>
