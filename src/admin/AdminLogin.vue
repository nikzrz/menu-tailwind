<template>
  <div class="min-h-screen w-full bg-white flex flex-col">
    <!-- Language Selector -->
    <div class="absolute top-6 right-6 z-10">
      <div class="relative">
        <button
          @click="showLangDropdown = !showLangDropdown"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
          </svg>
          <span class="text-gray-700 font-medium">{{ getCurrentLanguageLabel() }}</span>
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        
        <div v-if="showLangDropdown" class="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[160px] z-20">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            :class="[
              'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg',
              currentLanguage === lang.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
            ]"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ t('adminLogin') }}</h1>
          <p class="text-gray-600">{{ t('loginSubtitle') }}</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('email') }}
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                :placeholder="t('emailPlaceholder')"
                class="input w-full"
                required
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('password') }}
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                :placeholder="t('passwordPlaceholder')"
                class="input w-full"
                required
              />
            </div>

            <button
              type="submit"
              class="btn-primary w-full"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ loading ? t('loggingIn') : t('login') }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              {{ t('noAccount') }}
              <button
                @click="showRegister = true"
                class="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {{ t('register') }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Modal -->
    <div v-if="showRegister" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl relative mx-4">
        <button
          @click="showRegister = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-900">{{ t('registration') }}</h3>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="register-email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('email') }}
            </label>
            <input
              id="register-email"
              v-model="registerEmail"
              type="email"
              :placeholder="t('emailPlaceholder')"
              class="input w-full"
              required
            />
          </div>

          <div>
            <label for="register-password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('password') }}
            </label>
            <input
              id="register-password"
              v-model="registerPassword"
              type="password"
              :placeholder="t('passwordPlaceholder')"
              class="input w-full"
              required
            />
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ loading ? t('registering') : t('register') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const loading = ref(false)
const error = ref('')
const showRegister = ref(false)
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

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (authError) throw authError
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = t('loginError') + ': ' + err.message
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    const { error: authError } = await supabase.auth.signUp({
      email: registerEmail.value,
      password: registerPassword.value
    })
    if (authError) throw authError
    showRegister.value = false
    error.value = t('checkEmail')
  } catch (err) {
    error.value = t('registrationError') + ': ' + err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 px-6 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed;
}

.input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200;
}

.input:focus {
  @apply bg-white;
}
</style>