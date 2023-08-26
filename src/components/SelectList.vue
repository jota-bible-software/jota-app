<template>
  <div>
    <q-list>
      <q-item v-for="item in props.items" :key="item.name" class="q-px-none">
        <q-item-section>
          <div class="row">
            <div class="col-auto">
              <!-- <q-radio v-model="selected" :val="item.name" /> -->
              <q-btn outline icon="edit" />
            </div>
            <div class="col q-pl-md">
              <slot name="item-view" :item="item" v-if="selected !== item.name">{{ item.name }}</slot>
              <slot name="item-editor" :item="item" v-if="selected === item.name"><q-input v-model="item.name" /></slot>
            </div>
          </div>
        </q-item-section>
        <!-- <q-item-section side top>
          <q-btn icon="edit" flat dense color="primary" @click="selected = item.name"></q-btn>
        </q-item-section> -->
      </q-item>
    </q-list>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['items', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

// const selected = ref(props.modelValue)
// watch(selected, (newValue) => {
//   emit('update:modelValue', newValue)
// })

const selected = computed({
  get(): string {
    return props.modelValue
  },
  set(value: string) {
    emit('update:modelValue', value)
  }
})

</script>

<style scoped>
</style>
