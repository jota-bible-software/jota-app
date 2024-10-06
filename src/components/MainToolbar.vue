<template>
  <div class="text-primary q-py-sm gt-sm">
    <!-- Show only on the main page -->
    <div class="row no-wrap items-center">
      <div class="gt-sm page-title"> Jota </div>
      <q-space />
      <span id="edition-label" class="text-secondary q-mr-sm">{{ $t('mainToolbar.editionLabel') }}</span>
      <BibleSelector :model-value="store.currentEdition" @update:model-value="value => store.currentKey = value"
        :editions="store.editionsGrouped" flag="true" class="q-pr-sm gt-sm" />

      <ButtonHelp />
      <ButtonSettings />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditionStore } from 'src/stores/edition-store'
import BibleSelector from 'src/components/BibleSelector.vue'
import ButtonHelp from 'src/components/ButtonHelp.vue'
import ButtonSettings from 'src/components/ButtonSettings.vue'

const store = useEditionStore()

</script>

<style lang="scss" scoped></style>
