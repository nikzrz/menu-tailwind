<template>
  <div class="menu-container">
    <TopBar :restaurantName="restaurantName" :restaurantId="restaurantId":restaurantPhotoPath="restaurantPhotoPath" />
    <nav class="categories-nav">
      <div class="categories-scroll" ref="categoriesScroll">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="{ 'active': activeCategory === cat.id }"
        >
          {{ cat && cat[`name_${locale}`] || cat?.name_en }}
        </button>
      </div>
    </nav>

    <main class="menu-main">
      <div v-if="categories.length === 0" class="no-items">
        {{ t('noCategories') }}
      </div>
      <div v-if="filteredDishes.length === 0 && categories.length > 0" class="no-items">
        {{ t('noDishes') }}
      </div>
      <div v-else>
        <h1 class="section-header">{{ t('popular') }}</h1>
        <div class="dishes-grid">
          <a
            v-for="dish in filteredDishes"
            :key="dish.id"
            :href="`/dish/${dish.id}?restaurantId=${restaurantId}`"
            class="dish-card"
            tabindex="-1"
          >
            <img
              v-if="dish.image_url"
              :src="dish.image_url"
              class="dish-image"
              loading="lazy"
              :alt="dish && (dish[`name_${locale}`] || dish.name_en)"
            />
            <div v-else class="no-image">
              {{ t('noPhoto') }}
            </div>
            <div class="dish-content">
              <h2 class="dish-title">
                {{ dish && dish[`name_${locale}`] || dish?.name_en }}
                <span v-if="dish.weight" class="dish-weight"> ({{ dish.weight }})</span>
              </h2>
              <p class="dish-nutrition">{{ formatNutrition(dish) }}</p>
              <div class="dish-footer">
                <span class="dish-price">{{ dish.price }}₺</span>
                <span class="dish-rating">
                  <svg class="star-icon" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{{ dish.rating || 4.9 }}</span>
                </span>
              </div>
              <button
                class="add-button"
                :class="{ pop: popButtonId === dish.id }"
                @click.prevent="addToCart(dish)"
              >+</button>
            </div>
          </a>
        </div>
      </div>
      <!-- Success Modal -->
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
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import TopBar from './TopBar.vue';
import BottomNav from './BottomNav.vue';
import { supabase } from "../supabase/client";
import { useI18n } from 'vue-i18n';
// Импортируй свой store (пример с Pinia):
import { useCartStore } from '../store/cart';

const { t, locale } = useI18n();
const route = useRoute();
const restaurantId = route.params.restaurantId;
const restaurantName = ref('');
const categories = ref([]);
const dishes = ref([]);
const activeCategory = ref(null);
const showSuccess = ref(false);
const popButtonId = ref(null);
const categoriesScroll = ref(null);
const restaurantPhotoPath = ref('');
const cart = useCartStore(); // cart.items будет доступен для Orders.vue

const units = {
  en: { kcal: 'kcal', g: 'g' },
  ru: { kcal: 'ккал', g: 'г' },
  tr: { kcal: 'kkal', g: 'g' },
  de: { kcal: 'kcal', g: 'g' },
};

function hasNutrition(dish) {
  return dish.calories || dish.protein || dish.fat || dish.carbs;
}

function formatNutrition(dish) {
  const u = units[locale.value] || units.en;
  const parts = [];
  if (dish.calories) parts.push(`${dish.calories} ${u.kcal}`);
  if (dish.protein) parts.push(`${dish.protein} ${u.g}`);
  if (dish.fat) parts.push(`${dish.fat} ${u.g}`);
  if (dish.carbs) parts.push(`${dish.carbs} ${u.g}`);
  return parts.length ? parts.join(' / ') : t('noNutrition');
}

