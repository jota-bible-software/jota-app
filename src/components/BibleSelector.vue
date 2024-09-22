<template>
  <q-select v-model="selected" :options="props.editions" option-label="symbol" emit-value
    popup-content-style="white-space: nowrap" dense>

    <template v-slot:selected>
      <div class="row items-center q-gutter-sm">
        <!-- <FlagIcon :lang="selected.lang" v-if="props.flag" /> -->
        <span>{{ selected.symbol }}</span>
        <span>{{ selected.title }}</span>
      </div>
    </template>

    <template v-slot:option="scope">
      <!-- <div v-if="scope.opt.isFirstInGroup" class="row justify-center header">
        {{ scope.opt.lang }}
      </div> -->
      <q-separator v-if="scope.opt.isFirstInGroup" />

      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            <div class="row items-center q-gutter-md">
              <FlagIcon :lang="scope.opt.lang" v-if="props.flag" />
              <span>{{ scope.opt.symbol }}</span>
              <span>{{ scope.opt.title }}</span>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Edition } from 'src/types'
import FlagIcon from './FlagIcon.vue'

const props = defineProps(['modelValue', 'flag', 'editions'])
const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get(): Edition {
    return props.modelValue
  },
  set(value: Edition) {
    emit('update:modelValue', value)
  }
})

</script>

<style lang="scss" scoped>
.header {
  background-color: var(--q-background-05)
}
</style>
