<template>
  <div>
    <div class="row items-center q-gutter-sm" style="height: 48px">
      <div>Miejsce występowania odnośnika w stosunku do treści fragmentu:</div>
    </div>
    <div class="row q-gutter-sm">
      <q-radio v-model="referencePosition" val="before" label="Przed treścią" />
      <q-radio v-model="referencePosition" val="after" label="Po treści" />
    </div>
    <div class="row q-gutter-sm">
      <q-radio v-model="referenceNewLine" val="same line" label="W tej samej linii"/>
      <q-radio v-model="referenceNewLine" val="new line" label="W oddzielnej linii"/>
    </div>
    <div class="row items-center q-gutter-sm">
      <div>Nazwy ksiąg:</div>
      <q-select v-model="bookNamesStandard" :options="bookNamesStandards" dense outlined/>
    </div>
    <div class="row items-center q-gutter-sm">
      <div>Znak oddzielający rozdział od wersetów w odnośniku:</div>
      <q-radio v-model="separatorChar" val=":" label="Dwukropek" />
      <q-radio v-model="separatorChar" val="," label="Przecinek" />
    </div>
    <div class="row items-center q-gutter-sm">
      <div>Skrótu przekładu:</div>
      <q-radio v-model="translation" val="none" label="Żaden"/>
      <q-radio v-model="translation" val="lowercase" label="Małymi literami"/>
      <q-radio v-model="translation" val="uppercase" label="Dużymi literami"/>
    </div>
    <div class="row q-gutter-sm">
      <q-checkbox v-model="quotes" label="Treść fragmentu w cudzysłowie"></q-checkbox>
      <q-checkbox v-model="numbers" label="Wersety z numerami"></q-checkbox>
      <q-checkbox v-model="verseNewLine" label="Każdy wersety od nowej linii"></q-checkbox>
    </div>
    <div class="row q-mt-sm">
      <span v-html="templateHtml"/>
    </div>
    <div class="row">
      <span v-html="format_1Html"/>
    </div>
    <div class="row">
      <span v-html="format_2Html"/>
    </div>
  </div>
</template>

<script>
import jota from 'src/logic/jota'
import { bookNames as bookNamesMap, bibleSamples } from 'src/logic/data'
import { mapAll } from 'src/store'

const bookNamesStandards = Object.keys(bookNamesMap).map(locale => Object.keys(bookNamesMap[locale])
  .map(name => `${locale} - ${name}`)).flat()

export default mapAll('settings', {
  data() {
    return {
      bookNamesStandards,
      bookNamesStandard: 'pl - BT skróty',
      referenceNewLine: 'same line',
      referencePosition: 'before',
      separatorChar: ':',
      quotes: true,
      numbers: true,
      verseNewLine: false,
      translation: 'uppercase',
    }
  },
  computed: {
    bookNames2() {
      const locale = this.bookNamesStandard.slice(0, 2)
      const name = this.bookNamesStandard.slice(5)
      return bookNamesMap[locale][name]
    },
    format_1Html() {
      return this.format([0, 0, 0]).replace(/\n/g, '<br/>')
    },
    format_2Html() {
      return this.format([0, 0, 0, 1]).replace(/\n/g, '<br/>')
    },
    template() {
      return jota.pattern2template(this)
    },
    templateHtml() {
      return this.template.replace('\n', '\\n')
    }
  },
  methods: {
    format(fragment) {
      const { bookNamesStandard, referencePosition, referenceNewLine, separatorChar, quotes, verseNewLine, translation } = this
      console.log(JSON.stringify({bookNamesStandard, referencePosition, referenceNewLine, separatorChar, quotes, verseNewLine, translation}))
      return jota.format(bibleSamples.pl, fragment, this.template, this.bookNames2, this.separator, this.translation)
    },
  }
})

</script>
