/** Top header on the screen */
<template>
  <q-toolbar v-if="!isMainRoute" class="q-pa-none">
    <!-- Come back button -->
    <q-btn flat icon="icon-mat-arrow_back_ios" to="/" class="print-hide" :data-tag="tags.pageBackButton">
      <q-tooltip> {{ $t('pageHeader.backToHome') }} </q-tooltip>
    </q-btn>
    <q-toolbar-title class="text-primary page-title"> {{ pageTitle }} </q-toolbar-title>
  </q-toolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'

const { t } = useI18n()

const route = useRoute()
const isMainRoute = computed(() => route.path === '/')

const pageTitle = computed(() => {
  const title = route.meta.title as string
  const prefix = 'Jota' + (title ? ' - ' : '')
  return prefix + (title ? t(title) : '')
})

</script>

<style lang="scss">

</style>
