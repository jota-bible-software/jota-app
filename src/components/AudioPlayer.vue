<template>
  <audio controls ref="audio" id="audio-player" n="1" v-show="store.audioOn">
    <source :src="audioSource" type="audio/mpeg" />{{ t('audioPlayer.unsupportedBrowser') }}
  </audio>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue'
import { useSearchStore } from 'src/stores/search-store'
import { getAudioSource } from 'src/logic/audio'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useSearchStore()
const audio: Ref<HTMLAudioElement | null> = ref(null)
const audioSource = computed(() => getAudioSource(store.chapterFragment))

onMounted(() => {
  audioAction()
})

watch(() => store.audioOn, () => {
  audioAction()
})

function audioAction() {
  const player = audio.value as HTMLAudioElement
  if (!player) return
  if (store.audioOn) {
    player.load()
    player.play()
  } else {
    player.pause()
  }
}

</script>

<style scoped></style>
