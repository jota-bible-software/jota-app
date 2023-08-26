<template>
  <div class="justify-start items-start content-start q-mt-sm">
    <div>
      Plan:
      <b>{{ selectedName }}</b>
      &nbsp;&nbsp; dni:
      <b>{{ selected.steps }}</b> &nbsp;&nbsp;data rozpoczęcia:
      <b>{{ formatDate(planStartDate) }}</b>
    </div>
    <!-- <div>Opis: {{ selected.description }}</div> -->
    <div class="row page" v-for="from in pages" :key="from">
      <!-- Readings -->
      <div class="column">
        <div v-for="(step, index) in items(from)" :key="index" class="row no-wrap reading">
          <div>{{ from + index }}.</div>
          <div>{{ date(from + index) }}</div>
          <div :class="itemClass(step)">{{ step.replace(/\(No reading\)/g, '(Bez czytania)') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import books from 'src/logic/books'
import readingPlans from 'src/logic/readingPlans'
import { mapAll } from 'src/store'

export default mapAll('settings', {
  data() {
    return {
      data: readingPlans,
      columns: [
        { name: 'name', label: 'Nazwa', field: 'name', align: 'left' },
        { name: 'steps', label: 'Ilość dni', field: 'steps', align: 'center' },
        {
          name: 'description',
          label: 'Opis',
          field: 'description',
          align: 'left',
          style: 'max-width: 800px; white-space: break-spaces;',
        },
      ],
      pages: [0],
      pageIndex: 0,
      nextPageIndex: 0,
    }
  },
  mounted() {
    this.oldMode = this.darkMode
    this.$store.commit('settings/darkMode', false)
    this.nextPage()
  },
  destroyed() {
    this.$store.commit('settings/darkMode', this.oldMode)
  },
  computed: {
    readings() {
      let text = this.selected.readings || ''
      books.fullEnglish.forEach((b, i) => {
        text = text.replaceAll(new RegExp(b, 'mg'), books.fullPolish[i])
      })
      return text.split('\n')
    },
    selected: {
      get() {
        return this.data.find(p => p.name === this.plan)
      },
      set(v) {
        this.plan = v ? v[0].name : ''
      },
    },
    selectedName() {
      return this.plan
    }
  },

  methods: {
    date(index) {
      if (!this.planStartDate) return ''
      const d = new Date(parseDate(this.planStartDate))
      d.setDate(d.getDate() + index)
      return this.formatDate(d)
    },
    formatDate(date) {
      if (!date) date = new Date()
      if (date instanceof Date) {
        var dd = date.getDate()
        var mm = date.getMonth() + 1
        const yyyy = date.getFullYear()
        if (dd < 10) dd = '0' + dd
        if (mm < 10) mm = '0' + mm
        return yyyy + '-' + mm + '-' + dd
      } else {
        return date
      }
    },
    itemClass(step) {
      return step.includes('(No reading)') ? 'completed' : 'black'
    },
    nextPage() {
      const parent = document.querySelectorAll('.page')[this.pageIndex]
      const parentBounds = parent.getBoundingClientRect()
      const parentWidth = parentBounds.x + parentBounds.width
      const parentHeight = parentBounds.y + parentBounds.height
      const cells = parent.querySelectorAll('.cell')
      let nextIndex = -1
      for (let i = 0; i < cells.length; i++) {
        const r = cells[i].getBoundingClientRect()
        if (r.x + r.width > parentWidth || r.y + r.height > parentHeight) {
          nextIndex = this.pages[this.pageIndex] + i
          this.pages.push(nextIndex)
          this.pageIndex++
          break
        }
      }
      if (nextIndex > -1) {
        this.$nextTick(() => this.nextPage())
      } else {
        window.print()
        setTimeout(() => window.close(), 1000)
      }
    },
    items(from) {
      return this.readings.slice(from || 0)
    },
  },
})

function parseDate(s) {
  const ss = s.split('-')
  return new Date(ss[0], parseInt(ss[1]) - 1, ss[2])
}
</script>

<style lang="sass">

@media print
  *
    color: 'black' !important

.page:nth-child(2)
  height: 24cm
  .column
    max-height: 24cm

.page
  height: 25.5cm
  max-width: 19cm
  margin-top: 8px
  margin-bottom: 8px
  overflow-x: hidden
  page-break-after: always

  .column
    max-height: 25.5cm

    .row
      width: 9.5cm
      div:nth-child(1)
        min-width: 35px !important
        text-align: center
        color: grey
      div:nth-child(2)
        min-width: 85px !important
        color: grey
      div:nth-child(3)
        width: 100%

.completed, .completed button, .completed a
  color: grey !important
  font-weight: normal
</style>
