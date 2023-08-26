<template>
  <q-select v-model="selectedItem" :options-dense="true" :options-dense-menu="true" :options="groupedItems" :option-value="item => item.value"
    :option-label="item => item.label" :option-group-label="group => group.label" :option-group-props="{ 'dense': true }"
    :emit-value="true" :map-options="true" :menu-props="{ 'content-class': 'grouped-dropdown-menu' }"
    @filter="filterItems">
    <template v-slot:option="{ option, selected }">
      <div class="q-pa-xs">
        <div v-if="option.__group">
          <div class="text-weight-bold">{{ option.__group.label }}</div>
        </div>
        <div v-else>
          <q-item :active="selected">
            <q-item-section>{{ option.label }}</q-item-section>
            <q-item-section side>
              {{ option.value }}
            </q-item-section>
          </q-item>
        </div>
      </div>
    </template>
  </q-select>
  <!-- <q-select
    v-model="selectedItem"
    :options-dense="true"
    :options-dense-menu="true"
    :menu-anchor="true"
    :menu-anchor-offset="[0, 0]"
    :options="groupedItems"
    :option-value="item => item.value"
    :option-label="item => item.label"
    :option-group-label="group => group.label"
    :option-group-props="{ 'dense': true }"
    :emit-value="true"
    :map-options="true"
    :menu-props="{ 'content-class': 'grouped-dropdown-menu' }"
    @filter="filterItems"
  >
    <template v-slot:option="{ option, selected }">
      <div class="q-pa-xs">
        <div v-if="option.__group">
          <div class="text-weight-bold">{{ option.__group.label }}</div>
        </div>
        <div v-else>
          <q-item :active="selected">
            <q-item-section>{{ option.label }}</q-item-section>
            <q-item-section side>
              {{ option.value }}
            </q-item-section>
          </q-item>
        </div>
      </div>
    </template>
  </q-select> -->
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const items = [
      { label: 'Group A', value: 'A', group: 'Group A' },
      { label: 'Item 1', value: '1', group: 'Group A' },
      { label: 'Item 2', value: '2', group: 'Group A' },
      { label: 'Group B', value: 'B', group: 'Group B' },
      { label: 'Item 3', value: '3', group: 'Group B' },
      { label: 'Item 4', value: '4', group: 'Group B' },
    ]

    const selectedItem = ref(null)

    const groupedItems = computed(() => {
      const grouped = []
      let currentGroup = null

      items.forEach((item) => {
        if (item.group !== currentGroup) {
          currentGroup = item.group
          grouped.push({ __group: true, label: currentGroup })
        }
        grouped.push(item)
      })

      return grouped
    })

    const filterItems = (value, updateOptions) => {
      const filteredItems = items.filter(
        (item) => item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
      )
      updateOptions(() => filteredItems)
    }

    return {
      selectedItem,
      groupedItems,
      filterItems,
    }
  },
}
</script>

<style>
.grouped-dropdown-menu .q-item--active {
  background-color: lightgray;
}
</style>
