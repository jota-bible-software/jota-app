<template>
  <q-btn
    :value="checked"
    @click="toggle"
    dense
    flat
    icon="icon-mat-checklist"
    :text-color="checked ? 'primary' : 'disabled'"
    v-close-popup
  >
    <span v-if="inMenu" class="button-menu-item">Pokaż listę ksiąg</span>
    <q-tooltip>{{ tooltip }}</q-tooltip>
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
      return (this.checked ? 'Schowaj' : 'Pokaż') + ' przyciski wyboru księgi, rozdziału i wersetu'
    },
  },
  methods: {
    toggle() {
      this.$emit('change', !this.checked)
    },
  }
}
</script>
