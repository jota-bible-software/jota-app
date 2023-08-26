<template v-slot:after>
  <q-btn
    :value="checked"
    @click="toggle"
    dense
    flat
    icon="icon-mdi-arrow-expand-horizontal"
    :text-color="checked ? 'primary' : 'disabled'"
    v-close-popup
  >
    <q-tooltip>{{ tooltip }}</q-tooltip>
    <span v-if="inMenu" class="button-menu-item">Wyszykuj całe słowa</span>
  </q-btn>
</template>

<script>
export default {
  props: {
    checked: Boolean,
    inMenu: Boolean,
    menuTitle: String,
  },
  computed: {
    tooltip() {
      return (this.words ? 'Wy' : 'W') + 'łącz wyszukiwanie całych słów'
    },
  },
  methods: {
    toggle() {
      this.$emit('change', !this.checked)
    },
  }
}
</script>
