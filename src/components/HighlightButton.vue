<template>
<<<<<<< HEAD
  <q-btn-dropdown ref="btnRef" v-if="highlightStore.highlightingEnabled && hasSelection" outline dense :split="!highlightStore.hasTranslationMismatch"
=======
  <q-btn-dropdown ref="btnRef" v-if="translationStore.currentTranslation?.highlightsEnabled?.value && hasSelection" outline dense :split="!highlightStore.hasTranslationMismatch"
>>>>>>> b80772d (Highlighting)
    text-color="primary" class="q-ml-sm" @click="handleClick">
    <template v-slot:label>
      <div class="row items-center justify-center no-wrap">
        <div class="highlight-color-indicator color-swatch" :style="{ backgroundColor: currentHighlight?.hex || activeColor?.hex }" />
        <q-icon v-if="highlightStore.hasTranslationMismatch" name="icon-mat-warning" color="warning" size="30px" class="q-ml-xs" />
      </div>
      <q-tooltip>{{ getTooltipText() }}</q-tooltip>
    </template>

    <q-list dense>
      <template v-if="highlightStore.hasTranslationMismatch">
        <q-item class="warning-item">
          <q-item-section>
            <q-item-label class="text-warning warning-title text-h6 q-pb-sm">
              {{ t('highlight.translationMismatch') }}
            </q-item-label>
            <q-item-label class="text-body1">
              {{ t('highlight.translationMismatchMessage', {
                original: highlightStore.highlights.translation.symbol,
                current: translationStore.currentTranslation.symbol
              }) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-else>
        <q-item clickable v-close-popup @click="selectColor(color)" v-for="color in sortedColors" :key="color.id"
          :class="{ 'highlight-active': color.id === activeColor?.id }">
          <q-item-section avatar style="min-width: 32px">
            <div class="color-swatch" :style="{ backgroundColor: color.hex }" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ color.name }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="color.id === activeColor?.id">
            <q-icon name="check" color="primary" size="sm" />
          </q-item-section>
        </q-item>

        <div class="separator-wrapper">
          <q-separator />
        </div>

        <q-item clickable v-close-popup @click="openColorManager" class="manage-colors-item">
          <q-item-section avatar style="min-width: 32px">
            <q-icon name="settings" size="sm" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('highlight.manageColors') }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useHighlightStore } from 'src/stores/highlight-store'
import { useSearchStore } from 'src/stores/search-store'
import { useTranslationStore } from 'src/stores/translation-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { HighlightColor } from 'src/types'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const highlightStore = useHighlightStore()
const searchStore = useSearchStore()
const translationStore = useTranslationStore()
const settingsStore = useSettingsStore()
const { t } = useI18n()
const $q = useQuasar()
const router = useRouter()

const btnRef = ref(null)
const hasSelection = computed(() => searchStore.hasSelection)
const activeColor = computed(() => highlightStore.activeColor)
const sortedColors = computed(() => highlightStore.sortedColors)

const currentHighlight = computed(() => {
  if (!searchStore.chapterFragment) return undefined

  const [book, chapter, start, end] = searchStore.chapterFragment
  if (start === undefined) return undefined

  const verseStart = start
  const verseEnd = end ?? start

  // Find any overlapping highlight
  const overlapping = highlightStore.currentTranslationHighlights.find(h => {
    const [hBook, hChapter, hStart, hEnd] = h.passage
    if (hBook !== book || hChapter !== chapter) return false
    return !(hEnd < verseStart || hStart > verseEnd)
  })

  if (!overlapping) return undefined

  return highlightStore.config.colors.find(c => c.id === overlapping.highlightColorId)
})

function getTooltipText(): string {
  if (currentHighlight.value) {
    return t('highlight.removeHighlight')
  }
  return t('highlight.applyHighlight')
}

function toggleHighlight(): void {
  if (!searchStore.chapterFragment) return

  const [book, chapter, start, end] = searchStore.chapterFragment
  if (start === undefined) return

  const passage: [number, number, number, number] = [
    book,
    chapter,
    start,
    end ?? start
  ]

  // Use the current highlight color if it exists, otherwise use the active color
  const colorToToggle = currentHighlight.value?.id || activeColor.value?.id
  if (!colorToToggle) return

  highlightStore.toggleHighlight(passage, colorToToggle)
}

function selectColor(color: HighlightColor): void {
  if (!searchStore.chapterFragment) return

  const [book, chapter, start, end] = searchStore.chapterFragment
  if (start === undefined) return

  const passage: [number, number, number, number] = [
    book,
    chapter,
    start,
    end ?? start
  ]

  highlightStore.setActiveColor(color.id)
  highlightStore.toggleHighlight(passage, color.id)
}

function openColorManager(): void {
  settingsStore.currentTab = 'highlights'
  router.push('/settings')
}

// Handle click based on whether there's a translation mismatch
function handleClick(): void {
  if (highlightStore.hasTranslationMismatch) {
    // When there's a warning, any click should show the dropdown menu
    const btn = btnRef.value?.$el.querySelector('.q-btn-dropdown')
    if (btn && !$q.cookies.get('highlight-warning-shown')) {
      $q.cookies.set('highlight-warning-shown', 'true', { expires: 7 }) // Remember for 7 days
      btnRef.value?.show()
    }
  } else {
    // Normal highlight behavior when there's no warning
    toggleHighlight()
  }
}
</script>

<style lang="scss" scoped>
.highlight-color-indicator {
  margin: 2px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.warning-item {
  padding: 12px 16px;
  min-width: 300px;
}

.warning-title {
  font-weight: 500;
}

.highlight-active {
  background: var(--q-primary-opacity-2);
}

.manage-colors-item {
  background-color: rgba(0, 0, 0, 0.03);

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  body.body--dark & {
    background-color: rgba(255, 255, 255, 0.05);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
}

.separator-wrapper {
  padding-top: 8px;
}
</style>
