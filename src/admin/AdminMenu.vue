<template>
  <div class="min-h-screen bg-dark-bg text-white p-6">
    <h2 class="text-2xl font-bold mb-6">Меню ресторана</h2>

    <div v-if="categories.length === 0" class="mb-6 text-gray-400">Нет категорий</div>
    <div v-else>
      <div v-for="cat in categories" :key="cat.id" class="mb-4">
        <div class="flex items-center gap-2 mb-1">
          <div class="font-semibold text-lg">{{ cat[`name_${locale}`] || cat.name_en }}</div>
          <button @click="editCategory(cat)" class="text-xs text-yellow-400">Редактировать</button>
          <button @click="deleteCategory(cat.id)" class="text-xs text-red-400">Удалить</button>
        </div>
        <ul class="ml-4">
          <li
            v-for="dish in dishes.filter(d => d.category_id === cat.id)"
            :key="dish.id"
            class="flex items-center justify-between py-1"
          >
            <span>{{ dish[`name_${locale}`] || dish.name_en }} — {{ dish.price }}₽</span>
            <span>
              <button @click="editDish(dish)" class="text-xs text-yellow-400">✎</button>
              <button @click="deleteDish(dish.id)" class="text-xs text-red-400 ml-2">×</button>
            </span>
          </li>
        </ul>
        <button @click="openAddDish(cat.id)" class="mt-1 text-xs text-green-400">+ Добавить блюдо</button>
      </div>
    </div>
    <button @click="showAddCategory = true" class="mt-6 bg-yandex-yellow text-black px-4 py-2 rounded-xl font-bold">+ Добавить категорию</button>

    <!-- Модалка для добавления категории -->
    <div v-if="showAddCategory" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card-dark p-6 rounded-2xl w-full max-w-xs relative shadow-xl">
        <button class="absolute top-2 right-3 text-xl text-gray-400 hover:text-white" @click="showAddCategory = false">×</button>
        <h3 class="text-lg font-bold mb-4 text-white">Добавить категорию</h3>
        <form @submit.prevent="addCategory" class="flex flex-col gap-3">
          <input v-model="catNameEn" type="text" class="input" placeholder="Название (en)" required />
          <input v-model="catNameRu" type="text" class="input" placeholder="Название (ru)" />
          <input v-model="catNameTr" type="text" class="input" placeholder="Название (tr)" />
          <input v-model="catNameDe" type="text" class="input" placeholder="Название (de)" />
          <button class="btn" type="submit">Добавить</button>
        </form>
      </div>
    </div>

    <!-- Модалка для добавления блюда с AI -->
    <div v-if="showAddDishModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card-dark p-6 rounded-2xl w-full max-w-xs relative shadow-xl">
        <button class="absolute top-2 right-3 text-xl text-gray-400 hover:text-white" @click="showAddDishModal = false">×</button>
        <h3 class="text-lg font-bold mb-4 text-white">Добавить блюдо</h3>
        <form @submit.prevent="addDish" class="flex flex-col gap-3">
          <input type="file" accept="image/*" @change="onImageChange" class="input" required />
          <div v-if="loadingAI" class="text-yellow-400 text-sm mb-2">AI анализирует фото...</div>
          <div v-if="errorAI" class="text-red-400 text-sm mb-2">{{ errorAI }}</div>
          <input v-model="dishNameEn" type="text" class="input" placeholder="Название (en)" required />
          <input v-model="dishNameRu" type="text" class="input" placeholder="Название (ru)" />
          <input v-model="dishNameTr" type="text" class="input" placeholder="Название (tr)" />
          <input v-model="dishNameDe" type="text" class="input" placeholder="Название (de)" />
          <input v-model="dishDescEn" type="text" class="input" placeholder="Описание (en)" />
          <input v-model="dishDescRu" type="text" class="input" placeholder="Описание (ru)" />
          <input v-model="dishDescTr" type="text" class="input" placeholder="Описание (tr)" />
          <input v-model="dishDescDe" type="text" class="input" placeholder="Описание (de)" />
          <input v-model="dishPrice" type="number" class="input" placeholder="Цена" min="0" required />
          <input v-model="dishCalories" type="number" class="input" placeholder="Калории" min="0" />
          <input v-model="dishProtein" type="number" class="input" placeholder="Белки (г)" min="0" />
          <input v-model="dishFat" type="number" class="input" placeholder="Жиры (г)" min="0" />
          <input v-model="dishCarbs" type="number" class="input" placeholder="Углеводы (г)" min="0" />
          <button class="btn" type="submit" :disabled="loadingAI">Добавить</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const route = useRoute()
const restaurantId = route.params.id
const categories = ref([])
const dishes = ref([])

const showAddCategory = ref(false)
const catNameEn = ref('')
const catNameRu = ref('')
const catNameTr = ref('')
const catNameDe = ref('')

