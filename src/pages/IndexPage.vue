<template>
  <div class="row">
    <q-input />
    <q-input />
    <q-input />
    <q-input />
    <q-page class="col q-px-lg q-pb-md" style="max-width: 400px">
      <div class="row">

        <BibleSelector />
      </div>
      <!-- <TranslationConfig /> -->
    </q-page>
  </div>
</template>

<script setup lang="ts">
import TranslationConfig from 'src/components/TranslationConfig.vue'
import BotCmp from 'src/components/BotCmp.vue'
import BibleSelector from 'src/components/BibleSelector.vue'

</script>
