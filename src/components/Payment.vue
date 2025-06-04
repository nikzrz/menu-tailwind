<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <!-- Кнопка закрытия -->
      <button
        @click="$emit('close')"
        class="close-button"
      >
        <svg class="close-icon" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6"/>
        </svg>
      </button>
      <h2 class="modal-title">{{ t('choosePayment') }}</h2>
      <div class="buttons-container">
        <!-- Cash button -->
        <button
          @click="pay('cash')"
          class="payment-button cash-button"
        >
          <!-- Купюра (money bill) -->
          <svg class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4" y="6" width="16" height="12" rx="2"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
          <span class="button-text">{{ t('payCash') }}</span>
        </button>
        <div class="divider"></div>
        <!-- Card button -->
        <button
          @click="pay('card')"
          class="payment-button card-button"
        >
          <!-- Банковская карта -->
          <svg class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4" y="6" width="16" height="12" rx="2"/>
            <rect x="6" y="14" width="12" height="1"/>
          </svg>
          <span class="button-text">{{ t('payCard') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emit = defineEmits(['close', 'selected'])
function pay(type) {
  emit('selected', type)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #facc15; /* Желтый фон */
  padding: 32px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 340px;
  position: relative;
  animation: popin 0.35s cubic-bezier(0.5, 1.4, 0.8, 1);
}

.close-button {
  position: absolute;
  right: 16px;
  top: 16px;
  color: #000; /* Черный цвет крестика */
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100; /* Высокий z-index, чтобы быть поверх всех элементов */
}

.close-icon {
  width: 20px;
  height: 20px;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #000; /* Черный текст */
  margin-bottom: 24px;
  text-align: center;
  text-transform: uppercase;
}

.buttons-container {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  margin-top: 40px;
}

.divider {
  width: 1px;
  height: 60px;
  background-color: #000;
}

.payment-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: none;
  border: none;
  cursor: pointer;
}

.button-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
  color: #000; /* Черные иконки */
  stroke-width: 2;
}

.button-text {
  font-size: 16px;
  font-weight: bold;
  color: #000; /* Черный текст */
  text-transform: uppercase;
}

@keyframes popin {
  from {
    transform: scale(0.8) translateY(60px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Адаптация для мобильных устройств */
@media (max-width: 480px) {
  .modal-content {
    width: 300px;
    padding: 24px;
    border-radius: 16px;
  }

  .close-button {
    right: 12px;
    top: 12px;
    width: 28px;
    height: 28px;
  }

  .close-icon {
    width: 16px;
    height: 16px;
  }

  .modal-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .buttons-container {
    gap: 8px;
    margin-top: 32px;
  }

  .divider {
    height: 50px;
  }

  .payment-button {
    width: 100px;
    height: 100px;
  }

  .button-icon {
    width: 28px;
    height: 28px;
    margin-bottom: 8px;
  }

  .button-text {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .modal-content {
    width: 280px;
    padding: 20px;
  }

  .close-button {
    right: 10px;
    top: 10px;
    width: 24px;
    height: 24px;
  }

  .close-icon {
    width: 14px;
    height: 14px;
  }

  .modal-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .buttons-container {
    gap: 6px;
    margin-top: 24px;
  }

  .payment-button {
    width: 90px;
    height: 90px;
  }

  .button-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 6px;
  }

  .button-text {
    font-size: 12px;
  }
}
</style>