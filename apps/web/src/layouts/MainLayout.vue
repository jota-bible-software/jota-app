<template>
  <q-layout view="lHh Lpr lFf">
    <PageHeader />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';

</script>

<style lang="scss">
.q-layout {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style>
