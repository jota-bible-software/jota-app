<template>
  <div id="passages" v-if="passages.length > 1" class="col bottom-clipped q-list" ref="passagesRef" tabindex="9"
    @keydown.tab.exact.prevent="$emit('focusChapter')">
    <div v-for="(item, index) in passages" :key="index" clickable tabindex="0"
      :class="{ highlight: index === fragmentIndex }" @click="fragmentIndex = index"
      class="q-item q-item-type row no-wrap compact q-item--clickable q-link cursor-pointer">
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import { toRefs, ref } from 'vue'
import { useKeyboardNavigation } from 'src/composables/useKeyboardNavigation'

const store = useSearchStore()
const { fragmentIndex, passages } = toRefs(store)
const { moveFragmentIndex } = store

const passagesRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (passagesRef.value) {
    useKeyboardNavigation({
      container: passagesRef.value,
      itemsCount: computed(() => passages.value.length),
      onIndexChange: (index) => {
        fragmentIndex.value = index
      },
      initialIndex: fragmentIndex
    })
  }
})

defineEmits(['focusChapter'])
</script>

<style lang="scss" scoped>
#passages {
  flex: 0 0 auto;
  padding-right: 4px;
  margin-right: 4px;
  border-right: var(--q-border) solid 1px;

  .compact {
    line-height: 24px;
    padding: 0 8px !important;
    width: 100%;
    white-space: nowrap;
    min-height: 24px;
  }

  .compact:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .highlight {
    box-shadow: inset 1px 1px var(--q-primary), inset -1px -1px var(--q-primary);
  }
}
</style>
