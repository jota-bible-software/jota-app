<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import customIcons from 'src/custom-icons/custom-icons.js'
const q = useQuasar()
q.iconSet.set(customIcons)
</script>


