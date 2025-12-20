<template>
  <q-menu
    v-model="highlightStore.paletteVisible"
    anchor="bottom right"
    self="top right"
    :offset="[0, 8]"
  >
    <q-card style="min-width: 280px">
      <q-card-section class="q-pb-none">
        <div class="text-h6">{{ $t('highlight.palette') }}</div>
      </q-card-section>

      <q-card-section>
        <div class="color-grid">
          <q-btn
            v-for="color in highlightStore.sortedColors"
            :key="color.id"
            flat
            dense
            class="color-button"
            :style="{
              backgroundColor: color.hex,
              border: color.id === highlightStore.activeColor?.id ? '2px solid var(--q-primary)' : '1px solid rgba(0,0,0,0.12)'
            }"
            @click="applyColor(color.id)"
          >
            <q-tooltip>{{ $t('highlight.tooltips.applyColor', { color: color.name }) }}</q-tooltip>
            <q-icon v-if="color.id === highlightStore.activeColor?.id" name="check" color="white" size="sm" />
          </q-btn>
        </div>
      </q-card-section>

      <q-card-actions align="around" class="palette-footer">
        <q-btn
          flat
          dense
          icon="delete"
          :label="$t('highlight.tooltips.removeColor')"
          @click="removeHighlight"
        />
        <q-btn
          flat
          dense
          icon="filter_list"
          :label="$t('highlight.viewByColor')"
          @click="openFilterView"
        />
        <q-btn
          flat
          dense
          icon="settings"
          :label="$t('highlight.manageColors')"
          @click="openColorManager"
        />
      </q-card-actions>
    </q-card>
  </q-menu>
</template>

<script setup lang="ts">
import { useHighlightStore } from 'src/stores/highlight-store'
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { useRouter } from 'vue-router'

const highlightStore = useHighlightStore()
const searchStore = useSearchStore()
const router = useRouter()

function applyColor(colorId: string): void {
  if (!searchStore.chapterFragment) return

  const [book, chapter, start, end] = searchStore.chapterFragment
  if (start === undefined) return

  const passage: [number, number, number, number] = [
    book,
    chapter,
    start,
    end ?? start
  ]

  highlightStore.setActiveColor(colorId)
  highlightStore.toggleHighlight(passage, colorId)
}

function removeHighlight(): void {
  if (!searchStore.chapterFragment) return
  
  const [book, chapter, start, end] = searchStore.chapterFragment
  if (start === undefined) return
  
  const passage: [number, number, number, number] = [
    book,
    chapter,
    start,
    end ?? start
  ]
  
  highlightStore.removeHighlight(passage)
}

function openFilterView(): void {
  highlightStore.paletteVisible = false
  // TODO: Open filter view dialog
}

function openColorManager(): void {
  highlightStore.paletteVisible = false
  const settingsStore = useSettingsStore()
  settingsStore.currentTab = 'highlights'
  router.push('/settings')
}
</script>

<style lang="scss" scoped>
.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.color-button {
  width: 100%;
  height: 48px;
  border-radius: 4px;
  position: relative;
}

.palette-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding-top: 8px;
  margin-top: 8px;

  body.body--dark & {
    border-top-color: rgba(255, 255, 255, 0.12);
  }
}
</style>
