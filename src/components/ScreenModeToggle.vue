<template>
  <div class="row items-center">
    <div class="q-mr-sm">Tryb ekranu:</div>
    <q-btn-toggle v-model="store.persist.screenMode" label="Tryb ekranu" toggle-color="primary" :options="[
      { value: 'dark', slot: 'one' },
      { value: 'light', slot: 'two' },
      { value: 'auto', slot: 'three' }
    ]">
      <template v-slot:one>
        <div class="row items-center no-wrap">
          <q-icon left name="dark_mode" />
          <div class="text-center">
            Ciemny
          </div>
        </div>
      </template>

      <template v-slot:two>
        <div class="row items-center no-wrap">
          <q-icon left name="light_mode" />
          <div class="text-center">
            Jasny
          </div>
        </div>
      </template>

      <template v-slot:three>
        <div class="row items-center no-wrap">
          <q-icon left right name="auto_mode" />
          <div class="text-center">
            Auto
          </div>
        </div>
      </template>
    </q-btn-toggle>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store'

const store = useSettingsStore()
</script>

<style scoped>
</style>
