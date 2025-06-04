import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orderPending = ref(false)
  const orderProgress = ref(0)
  return { orderPending, orderProgress }
})
