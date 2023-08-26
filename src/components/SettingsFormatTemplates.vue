<template>
  <SettingsPanel title="Szablony formatowania">
    <div class="col">
      <q-list id="templates">
        <q-item v-for="item in store.persist.formatTemplates" :key="item.name" @click="edit()">
          <div class="row items-center q-gutter-md">
            <q-btn outline icon="edit" />
            <div>{{ item.name }}</div>
          </div>
          <!-- <q-item-section side><q-icon name="chevron_right" /> </q-item-section> -->
        </q-item>
      </q-list>
    </div>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BookNamesStandardData } from 'src/types'
import { useSettingsStore } from 'stores/settings-store'
import FormContainer from './FormContainer.vue'
import SettingsPanel from './SettingsPanel.vue'
import SelectList from './SelectList.vue'

const store = useSettingsStore()

</script>

<style scoped lang="scss">
#templates {
  min-width: 400px
}

.q-item__section {
  flex-grow: 0;
}
</style>
