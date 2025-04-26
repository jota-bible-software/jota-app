<template>
  <div class="manual-toc q-py-md">
    <div class="text-subtitle1 text-weight-bold q-px-md q-mb-sm">Table of Contents</div>
    <q-list dense padding>
      <q-item 
        v-for="section in sections" 
        :key="section.id" 
        clickable 
        v-ripple 
        @click="$emit('select', section.id)"
        :active="activeSection === section.id"
        active-class="bg-primary-1 text-primary"
      >
        <q-item-section>{{ section.title }}</q-item-section>
      </q-item>

      <q-expansion-item
        v-for="section in sectionsWithSubsections"
        :key="section.id"
        :label="section.title"
        :default-opened="isActiveOrHasActiveChild(section)"
        header-class="text-primary"
      >
        <q-list dense padding>
          <q-item 
            v-for="subsection in section.subsections" 
            :key="subsection.id" 
            clickable 
            v-ripple 
            @click="$emit('select', subsection.id)"
            :active="activeSection === subsection.id"
            active-class="bg-primary-1 text-primary"
          >
            <q-item-section class="q-pl-md">{{ subsection.title }}</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  sections: {
    type: Array as () => Array<{ id: string, title: string, subsections?: Array<{ id: string, title: string }> }>,
    required: true
  },
  activeSection: {
    type: String,
    default: ''
  }
})

const sectionsWithSubsections = computed(() => {
  return props.sections.filter(section => section.subsections && section.subsections.length > 0)
})

function isActiveOrHasActiveChild(section: { id: string, subsections?: Array<{ id: string, title: string }> }) {
  if (props.activeSection === section.id) return true
  if (section.subsections) {
    return section.subsections.some(subsection => subsection.id === props.activeSection)
  }
  return false
}

defineEmits(['select'])
</script>

<style lang="scss">
.manual-toc {
  .q-item {
    border-radius: 8px;
    margin: 2px 0;
  }
  
  .q-expansion-item__content {
    padding-left: 8px;
  }
}
</style>
