<template>
  <div class="text-primary q-py-sm gt-sm">
    <!-- Show only on the main page -->
    <div class="row no-wrap items-center">
      <div class="gt-sm page-title"> Jota </div>
      <q-space />
      <span id="translation-label" class="text-secondary q-mr-sm">{{ $t('mainToolbar.translationLabel') }}</span>
      <MainBibleSelector class="q-pr-sm gt-sm" />

      <ButtonBookSelector />
      <ButtonHelp />
      <ButtonSettings />
    </div>
  </div>
</template>

<script setup lang="ts">
import MainBibleSelector from 'src/components/MainBibleSelector.vue'
import ButtonHelp from 'src/components/ButtonHelp.vue'
import ButtonSettings from 'src/components/ButtonSettings.vue'
import ButtonBookSelector from 'src/components/ButtonBookSelector.vue'
</script>

<style lang="scss" scoped></style>
