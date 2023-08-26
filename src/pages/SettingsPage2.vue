<template>
  <q-page class="q-pa-sm q-gutter-sm">

    <div class="row items-center q-gutter-sm">
      <q-select v-model="store.persist.defaultLang" :options="langs" label="Domyślny język" style="min-width: 130px" />
      <LanguageSelector v-model="lang" />
    </div>

    <div class="row items-center q-gutter-sm">
      <ScreenModeToggle />
    </div>

    <TranslationConfig />

    <!-- Settings for languages (start) -->
    <q-separator color="primary" />
    <div class="text-h6">Ustawienia dla języków</div>

    <div class="row ">
      <div class="row col items-center q-gutter-sm">
        <q-select v-model="store.lang" :options="langs" label="Język" style="min-width: 90px" />
        <q-select v-model="store.defaultTranslation" :options="store.localeTranslations" label="Domyślny przekład"
          style="min-width: 150px" />
        <BookNamesEditor label="Nazwy ksiąg na ekranie:" v-model="store.persist.langDefaults[store.lang].appBookNames" />
      </div>
    </div>

    <div class="row">
      <PassageFormatEditor v-model="store.persist.langDefaults[store.lang].passageFormat" />
    </div>


    <q-separator color="primary" />
    Settings for languages (end)

  </q-page>
</template>

<script setup lang="ts">
import { langs } from 'src/logic/data'
import { useSettingsStore } from 'src/stores/settings-store'
import BookNamesEditor from 'src/components/BookNamesEditor.vue'
import LanguageSelector from 'src/components/LanguageSelector.vue'
import ScreenModeToggle from 'src/components/ScreenModeToggle.vue'
import PassageFormatEditor from 'src/components/PassageFormatEditor.vue'
import TranslationConfig from 'src/components/TranslationConfig.vue'
import { ref } from 'vue'

const store = useSettingsStore()
const lang = ref('pl')

</script>
