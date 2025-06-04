<template>
    <div class="fixed inset-0 z-30 bg-gradient-to-b from-dark-bg to-dark-end flex items-center justify-center">
      <div class="relative w-full max-w-md mx-auto bg-card-dark/95 rounded-3xl shadow-2xl p-6 flex flex-col items-center">
        <!-- Кнопка назад -->
        <router-link
          to="/"
          class="absolute left-3 top-3 bg-dark-bg/80 rounded-full p-2 text-gray-300 hover:text-yandex-yellow hover:bg-gray-800 transition"
          :title="t('close')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <!-- Фото -->
        <img
          v-if="dish && dish.image_url"
          :src="dish.image_url"
          class="w-full h-52 object-cover rounded-xl mb-5 shadow"
          :alt="t('dishPhoto')"
        />
        <div v-else class="w-full h-52 flex items-center justify-center bg-gray-800/50 rounded-xl text-gray-400 text-base mb-5">
          {{ t('noPhoto') }}
        </div>
        <!-- Название и описание блюда на нужном языке -->
        <h2 class="text-2xl font-bold text-white mb-2 text-center">
          {{ dish && dish[`name_${locale.value}`] || dish?.name_en }}
        </h2>
        <div class="text-base text-gray-400 mb-4 text-center">
          {{ dish && dish[`description_${locale.value}`] || dish?.description_en }}
        </div>
        <div class="flex items-center justify-between w-full mb-6">
          <span class="text-2xl font-bold text-yandex-yellow">{{ dish?.price }}₺</span>
          <span class="text-base text-gray-300 flex items-center gap-1">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {{ dish?.rating || 4.8 }}
          </span>
        </div>
        <!-- Кнопка В корзину -->
        <button
          class="w-full py-3 bg-yandex-yellow hover:bg-yellow-300 transition text-black font-bold rounded-xl text-lg shadow-lg mb-2"
          @click="addToCart"
        >
          {{ t('addToCart') }}
        </button>
      </div>
  
      <!-- Модалка успеха -->
      <transition name="fade">
        <div
          v-if="showSuccess"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div class="bg-white rounded-2xl px-8 py-8 flex flex-col items-center shadow-2xl animate-pop">
            <svg class="w-14 h-14 text-green-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#e7fbe7"/>
              <path d="M8 12l2.5 2.5L16 9" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xl font-bold text-green-700 mb-1">{{ t('addedToOrder') }}</span>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router"; // useRouter здесь не нужен, так как ссылка to="/"
  import { useI18n } from 'vue-i18n';
  import { supabase } from "../supabase/client"; // Убедитесь, что путь к клиенту Supabase верный
  import { useCartStore } from '../store/cart'; // Убедитесь, что путь к хранилищу корзины верный
  
  const { t, locale } = useI18n();
  const route = useRoute();
  const dish = ref(null);
  const showSuccess = ref(false);
  const cart = useCartStore();
  
  onMounted(async () => {
    if (route.params.id) {
      try {
        const { data, error } = await supabase
          .from("dishes")
          // ВАЖНО: Убедитесь, что ваш запрос .select() возвращает restaurant_id.
          // Если 'restaurant_id' это прямое поле в таблице 'dishes', то .select("*") его вернет.
          // Если это связь, вам может понадобиться что-то вроде .select("*, restaurants(id)")
          // или другое имя поля, если оно у вас называется иначе.
          .select("*")
          .eq("id", route.params.id)
          .single();
  
        if (error) {
          console.error("Ошибка при загрузке блюда:", error.message);
          dish.value = null; // Устанавливаем null, чтобы избежать ошибок в шаблоне
          return;
        }
  
        dish.value = data;
  
        // Сохраняем restaurant_id в localStorage, чтобы router/index.js мог его использовать
        if (data) {
          // Попытка получить restaurant_id. АДАПТИРУЙТЕ ЭТО ПОД ВАШУ СТРУКТУРУ ДАННЫХ!
          let restaurantIdToSave = null;
  
          if (data.restaurant_id) { // Наиболее вероятный случай
            restaurantIdToSave = data.restaurant_id;
          } else if (data.menu_id) { // Если ID ресторана хранится в поле menu_id
            restaurantIdToSave = data.menu_id;
          }
          // Добавьте другие проверки, если поле называется иначе или вложено (например, data.restaurant.id)
  
          if (restaurantIdToSave) {
            localStorage.setItem('lastSeenRestaurantId', restaurantIdToSave);
            console.log('Сохранен lastSeenRestaurantId в localStorage:', restaurantIdToSave);
          } else {
            console.warn('Поле restaurant_id (или аналогичное) не найдено в данных блюда. Динамический редирект для "/" может не сработать как ожидается и будет использован ID по умолчанию.');
          }
        } else {
           console.warn('Данные блюда не были получены, restaurant_id не может быть сохранен.');
        }
  
      } catch (e) {
        console.error("Произошло исключение при загрузке блюда:", e);
        dish.value = null;
      }
    } else {
      console.error("ID блюда отсутствует в параметрах маршрута.");
      dish.value = null;
    }
  });
  
  function addToCart() {
    if (dish.value) {
      cart.add(dish.value);
      showSuccess.value = true;
      setTimeout(() => showSuccess.value = false, 1200);
    }
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .animate-pop {
    animation: pop 0.23s cubic-bezier(.4,2,.6,1.1);
  }
  @keyframes pop {
    0% { transform: scale(0.7);}
    100% { transform: scale(1);}
  }
  .bg-dark-bg { background: #1a1a1a; }
  .bg-card-dark { background: #232323; }
  .text-yandex-yellow { color: #facc15; }
  </style>
  