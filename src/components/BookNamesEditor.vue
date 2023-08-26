<template>
  <div>
    <!-- Button to show list of book namings -->
    {{ label }}
    <q-btn @click="showList = !showList">
      Wybierz z listy
    </q-btn>

  </div>

  <!-- Book naming list -->
  <BookNamingList v-if="showList" v-model="selected" />

  <div style="width: 100%">
    <!-- Edit books names manually  -->

    <q-input v-model="bookNamesText" stack-label autogrow>
      <!-- @focus="store.showSelectButton = true" @blur="blurText"> -->
      <!-- <template v-slot:append>
          <q-select v-model="store.selectedBookNaming" :options="store.bookNamings" flat :outlined="false" />
        </template> -->
    </q-input>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BookNamingList from './BookNamingList.vue'
// import { useSettingsStore } from 'src/stores/settings-store'

const props = defineProps(['modelValue', 'label'])
const emit = defineEmits(['update:modelValue'])

// const store = useSettingsStore()

const bookNamesText = computed({
  get(): string {
    return props.modelValue ? props.modelValue.join(', ') : ''
  },
  set(value: string) {
    emit('update:modelValue', value.split(',').map(_ => _.trim()))
  }
})

const showList = ref(false)
const selected = ref(bookNamesText.value)

watch(selected, value => {
  emit('update:modelValue', value.split(',').map(_ => _.trim()))
  showList.value = false
})

// const button = ref(QBtn)
// const input = ref(QInput)
// const list = ref(QBtn)

// function blurText(e: Event) {
//   if ((e as MouseEvent).relatedTarget !== button.value.$el) store.showSelectButton = false
// }
// function blurButton(e: Event) {
//   const blurred = (e as MouseEvent).relatedTarget
//   console.log('blur button', blurred)
//   if (blurred !== input.value.$el && blurred !== list.value?.$el) store.showSelectButton = false
// }
</script>

<style lang="scss">
.toggle-icon i {
  transform: 0.28s;
}
</style>
