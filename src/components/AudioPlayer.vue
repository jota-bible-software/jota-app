<template>
  <div>
    <audio controls ref="audio" id="audio-player" n="1" v-show="store.audioOn">
      <source :src="audioSource" type="audio/mpeg" />Twoja przeglądarka nie obsługuje słuchania audio :/
    </audio>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, nextTick, ref, watch } from 'vue'
import { useSearchStore } from 'src/stores/search-store'
import { getAudioSource } from 'src/logic/audio'


const store = useSearchStore()
const audio: Ref<HTMLAudioElement | null> = ref(null)

const audioSource = computed(() => {
  nextTick(() => {
    if (store.audioOn && audio.value) {
      audio.value.load()
      audio.value.play()
    }
  })
  return getAudioSource(store.chapterFragment)
})

watch(() => store.audioOn, value => {
  if (!audio.value) return
  if (value) {
    audio.value.load()
    audio.value.play()
  } else {
    audio.value.pause()
  }
})

</script>

<style scoped>
</style>
