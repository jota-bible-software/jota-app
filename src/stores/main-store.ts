import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    hGutter: 'md',
    vGutter: 'sm'
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  // actions: {
  //   increment() {
  //     this.counter++
  //   },
  // },
})
