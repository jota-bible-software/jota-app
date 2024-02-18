<template>
  <q-select v-model="selected" :options="langs" _label="Dla języka" option-label="symbol" emit-value
    popup-content-style="white-space: nowrap" dense>

    <template v-slot:selected>
      <FlagIcon :lang="selected" />
      <span class="gt-sm q-ml-md">{{ selected.toUpperCase() }}</span>
    </template>

    <template v-slot:option="scope">
      <div v-if="scope.opt.isFirstInGroup" class="row justify-center header">
        {{ scope.opt.lang }}
      </div>

      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            <FlagIcon :lang="scope.opt" />
            <span class="q-ml-md">{{ scope.opt.toUpperCase() }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LanguageSymbol } from 'src/types'
import { langs } from 'src/logic/data'
import FlagIcon from './FlagIcon.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
// const store = useTranslationStore()

const selected = computed({
  get(): LanguageSymbol {
    return props.modelValue
  },
  set(value: LanguageSymbol) {
    emit('update:modelValue', value)
  }
})

</script>

<style lang="scss" scoped>
</style>
