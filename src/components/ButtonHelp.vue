<template>
  <q-btn flat dense no-caps icon="icon-mat-help" color="primary" :to="helpLink" v-close-popup class="help-button">
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonHelp.help') }}</span>
    <q-tooltip>{{ $t('buttonHelp.help') }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  inMenu: Boolean,
  section: {
    type: String,
    default: ''
  }
})

const helpLink = computed(() => {
  if (props.section) {
    return `/manual?section=${props.section}`
  }
  return '/manual'
})
</script>

<style lang="scss">
.help-button {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--q-accent);
    transform: translate(25%, -25%);
  }
}
</style>
