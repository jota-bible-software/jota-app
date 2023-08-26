<template>

<div>
  <q-list>
    <q-item v-for="template in templates" :key="template.name">
      <q-item-section>
        <q-item-label>{{ template.name }}</q-item-label>
        <q-item-label caption><span v-html="format(template.pattern)"></span></q-item-label>
      </q-item-section>
    </q-item>
  </q-list>

</div>
</template>

<script>
import jota from 'src/logic/jota'
import { mapAll } from 'src/store'
import { bookNames, bibleSamples } from 'src/logic/data'

export default mapAll('settings', {
  data() {
    return {
      templates: [
        {
          name: 'English presentation',
          pattern: {
            bookNamesStandard: 'en - SBL abbreviations',
            referencePosition: 'after',
            referenceNewLine: 'new line',
            separatorChar: ':',
            quotes: false,
            numbers: false,
            verseNewLine: false,
            translation: 'uppercase'
          }
        },
        {
          name: 'Polska prezentacja',
          pattern: {
            bookNamesStandard: 'pl - BT skróty',
            referencePosition: 'after',
            referenceNewLine: 'new line',
            separatorChar: ',',
            quotes: false,
            numbers: false,
            verseNewLine: false,
            translation: 'uppercase'
          }
        },
      ],
    }
  },
  methods: {
    format(pattern) {
      const template = jota.pattern2template(pattern)
      const { bookNamesStandard, separatorChar, translation } = pattern
      const locale = bookNamesStandard.slice(0, 2)
      const books = bookNames[locale][bookNamesStandard.slice(5)]
      return jota.format(bibleSamples[locale], [0, 0, 0, 1], template, books, separatorChar, translation).replace(/\n/g, '<br/>')
    }
  }
})

/*
List of formatting templates: [add]
Name | Sample of formatting 1 verse. | edit | delete

*/
</script>
