<template>
  <q-list bordered>
    <q-item v-for="item in list" :key="item.name">
      <q-item-section>
        <q-item-label class="row items-center">
          <q-radio v-model="model" :val="item.name" :label="item.name" dense class="q-mr-md" />
        </q-item-label>
        <q-item-label caption>{{ item.booksText }}</q-item-label>
      </q-item-section>

    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store'
import { computed } from 'vue'

const store = useSettingsStore()
const list = store.bookNamingList

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get(): string {
    return list.find(_ => _.booksText === props.modelValue)?.name ?? ''
  },
  set(value: string) {
    emit('update:modelValue', list.find(_ => _.name === value)?.booksText ?? '')
  }
})

</script>

