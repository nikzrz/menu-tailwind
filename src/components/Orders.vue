<template>
    <div class="fixed inset-0 bg-gradient-to-b from-dark-bg to-dark-end flex items-center justify-center z-30">
      <div class="relative w-full max-w-md mx-auto bg-card-dark/95 rounded-3xl shadow-2xl p-6 flex flex-col items-center min-h-[60vh]">
        <!-- Кнопка назад -->
        <button
          @click="goBack"
          class="absolute left-4 top-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-bg text-white hover:bg-gray-800 transition shadow border border-white/10 z-20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ t('back') }}</span>
        </button>
  
        <h2 class="text-3xl font-bold mb-8 text-white drop-shadow-lg tracking-tight mt-2">{{ t('yourOrder') }}</h2>
  
        <transition name="fade">
          <div v-if="cart.items.length === 0" class="text-gray-500 text-center py-20 text-lg bg-card-dark/80 rounded-2xl shadow-inner mt-10 w-full">
            <span class="opacity-60">{{ t('orderIsEmpty') }}</span>
          </div>
        </transition>
  
        <transition-group name="list" tag="div" class="w-full flex flex-col gap-3">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="group flex items-center bg-card-dark/90 rounded-2xl shadow-md px-4 py-4 hover:shadow-xl transition-all border border-gray-700/40"
          >
            <img
              v-if="item.image_url"
              :src="item.image_url"
              class="w-16 h-16 object-cover rounded-xl shadow-lg border border-white/10"
              :alt="item[`name_${locale}`] || item.name_en"
            />
            <div class="flex-1 min-w-0 ml-2">
              <div class="font-bold text-white text-lg truncate">{{ item[`name_${locale}`] || item.name_en }}</div>
              <div class="text-xs text-gray-400 mt-1">{{ item.price }}₽ × {{ item.qty }}</div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="cart.changeQty(item.id, -1)"
                class="w-10 h-10 flex items-center justify-center bg-dark-bg rounded-full text-2xl font-bold text-white hover:bg-gray-700 shadow transition disabled:opacity-40"
                :disabled="item.qty <= 1 || orderPending"
              >-</button>
              <span class="w-8 text-center text-lg text-white select-none">{{ item.qty }}</span>
              <button
                @click="cart.changeQty(item.id, +1)"
                class="w-10 h-10 flex items-center justify-center bg-yandex-yellow rounded-full text-2xl font-bold text-black hover:bg-yellow-400 shadow transition"
                :disabled="orderPending"
              >+</button>
              <!-- Корзинка для удаления -->
              <button
                @click="cart.remove(item.id)"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400 transition ml-2"
                :title="t('delete')"
                :disabled="orderPending"
              >
                <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M6 7V6a6 6 0 1112 0v1" />
                  <path d="M5 7h14l-1 14H6L5 7z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </transition-group>
  
        <div v-if="cart.items.length > 0" class="mt-8 w-full flex flex-col items-center">
          <div class="flex justify-between items-center text-2xl font-bold text-white bg-dark-bg rounded-xl px-6 py-4 shadow-lg mb-6 w-full">
            <span>{{ t('total') }}:</span>
            <span class="text-yandex-yellow">{{ cart.total }}₺</span>
          </div>
          <transition name="fade">
            <div v-if="orderPending" class="flex flex-col items-center w-full mb-3">
              <svg class="w-14 h-14 animate-spin mb-3" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="#facc15" stroke-width="4" fill="none" opacity="0.2"/>
                <path d="M44 24a20 20 0 0 1-20 20" stroke="#facc15" stroke-width="4" fill="none" stroke-linecap="round"/>
              </svg>
              <div class="text-lg text-yandex-yellow font-bold">{{ t('preparingOrder') }}</div>
              <div class="text-white mb-2">{{ t('waitReady') }}</div>
              <div class="text-base text-gray-300">{{ t('timeLeft') }}: <span class="font-bold text-white">{{ timer }}</span> {{ t('sec') }}</div>
            </div>
          </transition>
          <button
            v-if="!orderPending"
            @click="placeOrder"
            class="w-full py-3 bg-yandex-yellow text-black rounded-2xl font-bold text-xl hover:bg-yellow-400 shadow-lg transition active:scale-95"
          >
            {{ t('placeOrder') }}
          </button>
          <button
            v-else
            disabled
            class="w-full py-3 bg-gray-400 text-black rounded-2xl font-bold text-xl shadow-lg cursor-wait"
          >
            {{ t('preparingOrder') }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCartStore } from '../store/cart'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { ref, watch, computed } from 'vue'
  import { useOrderStore } from '../stores/order'
  
  const cart = useCartStore()
  const { t, locale } = useI18n()
  const router = useRouter()
  
  const orderStore = useOrderStore()
  const orderPending = computed(() => orderStore.orderPending)
  const timer = ref(7)
  let timerInterval = null
  
  function goBack() {
    router.back()
  }
  
  function placeOrder() {
    orderStore.orderPending = true
    orderStore.orderProgress = 0
    timer.value = 100
  
    const progressStep = 1 / 100
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      timer.value--
      orderStore.orderProgress += progressStep
      if (timer.value <= 0) {
        clearInterval(timerInterval)
        orderStore.orderPending = false
        orderStore.orderProgress = 0
        timer.value = 0
      }
    }, 1000)
  }
  
  watch(orderPending, (v) => {
    if (!v && timerInterval) clearInterval(timerInterval)
  })
  </script>
  
  <style scoped>
  .bg-card-dark {
    background: #232325;
  }
  .bg-dark-bg {
    background: #19191b;
  }
  .text-yandex-yellow {
    color: #ffcc00;
  }
  .bg-yandex-yellow {
    background: #ffcc00;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .list-enter-active, .list-leave-active {
    transition: all 0.3s cubic-bezier(.55,0,.1,1);
  }
  .list-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  .animate-spin {
    animation: spin 1.2s linear infinite;
  }
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
  </style>
  