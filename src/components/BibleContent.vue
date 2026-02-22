<template>
  <div id="content" v-scroll class="q-pb-md" v-show="!loading && !showPicker">
    <SplitLayoutContent v-if="layout === 'split'" />
    <FormattedLayoutContent v-if="layout === 'formatted'" />
  </div>
</template>

<script setup lang="ts">
import SplitLayoutContent from './SplitLayoutContent.vue'
import FormattedLayoutContent from './FormattedLayoutContent.vue'
import { useSearchStore } from 'src/stores/search-store'

const store = useSearchStore()
const { layout, loading, showPicker } = toRefs(store)

</script>

<style lang="scss">
#content {
  display: flex;
  flex-direction: column;
  // flex: 1;
  min-height: 0;
  overflow: hidden;

  >.row {
    flex: 1;
    min-height: 0;
  }
}

#content * {
  outline: none;
}

.verse {
  .bold {
    color: var(--q-accent);
    font-weight: 600;
    display: contents;
  }
}
</style>
