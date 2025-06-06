<template>
  <div class="min-h-screen w-full bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ t('adminDashboard') }}</h1>
            <p class="text-gray-600 mt-1">{{ t('manageRestaurants') }}</p>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Language Selector -->
            <div class="relative">
              <button
                @click="showLangDropdown = !showLangDropdown"
                class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                </svg>
                <span class="text-sm text-gray-700">{{ getCurrentLanguageLabel() }}</span>
                <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              
              <div v-if="showLangDropdown" class="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[140px] z-50">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="selectLanguage(lang.code)"
                  :class="[
                    'w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm',
                    currentLanguage === lang.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  ]"
                >
                  {{ lang.label }}
                </button>
              </div>
            </div>

            <!-- Add Restaurant Button -->
            <button
              @click="showAdd = true"
              class="btn-primary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              {{ t('addRestaurant') }}
            </button>

            <!-- Logout Button -->
            <button
              @click="logout"
              class="btn-secondary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              {{ t('logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-3">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span class="text-gray-600">{{ t('loading') }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="restaurants.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('noRestaurants') }}</h3>
          <p class="text-gray-600 mb-6">{{ t('noRestaurantsDesc') }}</p>
          <button @click="showAdd = true" class="btn-primary">
            {{ t('addFirstRestaurant') }}
          </button>
        </div>
      </div>

      <!-- Restaurants Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Restaurant Image -->
          <div class="h-48 bg-gray-100 relative">
            <img
              v-if="restaurant.photo_path"
              :src="getRestaurantPhoto(restaurant.photo_path)"
              :alt="restaurant.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <!-- Restaurant Info -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ restaurant.name }}</h3>
            <p class="text-gray-600 mb-4">{{ restaurant.address }}</p>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="openEditRestaurant(restaurant.id)"
                class="btn-secondary text-sm"
              >
                {{ t('editDishes') }}
              </button>
              <button
                @click="goToMenu(restaurant)"
                class="btn-success text-sm"
              >
                {{ t('viewMenu') }}
              </button>
              <button
                @click="openAddDish(restaurant.id)"
                class="btn-warning text-sm"
              >
                {{ t('addDish') }}
              </button>
              <button
                @click="openSettings(restaurant.id)"
                class="btn-info text-sm"
              >
                {{ t('settings') }}
              </button>
            </div>

            <!-- Delete Button -->
            <button
              @click="deleteRestaurant(restaurant.id)"
              class="btn-danger w-full mt-3 text-sm"
            >
              {{ t('deleteRestaurant') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Restaurant Modal -->
    <div v-if="showAdd" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl relative mx-4">
        <button
          @click="showAdd = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-900">{{ t('addRestaurant') }}</h3>
        
        <form @submit.prevent="onAddRestaurant" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('restaurantName') }}</label>
            <input
              v-model="newName"
              type="text"
              :placeholder="t('restaurantNamePlaceholder')"
              class="input w-full"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('address') }}</label>
            <input
              v-model="newAddress"
              type="text"
              :placeholder="t('addressPlaceholder')"
              class="input w-full"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('restaurantPhoto') }}</label>
            <input
              type="file"
              @change="onPhotoChange"
              accept="image/*"
              class="input w-full"
            />
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loadingAdd"
          >
            <svg v-if="loadingAdd" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ loadingAdd ? t('adding') : t('addRestaurant') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Add Dish Modal -->
    <div v-if="showAddDish" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-xl relative mx-4 max-h-[90vh] overflow-y-auto">
        <button
          @click="showAddDish = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-900">
          {{ t('addDishFor') }} {{ selectedRestaurantName }}
        </h3>
        
        <form @submit.prevent="onAddDish" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('nameEn') }}</label>
              <input v-model="dishNameEn" type="text" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('nameRu') }}</label>
              <input v-model="dishNameRu" type="text" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('nameTr') }}</label>
              <input v-model="dishNameTr" type="text" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('nameDe') }}</label>
              <input v-model="dishNameDe" type="text" class="input w-full" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('descriptionEn') }}</label>
              <input v-model="dishDescriptionEn" type="text" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('descriptionRu') }}</label>
              <input v-model="dishDescriptionRu" type="text" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('descriptionTr') }}</label>
              <input v-model="dishDescriptionTr" type="text" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('descriptionDe') }}</label>
              <input v-model="dishDescriptionDe" type="text" class="input w-full" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('price') }}</label>
              <input v-model.number="dishPrice" type="number" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('dishPhoto') }}</label>
              <input type="file" @change="onImageChange" class="input w-full" accept="image/*" />
            </div>
          </div>

          <div v-if="loadingAI" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-3">
              <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span class="text-blue-700">{{ t('aiAnalyzing') }}</span>
            </div>
          </div>

          <div v-if="errorAI" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ errorAI }}</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('calories') }}</label>
              <input v-model.number="dishCalories" type="number" class="input w-full" step="0.1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('protein') }}</label>
              <input v-model.number="dishProtein" type="number" class="input w-full" step="0.1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('fat') }}</label>
              <input v-model.number="dishFat" type="number" class="input w-full" step="0.1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('carbs') }}</label>
              <input v-model.number="dishCarbs" type="number" class="input w-full" step="0.1" />
            </div>
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loadingAI"
          >
            {{ t('addDish') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Edit Dishes Modal -->
    <div v-if="showEdit" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white p-6 rounded-2xl w-full max-w-4xl shadow-xl relative mx-4 max-h-[90vh] overflow-y-auto">
        <button
          @click="showEdit = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-900">
          {{ t('editDishesFor') }} {{ selectedRestaurantName }}
        </h3>

        <div v-if="loadingEdit" class="flex items-center justify-center py-8">
          <div class="flex items-center gap-3">
            <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span class="text-gray-600">{{ t('loadingDishes') }}</span>
          </div>
        </div>

        <div v-if="errorEdit" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p class="text-red-700">{{ errorEdit }}</p>
        </div>

        <div v-if="dishes.length === 0 && !loadingEdit" class="text-center py-8">
          <p class="text-gray-600">{{ t('noDishesToEdit') }}</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="(dish, index) in dishes"
            :key="dish.id"
            class="bg-gray-50 rounded-lg p-6 border border-gray-200"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input v-model="dish.name_en" :placeholder="t('nameEn')" class="input" required />
              <input v-model="dish.name_ru" :placeholder="t('nameRu')" class="input" required />
              <input v-model="dish.name_tr" :placeholder="t('nameTr')" class="input" required />
              <input v-model="dish.name_de" :placeholder="t('nameDe')" class="input" required />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input v-model="dish.description_en" :placeholder="t('descriptionEn')" class="input" />
              <input v-model="dish.description_ru" :placeholder="t('descriptionRu')" class="input" />
              <input v-model="dish.description_tr" :placeholder="t('descriptionTr')" class="input" />
              <input v-model="dish.description_de" :placeholder="t('descriptionDe')" class="input" />
            </div>

            <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
              <input v-model.number="dish.price" :placeholder="t('price')" type="number" class="input" required />
              <input v-model.number="dish.calories" :placeholder="t('calories')" type="number" class="input" step="0.1" />
              <input v-model.number="dish.protein" :placeholder="t('protein')" type="number" class="input" step="0.1" />
              <input v-model.number="dish.fat" :placeholder="t('fat')" type="number" class="input" step="0.1" />
              <input v-model.number="dish.carbs" :placeholder="t('carbs')" type="number" class="input" step="0.1" />
              <input v-model="dish.image_url" :placeholder="t('imageUrl')" class="input" />
            </div>

            <button
              @click="saveDishChanges(dish, index)"
              class="btn-primary"
            >
              {{ t('saveDish') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white p-6 rounded-2xl w-full max-w-6xl shadow-xl relative mx-4 max-h-[90vh] overflow-y-auto">
        <button
          @click="closeSettings"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-900">
          {{ t('settingsFor') }} "{{ settingsName }}"
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Analytics Cards -->
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h4 class="text-lg font-semibold mb-2">{{ t('clientsToday') }}</h4>
              <div class="text-3xl font-bold">{{ clientsToday }}</div>
            </div>

            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h4 class="text-lg font-semibold mb-2">{{ t('totalSumToday') }}</h4>
              <div class="text-3xl font-bold">{{ totalSumToday }} ₽</div>
              <div class="text-sm opacity-90">{{ t('averageCheck') }}: {{ averageCheck }} ₽</div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-semibold mb-4 text-gray-900">{{ t('clientsList') }}</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-2 text-gray-600">{{ t('clientId') }}</th>
                      <th class="text-left py-2 text-gray-600">{{ t('tableNumber') }}</th>
                      <th class="text-left py-2 text-gray-600">{{ t('status') }}</th>
                      <th class="text-left py-2 text-gray-600">{{ t('sum') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="client in clientsList" :key="client.id" class="border-b border-gray-100">
                      <td class="py-2 text-gray-900">{{ client.id }}</td>
                      <td class="py-2 text-gray-900">{{ client.table }}</td>
                      <td class="py-2 text-gray-900">{{ client.status }}</td>
                      <td class="py-2 text-gray-900">{{ client.sum }} ₽</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Settings -->
          <div class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-semibold mb-4 text-gray-900">{{ t('menuSettings') }}</h4>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input type="checkbox" v-model="settings.displayKBFU" class="mr-3 accent-blue-600" />
                  <span class="text-gray-700">{{ t('displayKBFU') }}</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="settings.displayCookTime" class="mr-3 accent-blue-600" />
                  <span class="text-gray-700">{{ t('displayCookTime') }}</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="settings.displayWeight" class="mr-3 accent-blue-600" />
                  <span class="text-gray-700">{{ t('displayWeight') }}</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="settings.showDishRating" class="mr-3 accent-blue-600" />
                  <span class="text-gray-700">{{ t('showDishRating') }}</span>
                </label>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-semibold mb-4 text-gray-900">{{ t('loyalCustomers') }}</h4>
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <span class="text-gray-700">{{ t('enableLoyalProgram') }}:</span>
                  <button
                    @click="settings.loyalEnabled = true"
                    :class="settings.loyalEnabled ? 'btn-primary' : 'btn-secondary'"
                    class="text-sm px-3 py-1"
                  >
                    {{ t('yes') }}
                  </button>
                  <button
                    @click="settings.loyalEnabled = false"
                    :class="!settings.loyalEnabled ? 'btn-primary' : 'btn-secondary'"
                    class="text-sm px-3 py-1"
                  >
                    {{ t('no') }}
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <input
                    v-model.number="settings.loyalVisits"
                    type="number"
                    :placeholder="t('visits')"
                    class="input"
                  />
                  <input
                    v-model.number="settings.loyalSum"
                    type="number"
                    :placeholder="t('totalSum')"
                    class="input"
                  />
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-semibold mb-4 text-gray-900">{{ t('branding') }}</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('restaurantLogo') }}</label>
                  <input type="file" @change="onLogoChange" accept="image/*" class="input" />
                </div>
                <div v-if="settings.brandLogoUrl" class="flex items-center gap-4">
                  <img :src="settings.brandLogoUrl" alt="Logo" class="w-16 h-16 object-contain bg-gray-50 rounded-lg" />
                  <button @click="removeLogo" class="btn-danger text-sm">{{ t('removeLogo') }}</button>
                </div>
                <button @click="uploadLogo" class="btn-primary">{{ t('uploadLogo') }}</button>
              </div>
            </div>

            <button @click="saveSettings" class="btn-primary w-full">{{ t('saveSettings') }}</button>
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
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()

// Language management
const showLangDropdown = ref(false)
const currentLanguage = ref(locale.value)

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'de', label: 'Deutsch' }
]

function getCurrentLanguageLabel() {
  const lang = languages.find(l => l.code === currentLanguage.value)
  return lang ? lang.label : 'English'
}

function selectLanguage(code) {
  currentLanguage.value = code
  locale.value = code
  localStorage.setItem('lang', code)
  showLangDropdown.value = false
}

// Main state
const restaurants = ref([])
const loading = ref(true)
const loadingAdd = ref(false)
const error = ref('')

// Add restaurant
const showAdd = ref(false)
const newName = ref('')
const newAddress = ref('')
const restaurantPhoto = ref(null)

// Add dish
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

// Edit dishes
const showEdit = ref(false)
const dishes = ref([])
const loadingEdit = ref(false)
const errorEdit = ref('')

// Settings
const showSettings = ref(false)
const settingsRestaurantId = ref('')
const settingsName = ref('')
const settings = ref({
  loyalEnabled: false,
  loyalVisits: 0,
  loyalSum: 0,
  showDishRating: true,
  showDishConfigurator: false,
  displayKBFU: false,
  displayCookTime: false,
  displayWeight: false,
  displayNutritionalValue: false,
  brandLogoFile: null,
  brandLogoUrl: '',
})

// Analytics data
const clientsToday = ref(32)
const totalSumToday = ref(102400)
const averageCheck = ref(3200)
const clientsList = ref([
  { id: 101, table: 5, status: 'чек | вызов', sum: 3900 },
  { id: 102, table: 3, status: 'чек | вызов', sum: 5600 },
  { id: 103, table: 8, status: 'чек | вызов', sum: 2400 },
  { id: 104, table: 2, status: 'чек | вызов', sum: 1200 }
])

// Functions
function getRestaurantPhoto(photoPath) {
  if (!photoPath) return '/no-image.png'
  return supabase.storage.from('restaurants').getPublicUrl(photoPath).data.publicUrl
}

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
    error.value = t('errorLoadingRestaurants') + ': ' + err.message
  } finally {
    loading.value = false
  }
}

async function logout() {
  await supabase.auth.signOut()
  router.push('/admin/login')
}

function onPhotoChange(e) {
  const file = e.target.files[0]
  if (file) restaurantPhoto.value = file
}

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
    error.value = t('errorAddingRestaurant') + ': ' + err.message
  } finally {
    loadingAdd.value = false
  }
}

