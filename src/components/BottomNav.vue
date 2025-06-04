<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-inner">
      <button class="nav-btn" @click="callWaiter">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <!-- BellIcon -->
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="btn-label">{{ t('callWaiter') }}</span>
      </button>
      <button class="nav-btn" @click="$emit('show-payment')">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <!-- CreditCardIcon -->
          <rect x="2" y="7" width="20" height="10" rx="2" />
          <path d="M2 10h20" />
        </svg>
        <span class="btn-label">{{ t('pay') }}</span>
      </button>
      <button class="nav-btn nav-btn-cart" @click="goToOrders">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <!-- ShoppingBagIcon -->
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V9a4 4 0 10-8 0v2M5 11h14l-1.5 8.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 11z"/>
        </svg>
        <span class="btn-label">{{ t('order') }}</span>
        <span v-if="cart.count" class="cart-badge">{{ cart.count }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../store/cart'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const cart = useCartStore()
const router = useRouter()

function callWaiter() {
  alert(t('waiterCalled'))
}
function goToOrders() {
  router.push('/orders')
}
</script>

<style>
:root {
  --yandex-yellow: #facc15;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 0 16px env(safe-area-inset-bottom, 0px) 16px;
  z-index: 50;
  display: flex;
  justify-content: center;
}

.bottom-nav-inner {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(0, 0, 0, 0);
  box-shadow: 0 -4px 24px rgba(0,0,0,0.18);
  padding: 8px 0;
}

.nav-btn {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
  outline: none;
}

.nav-btn:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -16px;
  top: 0;
  height: 100%; /* Fills the full height of the parent (.nav-btn) */
  width: 1px; /* Thin vertical line */
  background-color: #282727; /* Divider color */
  opacity: 0.6; /* Matches original opacity */
}

.nav-btn:hover,
.nav-btn:focus {
  color: var(--yandex-yellow);
  outline: none;
}

.nav-btn:hover::after,
.nav-btn:focus::after {
  background-color: #222020; /* Keep divider color consistent on hover/focus */
  opacity: 0.6;
}

.icon {
  width: 22px;
  height: 22px;
  margin-bottom: 4px;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
}

.btn-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.18);
}

.cart-badge {
  position: absolute;
  top: -7px;
  right: -14px;
  background: var(--yandex-yellow);
  color: #000000;
  font-size: 12px;
  border-radius: 16px;
  padding: 1px 8px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0);
  min-width: 24px;
  text-align: center;
}

.nav-btn:focus,
.nav-btn:active {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>