const showAddDishModal = ref(false)
const newDishCatId = ref(null)
const dishNameEn = ref('')
const dishNameRu = ref('')
const dishNameTr = ref('')
const dishNameDe = ref('')
const dishDescEn = ref('')
const dishDescRu = ref('')
const dishDescTr = ref('')
const dishDescDe = ref('')
const dishPrice = ref('')
const dishCalories = ref('')
const dishProtein = ref('')
const dishFat = ref('')
const dishCarbs = ref('')
const dishImageFile = ref(null)
const dishImageUrl = ref('')
const loadingAI = ref(false)
const errorAI = ref('')

onMounted(fetchMenu)

async function fetchMenu() {
  const { data: catData } = await supabase.from('categories').select('*').eq('restaurant_id', restaurantId)
  categories.value = catData || []
  const { data: dishData } = await supabase.from('dishes').select('*').eq('restaurant_id', restaurantId)
  dishes.value = dishData || []
}

async function addCategory() {
  await supabase.from('categories').insert([{
    restaurant_id: restaurantId,
    name_en: catNameEn.value,
    name_ru: catNameRu.value,
    name_tr: catNameTr.value,
    name_de: catNameDe.value,
  }])
  showAddCategory.value = false
  catNameEn.value = catNameRu.value = catNameTr.value = catNameDe.value = ''
  await fetchMenu()
}

async function deleteCategory(catId) {
  await supabase.from('categories').delete().eq('id', catId)
  await fetchMenu()
}

function openAddDish(catId) {
  showAddDishModal.value = true
  newDishCatId.value = catId
  dishNameEn.value = dishNameRu.value = dishNameTr.value = dishNameDe.value = ''
  dishDescEn.value = dishDescRu.value = dishDescTr.value = dishDescDe.value = ''
  dishPrice.value = ''
  dishCalories.value = ''
  dishProtein.value = ''
  dishFat.value = ''
  dishCarbs.value = ''
  dishImageFile.value = null
  dishImageUrl.value = ''
  errorAI.value = ''
}

async function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  dishImageFile.value = file
  loadingAI.value = true
  errorAI.value = ''

  try {
    // Upload image to Supabase Storage first
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('dishes')
      .upload(`public/${fileName}`, file)

    if (uploadError) throw new Error('Ошибка загрузки изображения: ' + uploadError.message)

    const { publicUrl } = supabase.storage.from('dishes').getPublicUrl(`public/${fileName}`).data
    dishImageUrl.value = publicUrl

    // Send image to FastAPI backend for analysis
    const formData = new FormData()
    formData.append('photo', file)
    const res = await fetch('http://localhost:8000/generate-dish-info', {
      method: 'POST',
      body: formData
    })

    if (!res.ok) throw new Error(`Ошибка API: ${res.status} - ${res.statusText}`)

    const data = await res.json()

    // Populate fields with AI-generated data
    dishNameEn.value = data.caption_en || ''
    dishNameRu.value = data.caption_ru || ''
    dishDescEn.value = data.caption_en || ''
    dishDescRu.value = data.caption_ru || ''
    
    if (data.nutrition) {
      dishCalories.value = data.nutrition.calories || ''
      dishProtein.value = data.nutrition.protein || ''
      dishFat.value = data.nutrition.fat || ''
      dishCarbs.value = data.nutrition.carbs || ''
    }
  } catch (err) {
    errorAI.value = 'Ошибка анализа изображения: ' + err.message
  } finally {
    loadingAI.value = false
  }
}

async function addDish() {
  await supabase.from('dishes').insert([{
    restaurant_id: restaurantId,
    category_id: newDishCatId.value,
    name_en: dishNameEn.value,
    name_ru: dishNameRu.value,
    name_tr: dishNameTr.value,
    name_de: dishNameDe.value,
    description_en: dishDescEn.value,
    description_ru: dishDescRu.value,
    description_tr: dishDescTr.value,
    description_de: dishDescDe.value,
    price: dishPrice.value,
    image_url: dishImageUrl.value,
    calories: dishCalories.value ? parseFloat(dishCalories.value) : null,
    protein: dishProtein.value ? parseFloat(dishProtein.value) : null,
    fat: dishFat.value ? parseFloat(dishFat.value) : null,
    carbs: dishCarbs.value ? parseFloat(dishCarbs.value) : null,
  }])
  showAddDishModal.value = false
  await fetchMenu()
}

async function deleteDish(dishId) {
  await supabase.from('dishes').delete().eq('id', dishId)
  await fetchMenu()
}

function editCategory(cat) {
  alert('Редактирование категории в разработке')
}

function editDish(dish) {
  alert('Редактирование блюда в разработке')
}
</script>

<style scoped>
.input {
  @apply bg-dark-bg text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yandex-yellow/50 transition;
}
.btn {
  @apply bg-yandex-yellow text-black font-bold rounded-xl py-2 px-4 hover:bg-yellow-400 transition shadow;
}
.bg-card-dark { background: #232325; }
.bg-dark-bg { background: #19191b; }
</style>