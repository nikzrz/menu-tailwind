import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    add(dish) {
      const found = this.items.find(item => item.id === dish.id)
      if (found) {
        found.qty += 1
      } else {
        this.items.push({ ...dish, qty: 1 })
      }
    },
    remove(id) {
      this.items = this.items.filter(item => item.id !== id)
    },
    changeQty(id, delta) {
      const item = this.items.find(item => item.id === id)
      if (!item) return
      item.qty += delta
      if (item.qty < 1) this.remove(id)
    },
    clear() {
      this.items = []
    }
  },
  getters: {
    count: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  }
})
