<template>
  <div class="row items-center">
    <div class="q-mr-sm">{{ $t('screenModeToggle.screenMode') }}</div>
    <q-btn-toggle :data-tag="tags.settingsScreenMode" v-model="store.persist.appearance.screenMode" :label="$t('screenModeToggle.screenMode')"
      toggle-color="primary" :options="[
        { value: 'dark', slot: 'one' },
        { value: 'light', slot: 'two' },
        { value: 'auto', slot: 'three' }
      ]">
      <template v-slot:one>
        <div class="row items-center no-wrap">
          <q-icon left name="dark_mode" />
          <div class="text-center">
            {{ $t('screenModeToggle.darkMode') }}
          </div>
        </div>
      </template>

      <template v-slot:two>
        <div class="row items-center no-wrap">
          <q-icon left name="light_mode" />
          <div class="text-center">
            {{ $t('screenModeToggle.lightMode') }}
          </div>
        </div>
      </template>

      <template v-slot:three>
        <div class="row items-center no-wrap">
          <q-icon left right name="auto_mode" />
          <div class="text-center">
            {{ $t('screenModeToggle.autoMode') }}
          </div>
        </div>
      </template>
    </q-btn-toggle>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store'
import * as tags from 'src/tags'

const store = useSettingsStore()
</script>

<style scoped></style>
