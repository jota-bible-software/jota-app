<template v-slot:after>
  <q-btn :value="store.words" @click="toggle" dense flat icon="icon-mdi-arrow-expand-horizontal"
    :text-color="store.words ? 'primary' : 'disabled'" v-close-popup>
    <q-tooltip>{{ tooltip }}</q-tooltip>
    <span v-if="inMenu" class="button-menu-item">Wyszukaj całe słowa</span>
  </q-btn>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useSearchStore } from 'src/stores/search-store'

const store = useSearchStore()

defineProps({
  inMenu: Boolean,
})

const tooltip = computed(() => (store.words ? 'Wy' : 'W') + 'łącz wyszukiwanie całych słów')

function toggle() {
  store.words = !store.words
}

</script>
