<!-- <template>
  <q-page class="q-px-lg">
    <div class="col">
      <div class="row q-mb-sm">
        <q-expansion-item :label="'Wybór planu: ' + selectedName" v-model="expanded" :class="{ 'col-grow': expanded }">
          <!-- Table of reading plans -->
          <q-table id="plans" :data="data" :columns="columns" row-key="name" selection="single" @selection="onSelection"
            :v-model="selected" hide-bottom :dense="$q.screen.lt.md" :pagination="{ rowsPerPage: 0 }">
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div>{{ props.value }}</div>
                <div class="full-width text-right q-mt-xs text-grey">{{ props.row.steps }} dni</div>
              </q-td>
            </template>
          </q-table>
        </q-expansion-item>

        <div class="row wrap items-center col-grow" v-show="!expanded">
          <!-- Start date of the plan -->
          <div id="planStartDate" class="row q-mr-md">
            <div class="label q-mr-sm">Data rozpoczęcia:</div>
            <q-input v-model="planStartDate" type="date" placeholder="Wprowadź datę" dense color="primary"></q-input>
          </div>

          <!-- Progress -->
          <div class="row flex-break xs q-py-xs"></div>
          <div class="row col-grow q-mr-md">
            <div class="label q-mr-sm">Postęp:</div>
            <div class="align-center col-grow">
              <q-linear-progress size="24px" :value="progress" color="accent">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="accent" :label="Math.ceil(progress * 100) + '%'" />
                </div>
              </q-linear-progress>
            </div>
          </div>

          <!-- Print -->
          <q-btn @click="print" class="gt-xs">Drukuj</q-btn>
        </div>
      </div>

      <!-- Readings -->
      <q-virtual-scroll id="readings" ref="virtualListRef" component="q-list" :items="readings"
        @virtual-scroll="onVirtualScroll" v-show="!expanded" style="max-height: calc(100vh - 100px)">
        <template v-slot="{ item, index }">
          <q-item :key="index" :class="itemClass(index)" dense class="compact" tabindex="0">
            <q-item-section class="col-shrink">
              <q-checkbox :value="checked(index)" @input="check(index)" color="grey"></q-checkbox>
            </q-item-section>
            <q-item-section class="index">{{ index + 1 }}</q-item-section>
            <q-item-section class="col-shrink">{{ date(index) }}</q-item-section>
            <q-item-section>
              <q-btn type="a" dense flat no-caps color="primary" align="left" class="reading"
                @click="read(index)">{{ item }}</q-btn>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import books from 'src/logic/books'
import readingPlans from 'src/logic/readingPlans'
import { formatDate, parseDate } from 'src/logic/util'
import { useSettingsStore } from 'src/stores/settings-store'

const store = useSettingsStore()
const state = {
  data: readingPlans,
  columns: [
    { name: 'name', label: 'Nazwa', align: 'left', field: 'name' },
    // { name: 'steps', label: 'Ilość dni', field: 'steps', align: 'center' },
    {
      name: 'description',
      label: 'Opis',
      field: 'description',
      align: 'left',
      style: 'max-width: 800px; white-space: break-spaces;',
    },
  ],
  expanded: false,
  showCompleted: true,
  virtualListIndex: 0,
}


mounted() {
  this.expanded = !this.plan
  this.scroll()
}


percentage() {
  return this.progress < 50 ? Math.ceil(this.progress * 100) : Math.floor(this.progress * 1000)
}
progress() {
  return this.planProgress / (this.readings.length || 1)
}
readings() {
  if (!this.selected.length) return []
  let text = this.selected[0].readings || ''
  text = text.replace(/ *\(No reading\)/g, '(Bez czytania)')
  books.fullEnglish.forEach((b, i) => {
    text = text.replaceAll(new RegExp(b, 'gm'), books.fullPolish[i])
  })
  return text.split('\n')
}
selected: {
  get() {
    return this.plan ? [this.data.find(p => p.name === this.plan)] : []
  },
  set(v) {
    this.plan = v.length ? v[0].name : ''
  },
}
selectedName() {
  return this.plan
}

function check(index) {
  if (index < this.planProgress) {
    this.planProgress = index
  } else {
    this.planProgress = index + 1
    const cell = document.querySelectorAll('.reading')[this.planProgress]
    const parentBounds = this.$refs.virtualListRef.$el.getBoundingClientRect()
    const bounds = cell && cell.getBoundingClientRect()
    if (bounds && bounds.y + bounds.height > parentBounds.y + parentBounds.height) {
      const rowHeight = this.$refs.virtualListRef.$el.querySelector('.q-item').getBoundingClientRect().height
      const count = Math.floor(parentBounds.height / rowHeight)
      this.scroll(Math.min(this.readings.length, index + count - 1))
    }
  }
}
function checked(index) {
  return index < this.planProgress
}
function complete(index) {
  this.planProgress = index + 1
}
function date(index) {
  if (!this.planStartDate) return ''
  const d = new Date(parseDate(this.planStartDate))
  d.setDate(d.getDate() + index)
  return formatDate(d)
} function
  itemClass(index) {
  return index < this.planProgress || this.readings[index] === '(Bez czytania)' ? 'completed' : ''
}
function onSelection(event) {
  this.expanded = false
}
function onVirtualScroll({ index }) {
  this.virtualListIndex = index
}
function print() {
  const route = this.$router.resolve('reading-plan-print')
  console.log('route.href', route.href)
  this.$router.push({ path: 'reading-plan-print' })
  // window.open(route.href, '_blank')
}
function read(index) {
  const passages = this.readings[index]
    .split(', ')
    .map(p => (p.match(/\d$/) ? p : p + ' 1'))
    .join(', ').trim()
  this.$store.commit('search/input', passages)
  this.$router.push({ path: '/' })
}
function scroll(index) {
  const i = Math.max(0, index === undefined ? this.planProgress - 1 : index)
  console.log(i)
  this.$refs.virtualListRef.scrollTo(i, 'start-force')
}
</script>

<style lang="sass">
#plans
  td
    vertical-align: top

#planStartDate
  label
    width: 115px

#readings
  .q-item
    padding: 0

    .q-btn__content
      text-align: left !important

.q-item
  padding-left: 0
  justify-content: middle

.q-item:focus
  outline: none

.label
  align-self: center
  width: auto

.index
  max-width: 1.6em
  text-align: center
  justify-content: middle

.completed, .completed button, .completed a
  color: grey !important
  font-weight: normal

.q-checkbox__inner
  margin: -8px

.row.flex-break
  flex: 1 0 100% !important

.q-item__label--header
  padding: 8px

button.q-btn
  height: 36px

::-webkit-datetime-edit
  margin-right: -20px
::-webkit-inner-spin-button
  display: none
</style> -->
