<template>
  <q-page id="search" class="q-px-md q-pb-md">
    <MainToolbar />
    <div class="row full-width">
      <MainBibleSelector class="q-mr-md lt-md" />

      <q-input ref="input" v-model="store.input" :outlined="false"
        :placeholder="$q.screen.gt.sm ? $t('mainPage.placeholderLong') : $t('mainPage.placeholderShort')"
        :disabled="store.loading" dense style="margin-top: 0" autofocus @keyup.enter="find(store.input)"
        @keyup.esc="store.input = ''" full-width class="col" :data-tag="tags.searchInput">
        <template v-slot:append>

          <!-- Clear search -->
          <q-icon v-if="store.input !== ''" name="icon-mat-close" class="cursor-pointer" style="font-size: 0.8em"
            @click="clear" :data-tag="tags.clearSearchButton">
            <q-tooltip>{{ $t('mainPage.clearSearch') }}</q-tooltip>
          </q-icon>

          <q-icon name="icon-mat-search" @click="find(store.input)" class="cursor-pointer">
            <q-tooltip>{{ $t('mainPage.search') }}</q-tooltip>
          </q-icon>
        </template>

        <template v-slot:after>
          <ButtonWholeWords class="gt-xs" />
        </template>
      </q-input>

      <ButtonBookSelector class="sm" />
      <ButtonHelp class="sm" />
      <ButtonSettings class="sm" />

      <q-btn dense flat icon="icon-mat-more_vert" class="lt-sm">
        <q-menu>
          <q-list style="min-width: 210px">
            <q-item>
              <ButtonWholeWords in-menu />
            </q-item>
            <q-item>
              <ButtonBookSelector in-menu />
            </q-item>
            <!-- Make invisible help page is updated -->
            <q-item v-if="false">
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
      <span>{{ $t('mainPage.downloading') }}</span>
    </div>

    <ReferencePicker v-if="store.showPicker" />
    <BibleContent v-else />

  </q-page>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useEventListener } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import BibleContent from 'src/components/BibleContent.vue'
import MainBibleSelector from 'src/components/MainBibleSelector.vue'
import ButtonBookSelector from 'src/components/ButtonBookSelector.vue'
import ButtonWholeWords from 'src/components/ButtonWholeWords.vue'
import ButtonHelp from 'src/components/ButtonHelp.vue'
import ButtonSettings from 'src/components/ButtonSettings.vue'
import ReferencePicker from 'src/components/ReferencePicker.vue'
import MessageLine from 'src/components/MessageLine.vue'
import MainToolbar from 'src/components/MainToolbar.vue'
import { SearchOptions } from 'src/types'
import { useEditionStore } from 'src/stores/edition-store'
import * as tags from 'src/tags'

const $q = useQuasar()
const store = useSearchStore()
const settingsStore = useSettingsStore()
const editionStore = useEditionStore()
const router = useRoute()

onMounted(() => {
  if (router.query.q) {
    setQuery()
  } else if (settingsStore.persist.referencePickerOnStart) {
    store.showPicker = true
  } else {
    store.setChapterFragment([0, 0, 0, 0])
  }
})

function setQuery() {
  store.input = router.query.q as string
  editionStore.startPromise.then(() => find(store.input))
}

watch(() => router.query.q, setQuery)

function find(input: string, opt?: SearchOptions) {
  const options = opt || {}
  store.showPicker = !input
  return store.findByInput(input, options)
}

function clear() {
  store.input = ''
  find('')
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
  /* height: calc(var(--vh, 1vh) * 100 + 20px); */
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.bottom-clipped {
  min-height: 0;
  overflow: auto;
  height: 100%;
}
</style>
