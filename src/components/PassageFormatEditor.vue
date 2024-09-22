<template>
  <div class="q-gutter-sm">
    <div class="text-subtitle1">Format fragmentów</div>
    <div>Lokalizacja odnośnika w stosunku do treści:</div>
    <div>
      <div class="row q-gutter-sm">
        <q-radio v-model="editor.referencePosition" val="before" label="Przed treścią" class="sized-radio" />
        <q-radio v-model="editor.referencePosition" val="after" label="Po treści" class="sized-radio" />
        <q-radio v-model="editor.referenceNewLine" val="same line" label="W tej samej linii" class="sized-radio" />
        <q-radio v-model="editor.referenceNewLine" val="new line" label="W oddzielnej linii" class="sized-radio" />
      </div>
    </div>

    <BookNamesEditor label="Nazwy ksiąg w odnośniku fragmentu:" v-model="editor.bookNames" />
    <div>
      <div class="row q-gutter-sm">
        <div>Znak oddzielający rozdział od wersetów w odnośniku:</div>
        <q-radio v-model="editor.separatorChar" val=":" label="Dwukropek" class="sized-radio-responsive" />
        <q-radio v-model="editor.separatorChar" val="," label="Przecinek" class="sized-radio" />
      </div>
    </div>
    <div>Skrótu przekładu:</div>
    <div>
      <div class="row q-gutter-md">
        <q-radio v-model="editor.translation" val="none" label="Żaden" />
        <q-radio v-model="editor.translation" val="lowercase" label="Małymi literami" />
        <q-radio v-model="editor.translation" val="uppercase" label="Dużymi literami" />
      </div>
    </div>
    <div>
      <div class="row q-gutter-y-sm q-gutter-x-md">
        <q-checkbox v-model="editor.quotes" label="Treść fragmentu w cudzysłowie"></q-checkbox>
        <q-checkbox v-model="editor.numbers" label="Wersety z numerami"></q-checkbox>
        <q-checkbox v-model="editor.verseNewLine" label="Każdy wersety od nowej linii"></q-checkbox>
      </div>
    </div>
    <div class="q-mt-md">
      Przykład formatowania fragmentu z pojedynczym wersetem i z wieloma:
    </div>
    <div>
      <span v-html="format_1Html" />
    </div>
    <div>
      <span v-html="format_2Html" />
    </div>
    <!-- <div class="row">
        <span v-html="format_2Html" />
      </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import BookNamesEditor from './BookNamesEditor.vue'
import { usePassageFormat } from 'src/composables/usePassageFormat'
import { editionSamples } from 'src/logic/data'
import { useSettingsStore } from 'src/stores/settings-store'

const props = defineProps(['modelValue', 'label'])
// const emit = defineEmits(['update:modelValue'])

const store = useSettingsStore()

const editor = reactive({ ...props.modelValue })

// const formatter: usePassageFormat(state.editor),
//     ref1(): string { return this.formatter.formatReference([42, 0, 0], sample) },
//     content1(): string { return this.formatter.formatContent([42, 0, 0], sample) },

const format_1Html = computed(() => {
  const formatter = usePassageFormat(editor)
  return formatter.format([42, 0, 0], editionSamples[store.lang]).replace(/\n/g, '<br/>')
})
const format_2Html = computed(() => {
  const formatter = usePassageFormat(editor)
  return formatter.format([42, 0, 0, 2], editionSamples[store.lang]).replace(/\n/g, '<br/>')
})

</script>


<style lang="scss" scoped>
.sized-radio {
  width: 132px
}

.sized-radio-responsive {
  @media (max-width: $breakpoint-xs-max) {
    width: 132px;
  }
}
</style>
