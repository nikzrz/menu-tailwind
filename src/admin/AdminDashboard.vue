<template>
  <div class="min-h-screen w-full bg-white flex flex-col items-start p-6">
    <h2 class="text-4xl font-bold text-gray-900 mb-6">Мои рестораны / My Restaurants</h2>
    <div class="w-full max-w-6xl space-y-6 mx-auto">
      <!-- Ошибка загрузки -->
      <div v-if="error" class="text-red-400 text-center">{{ error }}</div>

      <!-- Список ресторанов -->
      <div
        v-if="restaurants.length > 0 && !loading"
        class="space-y-4"
      >
        <div
          v-for="rest in restaurants"
          :key="rest.id"
          class="bg-gray-50 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow"
        >
          <!-- Информация о ресторане -->
          <div class="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <img
              v-if="rest.photo_path"
              :src="getRestaurantPhoto(rest.photo_path)"
              alt="Фото ресторана"
              class="rest-photo"
            />
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ rest.name }}</div>
              <div class="text-gray-500 text-sm">{{ rest.address }}</div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              class="btn bg-blue-600 hover:bg-blue-500 text-white"
              @click="openEditRestaurant(rest.id)"
            >
              Редактировать / Edit
            </button>
            <button
              class="btn bg-green-600 hover:bg-green-500 text-white"
              @click="goToMenu(rest)"
            >
              Меню / Menu
            </button>
            <button
              class="btn bg-yellow-600 hover:bg-yellow-500 text-white"
              @click="openAddDish(rest.id)"
            >
              Добавить блюдо / Add Dish
            </button>
            <button
              class="btn bg-red-600 hover:bg-red-500 text-white"
              @click="deleteRestaurant(rest.id)"
            >
              Удалить / Delete
            </button>
            <button
              class="btn bg-purple-600 hover:bg-purple-500 text-white"
              @click="openSettings(rest.id)"
            >
              Настройки / Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Когда нет ресторанов -->
      <div v-if="restaurants.length === 0 && !loading" class="text-gray-500 text-center">
        Нет ресторанов / No restaurants
      </div>

      <!-- Кнопка добавить ресторан -->
      <div class="flex justify-center">
        <button
          v-if="!loading"
          class="mt-8 btn bg-green-600 hover:bg-green-500 text-white w-full max-w-sm"
          @click="showAdd = true"
        >
          + Добавить ресторан / + Add Restaurant
        </button>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="text-center text-yellow-600">Загрузка... / Loading...</div>
    </div>

    <!-- Модалка добавления ресторана -->
    <div v-if="showAdd" class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div class="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg relative">
        <button
          @click="showAdd = false"
          class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h3 class="text-2xl font-bold mb-4 text-gray-900">Добавить ресторан / Add Restaurant</h3>
        <form @submit.prevent="onAddRestaurant" class="flex flex-col gap-3">
          <input
            v-model="newName"
            type="text"
            placeholder="Название / Name"
            class="input"
            required
          />
          <input
            v-model="newAddress"
            type="text"
            placeholder="Адрес / Address"
            class="input"
            required
          />
          <!-- Инпут для фото ресторана -->
          <input
            type="file"
            @change="onPhotoChange"
            accept="image/*"
            class="input"
          />
          <button
            type="submit"
            class="btn bg-green-600 hover:bg-green-500 text-white w-full"
            :disabled="loadingAdd"
          >
            {{ loadingAdd ? 'Добавляем...' : 'Добавить' }}
            /
            {{ loadingAdd ? 'Adding...' : 'Add' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Модалка добавления блюда -->
    <div v-if="showAddDish" class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div
        class="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg relative overflow-y-auto"
        style="max-height: 80vh;"
      >
        <button
          @click="showAddDish = false"
          class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h3 class="text-2xl font-bold mb-4 text-gray-900">
          Добавить блюдо для {{ selectedRestaurantName }} / Add Dish for
          {{ selectedRestaurantName }}
        </h3>
        <form @submit.prevent="onAddDish" class="flex flex-col gap-3">
          <input
            v-model="dishNameEn"
            type="text"
            placeholder="Название (EN) / Name (EN)"
            class="input"
            required
          />
          <input
            v-model="dishNameRu"
            type="text"
            placeholder="Название (RU) / Name (RU)"
            class="input"
            required
          />
          <input
            v-model="dishNameTr"
            type="text"
            placeholder="Название (TR) / Name (TR)"
            class="input"
            required
          />
          <input
            v-model="dishNameDe"
            type="text"
            placeholder="Название (DE) / Name (DE)"
            class="input"
            required
          />
          <input
            v-model="dishDescriptionEn"
            type="text"
            placeholder="Описание (EN) / Description (EN)"
            class="input"
          />
          <input
            v-model="dishDescriptionRu"
            type="text"
            placeholder="Описание (RU) / Description (RU)"
            class="input"
          />
          <input
            v-model="dishDescriptionTr"
            type="text"
            placeholder="Описание (TR) / Description (TR)"
            class="input"
          />
          <input
            v-model="dishDescriptionDe"
            type="text"
            placeholder="Описание (DE) / Description (DE)"
            class="input"
          />
          <input
            v-model.number="dishPrice"
            type="number"
            placeholder="Цена / Price"
            class="input"
            required
          />
          <input
            type="file"
            @change="onImageChange"
            class="input mb-2"
            accept="image/*"
          />
          <div v-if="loadingAI" class="text-yellow-600 text-sm mb-2">
            AI анализирует фото... / AI analyzing photo...
          </div>
          <div v-if="errorAI" class="text-red-400 text-sm mb-2">{{ errorAI }}</div>
          <input
            v-model.number="dishCalories"
            type="number"
            placeholder="Калории / Calories"
            class="input"
            step="0.1"
          />
          <input
            v-model.number="dishProtein"
            type="number"
            placeholder="Белки (г) / Protein (g)"
            class="input"
            step="0.1"
          />
          <input
            v-model.number="dishFat"
            type="number"
            placeholder="Жиры (г) / Fat (g)"
            class="input"
            step="0.1"
          />
          <input
            v-model.number="dishCarbs"
            type="number"
            placeholder="Углеводы (г) / Carbs (g)"
            class="input"
            step="0.1"
          />
          <button
            type="submit"
            class="btn bg-green-600 hover:bg-green-500 text-white w-full"
            :disabled="loadingAI"
          >
            Добавить / Add
          </button>
        </form>
      </div>
    </div>

    <!-- Модалка редактирования блюд -->
    <div v-if="showEdit" class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div
        class="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg relative overflow-y-auto"
        style="max-height: 80vh;"
      >
        <button
          @click="showEdit = false"
          class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h3 class="text-2xl font-bold mb-4 text-gray-900">
          Редактировать блюда для {{ selectedRestaurantName }} / Edit Dishes for
          {{ selectedRestaurantName }}
        </h3>
        <div v-if="loadingEdit" class="text-yellow-600 text-center mb-4">
          Загрузка блюд... / Loading dishes...
        </div>
        <div v-if="errorEdit" class="text-red-400 text-center mb-4">{{ errorEdit }}</div>
        <div
          v-if="dishes.length === 0 && !loadingEdit"
          class="text-gray-500 text-center mb-4"
        >
          Нет блюд для редактирования (restaurant_id: {{ selectedRestaurantId }})
          / No dishes to edit (restaurant_id: {{ selectedRestaurantId }})
        </div>
        <div v-for="(dish, index) in dishes" :key="dish.id" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <input
            v-model="dish.name_en"
            type="text"
            placeholder="Название (EN) / Name (EN)"
            class="input mb-2 w-full"
            required
          />
          <input
            v-model="dish.name_ru"
            type="text"
            placeholder="Название (RU) / Name (RU)"
            class="input mb-2 w-full"
            required
          />
          <input
            v-model="dish.name_tr"
            type="text"
            placeholder="Название (TR) / Name (TR)"
            class="input mb-2 w-full"
            required
          />
          <input
            v-model="dish.name_de"
            type="text"
            placeholder="Название (DE) / Name (DE)"
            class="input mb-2 w-full"
            required
          />
          <input
            v-model="dish.description_en"
            type="text"
            placeholder="Описание (EN) / Description (EN)"
            class="input mb-2 w-full"
          />
          <input
            v-model="dish.description_ru"
            type="text"
            placeholder="Описание (RU) / Description (RU)"
            class="input mb-2 w-full"
          />
          <input
            v-model="dish.description_tr"
            type="text"
            placeholder="Описание (TR) / Description (TR)"
            class="input mb-2 w-full"
          />
          <input
            v-model="dish.description_de"
            type="text"
            placeholder="Описание (DE) / Description (DE)"
            class="input mb-2 w-full"
          />
          <input
            v-model.number="dish.price"
            type="number"
            placeholder="Цена / Price"
            class="input mb-2 w-full"
            required
          />
          <input
            v-model="dish.image_url"
            type="text"
            placeholder="URL изображения / Image URL"
            class="input mb-2 w-full"
          />
          <input
            v-model.number="dish.calories"
            type="number"
            placeholder="Калории / Calories"
            class="input mb-2 w-full"
            step="0.1"
          />
          <input
            v-model.number="dish.protein"
            type="number"
            placeholder="Белки (г) / Protein (g)"
            class="input mb-2 w-full"
            step="0.1"
          />
          <input
            v-model.number="dish.fat"
            type="number"
            placeholder="Жиры (г) / Fat (g)"
            class="input mb-2 w-full"
            step="0.1"
          />
          <input
            v-model.number="dish.carbs"
            type="number"
            placeholder="Углеводы (г) / Carbs (g)"
            class="input mb-2 w-full"
            step="0.1"
          />
          <button
            @click="saveDishChanges(dish, index)"
            class="btn bg-blue-600 hover:bg-blue-500 text-white w-full"
          >
            Сохранить / Save
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка настроек ресторана -->
    <div v-if="showSettings" class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div
        class="bg-white p-6 rounded-2xl w-full max-w-5xl shadow-lg relative overflow-y-auto"
        style="max-height: 90vh;"
      >
        <button
          @click="closeSettings"
          class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h3 class="text-3xl font-bold mb-6 text-gray-900">
          Настройки "{{ settingsName }}" / Settings for "{{ settingsName }}"
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Левая колонка -->
          <div class="space-y-6">
            <!-- Карточка "Клиентов сегодня" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xl font-semibold text-gray-900 mb-2">Клиентов сегодня</div>
              <div class="text-4xl font-bold text-yellow-600">{{ clientsToday }}</div>
              <div class="text-gray-500 text-sm">Клиентов сегодня</div>
            </div>

            <!-- Карточка "Общая сумма заказов за сегодня" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xl font-semibold text-gray-900 mb-2">Общая сумма заказов за сегодня</div>
              <div class="text-4xl font-bold text-yellow-600">{{ totalSumToday }} ₽</div>
              <div class="text-gray-500 text-sm">{{ averageCheck }} ₽ / средний чек</div>
            </div>

            <!-- Карточка "Список клиентов/столов" -->
            <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <div class="text-xl font-semibold text-gray-900 mb-2">Список клиентов/столов</div>
              <table class="w-full table-auto text-left">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="py-2 px-1 text-gray-900">ID клиента</th>
                    <th class="py-2 px-1 text-gray-900">Номер стола</th>
                    <th class="py-2 px-1 text-gray-900">Статус</th>
                    <th class="py-2 px-1 text-gray-900">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="client in clientsList"
                    :key="client.id"
                    class="border-b border-gray-100"
                  >
                    <td class="py-2 px-1 text-gray-700">{{ client.id }}</td>
                    <td class="py-2 px-1 text-gray-700">{{ client.table }}</td>
                    <td class="py-2 px-1 text-gray-700">{{ client.status }}</td>
                    <td class="py-2 px-1 text-gray-700">{{ client.sum }} ₽</td>
                  </tr>
                  <tr v-if="clientsList.length === 0">
                    <td colspan="4" class="py-2 text-gray-500 text-center">
                      Нет данных / No data
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Карточка "Рейтинг блюд" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xl font-semibold text-gray-900 mb-2">Рейтинг блюд</div>
              <div class="flex flex-col space-y-2">
                <label class="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    class="mr-2 accent-yellow-600"
                    v-model="settings.showDishRating"
                  />
                  Отображать/не отображать
                </label>
                <button
                  @click="resetAllDishRatings"
                  class="btn bg-red-600 hover:bg-red-500 text-white mt-2"
                >
                  Сбросить рейтинг всех блюд / Reset all dish ratings
                </button>
                <label class="flex items-center text-gray-700 mt-2">
                  <input
                    type="checkbox"
                    class="mr-2 accent-yellow-600"
                    v-model="settings.showDishConfigurator"
                  />
                  Отображать конфигуратор блюд / Show dish configurator
                </label>
              </div>
            </div>

            <!-- Карточка "Настройки меню" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xl font-semibold text-gray-900 mb-2">Настройки меню</div>
              <div class="flex flex-col space-y-2 text-gray-700">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="mr-2 accent-yellow-600"
                    v-model="settings.displayKBFU"
                  />
                  отображать КБЖУ
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="mr-2 accent-yellow-600"
                    v-model="settings.displayCookTime"
                  />
                  отображать время готовки
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="mr-2 accent-yellow-600"
                    v-model="settings.displayWeight"
                  />
                  отображать вес
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="mr-2 accent-yellow-600"
                    v-model="settings.displayNutritionalValue"
                  />
                  отображать пищ. ценность
                </label>
                <button
                  @click="deleteMenu"
                  class="btn bg-red-600 hover:bg-red-500 text-white mt-2"
                >
                  удалить меню / Delete menu
                </button>
                <button
                  @click="scanPrintedMenu"
                  class="btn bg-blue-600 hover:bg-blue-500 text-white mt-2"
                >
                  отсканировать печатное меню / Scan printed menu
                </button>
              </div>
            </div>
          </div>

          <!-- Правая колонка -->
          <div class="space-y-6">
            <!-- Карточка "Постоянные клиенты" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xl font-semibold text-gray-900 mb-2">Постоянные клиенты</div>
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-gray-700">Информировать о постоянных клиентах:</span>
                <button
                  @click="settings.loyalEnabled = true"
                  :class="settings.loyalEnabled ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'"
                  class="px-3 py-1 rounded-lg"
                >
                  Да
                </button>
                <button
                  @click="settings.loyalEnabled = false"
                  :class="!settings.loyalEnabled ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'"
                  class="px-3 py-1 rounded-lg"
                >
                  Нет
                </button>
              </div>
              <div class="flex flex-col space-y-2">
                <div class="flex items-center space-x-2">
                  <input
                    v-model.number="settings.loyalVisits"
                    type="number"
                    min="0"
                    placeholder="X визитов"
                    class="input w-1/2"
                  />
                  <span class="text-gray-500">/</span>
                  <input
                    v-model.number="settings.loyalSum"
                    type="number"
                    min="0"
                    placeholder="X суммы"
                    class="input w-1/2"
                  />
                </div>
                <button
                  @click="saveSettings"
                  class="btn bg-green-600 hover:bg-green-500 text-white mt-2"
                >
                  Сохранить настройки / Save Settings
                </button>
              </div>
            </div>

            <!-- Карточка "Меню и управление блюдами" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="text-xl font-semibold text-gray-900">Меню и управление блюдами</div>
                <button
                  class="btn bg-blue-600 hover:bg-blue-500 text-white text-sm"
                  @click="openAddDish(settingsRestaurantId)"
                >
                  + Добавить блюдо / + Add Dish
                </button>
              </div>
              <div class="flex flex-col space-y-2">
                <input
                  v-model="newCategory"
                  type="text"
                  placeholder="Новая категория / New category"
                  class="input"
                />
                <button
                  @click="addCategory"
                  class="btn bg-blue-600 hover:bg-blue-500 text-white"
                >
                  + Добавить категорию / + Add category
                </button>
              </div>
            </div>

            <!-- Карточка "Аналитика" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xl font-semibold text-gray-900 mb-2">Апрель 2024 / April 2024</div>
              <div class="overflow-x-auto">
                <table class="w-full table-auto text-left">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="py-2 px-1 text-gray-900">Пн</th>
                      <th class="py-2 px-1 text-gray-900">Вт</th>
                      <th class="py-2 px-1 text-gray-900">Ср</th>
                      <th class="py-2 px-1 text-gray-900">Чт</th>
                      <th class="py-2 px-1 text-gray-900">Пт</th>
                      <th class="py-2 px-1 text-gray-900">Сб</th>
                      <th class="py-2 px-1 text-gray-900">Вс</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="week in analyticsCalendar" :key="week[0].date">
                      <td
                        v-for="day in week"
                        :key="day.date"
                        class="py-2 px-1 align-top h-28 border-b border-gray-100"
                      >
                        <div class="text-gray-900">{{ day.day }}</div>
                        <div class="text-yellow-600 font-bold text-sm mt-1">{{ day.sum }} ₽</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Карточка "Брендирование" -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xl font-semibold text-gray-900 mb-2">Брендирование</div>
              <div class="flex flex-col space-y-4">
                <div>
                  <label class="text-gray-700 mb-1 block">Логотип заведения / Restaurant Logo:</label>
                  <input
                    type="file"
                    @change="onLogoChange"
                    accept="image/*"
                    class="input"
                  />
                </div>
                <div v-if="settings.brandLogoUrl" class="flex items-center space-x-4">
                  <img
                    :src="settings.brandLogoUrl"
                    alt="Logo Preview"
                    class="w-24 h-24 object-contain bg-gray-50 rounded-lg"
                  />
                  <button
                    @click="removeLogo"
                    class="btn bg-red-600 hover:bg-red-500 text-white"
                  >
                    Удалить логотип / Remove Logo
                  </button>
                </div>
                <button
                  @click="uploadLogo"
                  class="btn bg-green-600 hover:bg-green-500 text-white"
                >
                  Загрузить логотип / Upload Logo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import { useRouter } from 'vue-router'

// Основное состояние
const restaurants = ref([])
const loading = ref(true)
const loadingAdd = ref(false)
const error = ref('')
const router = useRouter()

// Добавление ресторана
const showAdd = ref(false)
const newName = ref('')
const newAddress = ref('')
const restaurantPhoto = ref(null)

// Добавление блюда
const showAddDish = ref(false)
const selectedRestaurantId = ref('')
const selectedRestaurantName = ref('')
const dishNameEn = ref('')
const dishNameRu = ref('')
const dishNameTr = ref('')
const dishNameDe = ref('')
const dishDescriptionEn = ref('')
const dishDescriptionRu = ref('')
const dishDescriptionTr = ref('')
const dishDescriptionDe = ref('')
const dishPrice = ref('')
const dishImage = ref(null)
const dishCalories = ref('')
const dishProtein = ref('')
const dishFat = ref('')
const dishCarbs = ref('')
const loadingAI = ref(false)
const errorAI = ref('')

// Редактирование блюд
const showEdit = ref(false)
const dishes = ref([])
const loadingEdit = ref(false)
const errorEdit = ref('')

// Настройки ресторана
const showSettings = ref(false)
const settingsRestaurantId = ref('')
const settingsName = ref('')
const settings = ref({
  // Loyal customers
  loyalEnabled: false,
  loyalVisits: 0,
  loyalSum: 0,
  // Dish rating
  showDishRating: true,
  showDishConfigurator: false,
  // Menu settings
  displayKBFU: false,
  displayCookTime: false,
  displayWeight: false,
  displayNutritionalValue: false,
  // Branding
  brandLogoFile: null,
  brandLogoUrl: '',
})
// Данные для карточек аналитики и клиентов
const clientsToday = ref(0)
const totalSumToday = ref(0)
const averageCheck = ref(0)
const clientsList = ref([])
const analyticsCalendar = ref([])
const newCategory = ref('')

// Получить публичный URL фото ресторана
function getRestaurantPhoto(photoPath) {
  if (!photoPath) return '/no-image.png'
  return supabase.storage.from('restaurants').getPublicUrl(photoPath).data.publicUrl
}

// Загрузка списка ресторанов
async function fetchRestaurants() {
  loading.value = true
  error.value = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/admin/login')
    const userId = session.user.id
    const { data, error: fetchError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    if (fetchError) throw fetchError
    restaurants.value = data || []
  } catch (err) {
    error.value = 'Ошибка загрузки ресторанов: ' + err.message
  } finally {
    loading.value = false
  }
}

// При монтировании получаем список
onMounted(fetchRestaurants)

// Обработка выбора фото для ресторана
function onPhotoChange(e) {
  const file = e.target.files[0]
  if (file) restaurantPhoto.value = file
}

// Добавление ресторана
async function onAddRestaurant() {
  loadingAdd.value = true
  error.value = ''
  let photoUrl = null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/admin/login')
    const userId = session.user.id

    if (restaurantPhoto.value) {
      const fileExt = restaurantPhoto.value.name.split('.').pop()
      const fileName = `rest_${Date.now()}.${fileExt}`
      const filePath = `public/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('restaurants')
        .upload(filePath, restaurantPhoto.value)
      if (uploadError) throw uploadError

      const { publicUrl } = supabase.storage.from('restaurants').getPublicUrl(filePath).data
      photoUrl = publicUrl
    }

    const { error: insertError } = await supabase.from('restaurants').insert([{
      name: newName.value,
      address: newAddress.value,
      owner_id: userId,
      photo_path: photoUrl,
      loyal_enabled: false,
      loyal_visits: 0,
      loyal_sum: 0,
      show_dish_rating: true,
      show_dish_configurator: false,
      display_kbfu: false,
      display_cook_time: false,
      display_weight: false,
      display_nutritional_value: false,
      brand_logo_url: null,
    }])
    if (insertError) throw insertError

    showAdd.value = false
    newName.value = ''
    newAddress.value = ''
    restaurantPhoto.value = null
    await fetchRestaurants()
  } catch (err) {
    error.value = 'Ошибка добавления ресторана: ' + err.message
  } finally {
    loadingAdd.value = false
  }
}

// Переход к странице меню ресторана
function goToMenu(rest) {
  router.push(`/menu/${rest.id}`)
}

// Удаление ресторана
async function deleteRestaurant(restaurantId) {
  const confirmDelete = confirm('Вы уверены, что хотите удалить этот ресторан? / Are you sure you want to delete this restaurant?')
  if (!confirmDelete) return

  try {
    const { error: delError } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', restaurantId)
    if (delError) throw delError
    await fetchRestaurants()
  } catch (err) {
    alert('Ошибка удаления ресторана: ' + err.message)
  }
}

// Открытие модалки добавления блюда
function openAddDish(restaurantId) {
  const restaurant = restaurants.value.find(r => r.id === restaurantId)
  if (restaurant) {
    selectedRestaurantId.value = restaurantId
    selectedRestaurantName.value = restaurant.name
    dishNameEn.value = ''
    dishNameRu.value = ''
    dishNameTr.value = ''
    dishNameDe.value = ''
    dishDescriptionEn.value = ''
    dishDescriptionRu.value = ''
    dishDescriptionTr.value = ''
    dishDescriptionDe.value = ''
    dishPrice.value = ''
    dishImage.value = null
    dishCalories.value = ''
    dishProtein.value = ''
    dishFat.value = ''
    dishCarbs.value = ''
    errorAI.value = ''
    showAddDish.value = true
  }
}

// Обработка фото для AI-анализа блюда
async function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  dishImage.value = file
  loadingAI.value = true
  errorAI.value = ''

  try {
    const formData = new FormData()
    formData.append('photo', file)
    const res = await fetch('http://localhost:8000/generate-dish-info', {
      method: 'POST',
      body: formData
    })

    if (!res.ok) throw new Error(`Ошибка API: ${res.status} - ${res.statusText}`)

    const data = await res.json()
    dishNameEn.value = data.caption_en || ''
    dishNameRu.value = data.caption_ru || ''
    dishNameTr.value = data.caption_tr || ''
    dishNameDe.value = data.caption_de || ''
    dishDescriptionEn.value = data.description_en || ''
    dishDescriptionRu.value = data.description_ru || ''
    dishDescriptionTr.value = data.description_tr || ''
    dishDescriptionDe.value = data.description_de || ''
    dishCalories.value = data.nutrition?.calories || ''
    dishProtein.value = data.nutrition?.protein || ''
    dishFat.value = data.nutrition?.fat || ''
    dishCarbs.value = data.nutrition?.carbs || ''
  } catch (err) {
    errorAI.value = 'Ошибка анализа изображения: ' + err.message
  } finally {
    loadingAI.value = false
  }
}

// Добавление блюда в базу
async function onAddDish() {
  if (!dishImage.value) {
    errorAI.value = 'Пожалуйста, загрузите изображение / Please upload an image'
    return
  }

  loadingAI.value = true
  errorAI.value = ''
  try {
    const fileExt = dishImage.value.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('dishes')
      .upload(`public/${fileName}`, dishImage.value)

    if (uploadError) throw new Error('Ошибка загрузки изображения: ' + uploadError.message)

    const { publicUrl } = supabase.storage.from('dishes').getPublicUrl(`public/${fileName}`).data

    const { error: insertError } = await supabase.from('dishes').insert([{
      restaurant_id: selectedRestaurantId.value,
      name_en: dishNameEn.value,
      name_ru: dishNameRu.value,
      name_tr: dishNameTr.value,
      name_de: dishNameDe.value,
      description_en: dishDescriptionEn.value || null,
      description_ru: dishDescriptionRu.value || null,
      description_tr: dishDescriptionTr.value || null,
      description_de: dishDescriptionDe.value || null,
      price: parseFloat(dishPrice.value) || 0,
      image_url: publicUrl,
      calories: dishCalories.value ? parseFloat(dishCalories.value) : null,
      protein: dishProtein.value ? parseFloat(dishProtein.value) : null,
      fat: dishFat.value ? parseFloat(dishFat.value) : null,
      carbs: dishCarbs.value ? parseFloat(dishCarbs.value) : null,
      created_at: new Date()
    }])
    if (insertError) throw insertError

    showAddDish.value = false
    await openEditRestaurant(selectedRestaurantId.value)
  } catch (err) {
    errorAI.value = 'Ошибка добавления блюда: ' + err.message
  } finally {
    loadingAI.value = false
  }
}

// Открытие модалки редактирования блюд
async function openEditRestaurant(restaurantId) {
  const restaurant = restaurants.value.find(r => r.id === restaurantId)
  if (restaurant) {
    selectedRestaurantId.value = restaurantId
    selectedRestaurantName.value = restaurant.name
    loadingEdit.value = true
    errorEdit.value = ''
    try {
      const { data, error: fetchError } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
      if (fetchError) throw fetchError
      dishes.value = data || []
    } catch (err) {
      errorEdit.value = 'Ошибка загрузки блюд: ' + err.message
    } finally {
      loadingEdit.value = false
      showEdit.value = true
    }
  }
}

// Сохранение изменений блюда
async function saveDishChanges(dish, index) {
  try {
    const { error: updateError } = await supabase
      .from('dishes')
      .update({
        name_en: dish.name_en,
        name_ru: dish.name_ru,
        name_tr: dish.name_tr,
        name_de: dish.name_de,
        description_en: dish.description_en || null,
        description_ru: dish.description_ru || null,
        description_tr: dish.description_tr || null,
        description_de: dish.description_de || null,
        price: parseFloat(dish.price) || 0,
        image_url: dish.image_url,
        calories: dish.calories ? parseFloat(dish.calories) : null,
        protein: dish.protein ? parseFloat(dish.protein) : null,
        fat: dish.fat ? parseFloat(dish.fat) : null,
        carbs: dish.carbs ? parseFloat(dish.carbs) : null
      })
      .eq('id', dish.id)
    if (updateError) throw updateError
    errorEdit.value = 'Блюдо успешно обновлено! / Dish successfully updated!'
    setTimeout(() => {
      errorEdit.value = ''
    }, 3000)
  } catch (err) {
    errorEdit.value = 'Ошибка обновления блюда: ' + err.message
  }
}

// Открытие модалки настроек ресторана
async function openSettings(restaurantId) {
  const restaurant = restaurants.value.find(r => r.id === restaurantId)
  if (!restaurant) return

  settingsRestaurantId.value = restaurantId
  settingsName.value = restaurant.name
  loadingEdit.value = true
  try {
    const { data, error: fetchError } = await supabase
      .from('restaurants')
      .select(`
        loyal_enabled,
        loyal_visits,
        loyal_sum,
        show_dish_rating,
        show_dish_configurator,
        display_kbfu,
        display_cook_time,
        display_weight,
        display_nutritional_value,
        brand_logo_url
      `)
      .eq('id', restaurantId)
      .single()
    if (fetchError) throw fetchError

    settings.value.loyalEnabled = data.loyal_enabled
    settings.value.loyalVisits = data.loyal_visits
    settings.value.loyalSum = data.loyal_sum
    settings.value.showDishRating = data.show_dish_rating
    settings.value.showDishConfigurator = data.show_dish_configurator
    settings.value.displayKBFU = data.display_kbfu
    settings.value.displayCookTime = data.display_cook_time
    settings.value.displayWeight = data.display_weight
    settings.value.displayNutritionalValue = data.display_nutritional_value
    settings.value.brandLogoUrl = data.brand_logo_url || ''
  } catch (err) {
    console.warn('Не удалось загрузить настройки:', err.message)
  } finally {
    loadingEdit.value = false
    loadClientsData(restaurantId)
    loadAnalyticsData(restaurantId)
    showSettings.value = true
  }
}

// Закрытие модалки настроек
function closeSettings() {
  showSettings.value = false
}

// Сохранение настроек ресторана
async function saveSettings() {
  try {
    const {
      loyalEnabled,
      loyalVisits,
      loyalSum,
      showDishRating,
      showDishConfigurator,
      displayKBFU,
      displayCookTime,
      displayWeight,
      displayNutritionalValue,
      brandLogoUrl
    } = settings.value

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({
        loyal_enabled: loyalEnabled,
        loyal_visits: loyalVisits,
        loyal_sum: loyalSum,
        show_dish_rating: showDishRating,
        show_dish_configurator: showDishConfigurator,
        display_kbfu: displayKBFU,
        display_cook_time: displayCookTime,
        display_weight: displayWeight,
        display_nutritional_value: displayNutritionalValue,
        brand_logo_url: brandLogoUrl
      })
      .eq('id', settingsRestaurantId.value)
    if (updateError) throw updateError
    alert('Настройки сохранены / Settings saved')
  } catch (err) {
    alert('Ошибка сохранения настроек: ' + err.message)
  }
}

// Сбросить рейтинг всех блюд
async function resetAllDishRatings() {
  const confirmReset = confirm('Вы уверены, что хотите сбросить рейтинг всех блюд? / Are you sure you want to reset all dish ratings?')
  if (!confirmReset) return

  try {
    const { error: resetError } = await supabase
      .from('dishes')
      .update({ rating: null })
      .eq('restaurant_id', settingsRestaurantId.value)
    if (resetError) throw resetError
    alert('Рейтинги блюд сброшены / All dish ratings reset')
  } catch (err) {
    alert('Ошибка сброса рейтинга блюд: ' + err.message)
  }
}

// Удалить меню
function deleteMenu() {
  alert('Функция удаления меню пока не реализована / Delete menu not implemented yet')
}

// Отсканировать печатное меню
function scanPrintedMenu() {
  alert('Функция сканирования печатного меню пока не реализована / Scan printed menu not implemented yet')
}

// Загрузка списка клиентов и их данных
function loadClientsData(restaurantId) {
  clientsToday.value = 32
  totalSumToday.value = 102400
  averageCheck.value = 3200
  clientsList.value = [
    { id: 101, table: 5, status: 'чек | вызов', sum: 3900 },
    { id: 102, table: 3, status: 'чек | вызов', sum: 5600 },
    { id: 103, table: 8, status: 'чек | вызов', sum: 2400 },
    { id: 104, table: 2, status: 'чек | вызов', sum: 1200 }
  ]
}

// Загрузка данных аналитики
function loadAnalyticsData(restaurantId) {
  const april = []
  const start = new Date(2024, 3, 1)
  const startDay = new Date(start)
  const dayOfWeek = startDay.getDay() || 7
  startDay.setDate(startDay.getDate() - (dayOfWeek - 1))

  for (let w = 0; w < 5; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDay)
      date.setDate(startDay.getDate() + w * 7 + d)
      const month = date.getMonth()
      const day = date.getDate()
      let sum = ''
      if (month === 3) {
        sum = Math.floor(Math.random() * 100000 / 100) * 100
      }
      week.push({
        date: date.toISOString().split('T')[0],
        day,
        sum: sum ? sum : ''
      })
    }
    april.push(week)
  }
  analyticsCalendar.value = april
}

// Обработка загрузки логотипа
function onLogoChange(e) {
  const file = e.target.files[0]
  if (!file) return
  settings.value.brandLogoFile = file
  settings.value.brandLogoUrl = URL.createObjectURL(file)
}

// Загрузка логотипа в хранилище
async function uploadLogo() {
  if (!settings.value.brandLogoFile) {
    alert('Пожалуйста, выберите файл логотипа / Please select a logo file')
    return
  }
  try {
    const fileExt = settings.value.brandLogoFile.name.split('.').pop()
    const fileName = `logo_${settingsRestaurantId.value}_${Date.now()}.${fileExt}`
    const filePath = `logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('restaurants')
      .upload(filePath, settings.value.brandLogoFile, { cacheControl: '3600', upsert: true })
    if (uploadError) throw uploadError

    const { publicUrl } = supabase.storage.from('restaurants').getPublicUrl(filePath).data
    settings.value.brandLogoUrl = publicUrl

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({ brand_logo_url: publicUrl })
      .eq('id', settingsRestaurantId.value)
    if (updateError) throw updateError

    alert('Логотип сохранен / Logo uploaded')
  } catch (err) {
    alert('Ошибка загрузки логотипа: ' + err.message)
  }
}

// Удалить логотип
async function removeLogo() {
  if (!settings.value.brandLogoUrl) return
  const confirmRemove = confirm('Удалить логотип? / Remove logo?')
  if (!confirmRemove) return

  try {
    const { error: updateError } = await supabase
      .from('restaurants')
      .update({ brand_logo_url: null })
      .eq('id', settingsRestaurantId.value)
    if (updateError) throw updateError

    settings.value.brandLogoUrl = ''
    settings.value.brandLogoFile = null
    alert('Логотип удален / Logo removed')
  } catch (err) {
    alert('Ошибка удаления логотипа: ' + err.message)
  }
}

// Добавление категории меню
function addCategory() {
  if (!newCategory.value.trim()) {
    alert('Введите название категории / Please enter a category name')
    return
  }
  alert(`Категория "${newCategory.value}" добавлена / Category "${newCategory.value}" added`)
  newCategory.value = ''
}
</script>

<style scoped>
.btn {
  @apply font-bold rounded-xl py-2 px-4 transition shadow;
}
.input {
  @apply bg-gray-50 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition border border-gray-200;
}
.rest-photo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 14px;
  background: #f3f4f6;
  margin-right: 16px;
}
</style>