function goToMenu(rest) {
  router.push(`/menu/${rest.id}`)
}

async function deleteRestaurant(restaurantId) {
  const confirmDelete = confirm(t('confirmDeleteRestaurant'))
  if (!confirmDelete) return

  try {
    const { error: delError } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', restaurantId)
    if (delError) throw delError
    await fetchRestaurants()
  } catch (err) {
    alert(t('errorDeletingRestaurant') + ': ' + err.message)
  }
}

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

    if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`)

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
    errorAI.value = t('errorAnalyzingImage') + ': ' + err.message
  } finally {
    loadingAI.value = false
  }
}

async function onAddDish() {
  if (!dishImage.value) {
    errorAI.value = t('pleaseUploadImage')
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

    if (uploadError) throw new Error(t('errorUploadingImage') + ': ' + uploadError.message)

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
    errorAI.value = t('errorAddingDish') + ': ' + err.message
  } finally {
    loadingAI.value = false
  }
}

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
      errorEdit.value = t('errorLoadingDishes') + ': ' + err.message
    } finally {
      loadingEdit.value = false
      showEdit.value = true
    }
  }
}

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
    errorEdit.value = t('dishUpdatedSuccessfully')
    setTimeout(() => {
      errorEdit.value = ''
    }, 3000)
  } catch (err) {
    errorEdit.value = t('errorUpdatingDish') + ': ' + err.message
  }
}

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
    console.warn('Could not load settings:', err.message)
  } finally {
    loadingEdit.value = false
    showSettings.value = true
  }
}

function closeSettings() {
  showSettings.value = false
}

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
    alert(t('settingsSaved'))
  } catch (err) {
    alert(t('errorSavingSettings') + ': ' + err.message)
  }
}

function onLogoChange(e) {
  const file = e.target.files[0]
  if (!file) return
  settings.value.brandLogoFile = file
  settings.value.brandLogoUrl = URL.createObjectURL(file)
}

async function uploadLogo() {
  if (!settings.value.brandLogoFile) {
    alert(t('pleaseSelectLogoFile'))
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

    alert(t('logoUploaded'))
  } catch (err) {
    alert(t('errorUploadingLogo') + ': ' + err.message)
  }
}

async function removeLogo() {
  if (!settings.value.brandLogoUrl) return
  const confirmRemove = confirm(t('confirmRemoveLogo'))
  if (!confirmRemove) return

  try {
    const { error: updateError } = await supabase
      .from('restaurants')
      .update({ brand_logo_url: null })
      .eq('id', settingsRestaurantId.value)
    if (updateError) throw updateError

    settings.value.brandLogoUrl = ''
    settings.value.brandLogoFile = null
    alert(t('logoRemoved'))
  } catch (err) {
    alert(t('errorRemovingLogo') + ': ' + err.message)
  }
}

onMounted(fetchRestaurants)
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-4 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg py-2 px-4 transition-colors duration-200;
}

.btn-success {
  @apply bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg py-2 px-4 transition-colors duration-200;
}

.btn-warning {
  @apply bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg py-2 px-4 transition-colors duration-200;
}

.btn-info {
  @apply bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg py-2 px-4 transition-colors duration-200;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-2 px-4 transition-colors duration-200;
}

.input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200;
}

.input:focus {
  @apply bg-white;
}
</style>