// Scroll для категорий — на мобилках скролл по горизонтали!
onMounted(async () => {
  let { data: restData } = await supabase
    .from("restaurants")
    .select("name ,photo_path")
    .eq("id", restaurantId)
    .single();
  restaurantName.value = restData?.name || '';
  restaurantPhotoPath.value = restData?.photo_path || ''; 

  let { data: catData } = await supabase.from("categories").select("*");
  categories.value = Array.isArray(catData) ? catData : [];
  activeCategory.value = catData && catData.length > 0 ? catData[0].id : null;

  let { data: dishData } = await supabase
    .from("dishes")
    .select("*")
    .eq("restaurant_id", restaurantId);
  dishes.value = Array.isArray(dishData) ? dishData : [];

  // Scroll categories to active on mount (для длинного списка)
  nextTick(() => {
    if (categoriesScroll.value) {
      categoriesScroll.value.scrollLeft = 0;
    }
  });
});

// Добавить блюдо в корзину с анимацией и попапом
function addToCart(dish) {
  cart.add(dish); // Pinia store
  popButtonId.value = dish.id;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
    popButtonId.value = null;
  }, 1000);
}

const filteredDishes = computed(() => {
  if (!activeCategory.value) return dishes.value;
  return dishes.value.filter((dish) => dish.category_id === activeCategory.value);
});
</script>

<style scoped>
.menu-container {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #212020;
  display: flex; flex-direction: column; align-items: center;
  color: #fff;
}

.categories-nav {
  position: sticky;
  top: 64px;
  z-index: 30;
  background: #fff;
  padding: 4px 0;
  width: 98%;
  border-radius: 20px;
}

.categories-scroll {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 0 16px;
  white-space: nowrap;
  scrollbar-width: none;
  justify-content: flex-start;  /* Не space-between! */
}
.categories-scroll::-webkit-scrollbar { display: none; }
.categories-scroll button {
  flex: 0 0 auto;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  color: #000;
  border: none;
  cursor: pointer;
  transition: all 0.4s;
  text-align: center;
  outline: none;
  white-space: nowrap;
}
.categories-scroll button.active {
  background: #ffb700;
  color: #ffffff;
  font-weight: 600;
}

.section-header {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 16px 0 8px 16px;
  text-transform: uppercase;
}

.menu-main {
  width: 100%;
  padding: 12px 16px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 90px;
}

.no-items {
  color: #888;
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* ----------------- grid по 2 на мобиле ----------------- */
.dishes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* всегда 2 колонки */
  gap: 16px;
  margin-top: 8px;
}
.dishes-grid > * { min-height: 300px; }

@media (max-width: 600px) {
  .dishes-grid { grid-template-columns: repeat(2, 1fr); }
  .dish-image, .no-image { height: 120px; }
}

@media (max-width: 370px) {
  .dishes-grid { grid-template-columns: 1fr; }
}

/* --- карточка блюда --- */
.dish-card {
  position: relative;
  background: #000000;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #fff;
  transition: transform 0.3s;
  outline: none;
}
.dish-card:hover { transform: translateY(-4px); }

.dish-image {
  width: 100%;
  height: 144px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.no-image {
  width: 100%;
  height: 144px;
  display: flex; align-items: center; justify-content: center;
  background: #444;
  color: #888; font-size: 14px; font-weight: 500;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.dish-content{ padding:8px; display:flex; flex-direction:column; flex:1; }
.dish-title{ font-size:18px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.dish-weight{ font-size:13px; color:#bdbdbd; font-weight:400;}
.dish-nutrition{ font-size:12px; color:#c5c5c5; margin-top:8px; }
.dish-footer{ margin-top:10px; display:flex; justify-content:space-between; align-items:center; }
.dish-price{ font-size:20px; font-weight:700; color:#fff; }
.dish-rating{ display:flex; align-items:center; gap:4px; font-size:14px; color:#fff; }
.star-icon{ width:20px; height:20px; fill:none; stroke:#ffffff; stroke-width:1.8; }

.add-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 36px;
  background: #ffb700;
  color: #fff;
  border: none;
  border-radius:16px;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(.4,2,.6,1), box-shadow 0.2s;
}

.add-button.pop {
  animation: pop-scale 0.2s;
}

@keyframes pop-scale {
  0%   { transform: translateX(-50%) scale(1); }
  70%  { transform: translateX(-50%) scale(1.22); }
  100% { transform: translateX(-50%) scale(1); }
}

.menu-main::-webkit-scrollbar { width: 8px; }
.menu-main::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 4px; }
.menu-main::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
.menu-main::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
</style>
