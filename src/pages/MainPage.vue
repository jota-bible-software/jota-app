<template>
  <q-page id="search" class="q-px-md q-pb-md">
    <MainToolbar />
    <div class="row full-width">
      <BibleSelector v-model="store.currentTranslation" class="q-mr-md lt-md" />

      <q-input ref="input" v-model="store.input" :outlined="false"
        :placeholder="$q.screen.gt.sm ? 'Podaj tekst zawierający odnośniki biblijne lub frazę do wyszukania w tekście przekładu' : 'Odnośnik lub fraza'"
        dense style="margin-top: 0" autofocus @keyup.enter="find(store.input)" @keyup.esc="store.input = ''" full-width
        class="col">
        <template v-slot:append>
          <q-icon v-if="store.input !== ''" name="icon-mat-close" class="cursor-pointer" style="font-size: 0.8em"
            @click="find('')">
            <q-tooltip>Wyczyść kryteria i wyniki wyszukiwania</q-tooltip>
          </q-icon>

          <q-icon name="icon-mat-search" @click="find(store.input)" class="cursor-pointer">
            <q-tooltip>Szukaj</q-tooltip>
          </q-icon>
        </template>

        <template v-slot:after>
          <ButtonWholeWords class="gt-xs" />
          <ButtonBookSelector :checked="store.showPicker" @change="(v: boolean) => store.showPicker = v"
            class="gt-xs" />
        </template>
      </q-input>

      <ButtonHelp class="sm" />
      <ButtonSettings class="sm" />

      <q-btn dense flat icon="icon-mat-more_vert" class="lt-sm">
        <q-menu>
          <q-list style="min-width: 210px">
            <q-item>
              <ButtonWholeWords in-menu />
            </q-item>
            <q-item>
              <ButtonBookSelector :checked="store.showPicker" @change="(v: boolean) => store.showPicker = v" in-menu />
            </q-item>
            <q-item>
              <ButtonHelp in-menu />
            </q-item>
            <q-item>
              <ButtonSettings in-menu />
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <MessageLine />

    <div v-show="store.loading">
      <q-circular-progress indeterminate size="30px" color="accent" class="q-my-md q-mr-md" />
      <span>Pobieranie treści przekładu ...</span>
    </div>

    <ReferencePicker v-if="store.showPicker" />

    <BibleContent />
  </q-page>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useEventListener } from '@vueuse/core'
import { useSearchStore } from 'src/stores/search-store'
import BibleContent from 'src/components/BibleContent.vue'
import BibleSelector from 'src/components/BibleSelector.vue'
import ButtonBookSelector from 'src/components/ButtonBookSelector.vue'
import ButtonWholeWords from 'src/components/ButtonWholeWords.vue'
import ButtonHelp from 'src/components/ButtonHelp.vue'
import ButtonSettings from 'src/components/ButtonSettings.vue'
import ReferencePicker from 'src/components/ReferencePicker.vue'
import MessageLine from 'src/components/MessageLine.vue'
import MainToolbar from 'src/components/MainToolbar.vue'
import { SearchOptions } from 'src/types'

const store = useSearchStore()
const $q = useQuasar()

function find(input: string, opt?: SearchOptions) {
  const options = opt || {}
  store.showPicker = false
  return store.findByInput(input, options)
}

const events = ['orientationchange', 'resize']
events.forEach(eventType => useEventListener(window, eventType, updateSize))

function updateSize() {
  nextTick(() => {
    setTimeout(() => {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }, 1000)
  })
}
updateSize()

</script>

<style>
#search {
  height: calc(var(--vh, 1vh) * 100 + 20px);
  display: flex;
  flex-direction: column;
}

.bottom-clipped {
  min-height: 0;
  overflow: auto;
  height: 100%;
}
</style>
