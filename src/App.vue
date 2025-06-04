<template>
  <div class="min-h-screen bg-gradient-to-b from-dark-bg to-dark-end">
    <router-view />

    <!-- Показываем BottomNav только не в админке -->
    <BottomNav v-if="showBottomNav" @show-payment="showPayment = true" />

    <!-- Оплата по центру (тоже только на клиентских страницах) -->
    <Payment v-if="showPayment && showBottomNav" @close="showPayment = false" @selected="onPaySelected" />

    <!-- Snackbar -->
    <transition name="fade-snack">
      <div
        v-if="showSnackbar"
        class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-yandex-yellow text-black font-bold px-8 py-4 rounded-2xl shadow-2xl text-lg flex items-center gap-2 animate-pop"
      >
        <svg class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="#dcfce7"/>
          <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                d="M7 13l3 3 7-7"/>
        </svg>
        <span>{{ snackbarText }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import Payment from './components/Payment.vue'

const showPayment = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')

const route = useRoute()
// Показывать BottomNav только на гостевых (НЕ /admin/*) страницах:
const showBottomNav = computed(() => !route.path.startsWith('/admin'))

function onPaySelected(type) {
  showPayment.value = false
  snackbarText.value = type === 'card'
    ? 'Card'
    : 'Cash'
  showSnackbar.value = true
  setTimeout(() => showSnackbar.value = false, 2000)
}
</script>
