<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">{{ $t('errorNotFound.title') }}</div>

      <div class="text-h2" style="opacity: 0.4">{{ $t('errorNotFound.message') }}</div>

      <q-btn class="q-mt-xl" color="white" text-color="blue" unelevated to="/" :label="$t('errorNotFound.backToHome')"
        no-caps />

    </div>
  </div>
</template>

<script setup lang="ts">

</script>
