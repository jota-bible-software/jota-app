<template>
  <q-btn :value="checked" @click="toggle" dense flat icon="icon-mat-checklist"
    :text-color="checked ? 'primary' : 'disabled'" v-close-popup>
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonBookSelector.selectBook') }}</span>
    <q-tooltip>{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  checked: Boolean,
  inMenu: Boolean,
  menuTitle: String,
})
const emit = defineEmits(['change'])

const tooltip = computed(() => props.checked ? t('buttonBookSelector.hideButtons') : t('buttonBookSelector.showButtons'))

function toggle() {
  emit('change', !props.checked)
}
</script>
