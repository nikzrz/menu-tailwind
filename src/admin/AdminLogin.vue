<template>
  <div class="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 flex items-center justify-center p-6">
    <div class="bg-card-dark p-8 rounded-2xl w-full max-w-md shadow-lg">
      <h2 class="text-3xl font-bold text-white mb-6 text-center">Вход для админа</h2>
      <div v-if="error" class="text-red-400 text-center mb-4">{{ error }}</div>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Пароль" class="input" required />
        <button type="submit" class="btn w-full" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      <p class="text-gray-400 text-center mt-4">
        Нет аккаунта? <a href="#" @click.prevent="showRegister = true" class="text-yandex-yellow hover:underline">Зарегистрироваться</a>
      </p>

      <!-- Модалка регистрации -->
      <div v-if="showRegister" class="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
        <div class="bg-card-dark p-6 rounded-2xl w-full max-w-sm shadow-lg relative">
          <button @click="showRegister = false" class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-white">×</button>
          <h3 class="text-lg font-bold mb-4 text-white">Регистрация</h3>
          <form @submit.prevent="handleRegister" class="flex flex-col gap-3">
            <input v-model="registerEmail" type="email" placeholder="Email" class="input" required />
            <input v-model="registerPassword" type="password" placeholder="Пароль" class="input" required />
            <button type="submit" class="btn" :disabled="loading">
              {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const loading = ref(false)
const error = ref('')
const showRegister = ref(false)
const router = useRouter()

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
    error.value = 'Ошибка входа: ' + err.message
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
    error.value = 'Проверьте email для подтверждения регистрации'
  } catch (err) {
    error.value = 'Ошибка регистрации: ' + err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.btn {
  @apply bg-yandex-yellow text-black font-bold rounded-xl py-2 px-4 hover:bg-yellow-400 transition shadow;
}
.input {
  @apply bg-dark-bg text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yandex-yellow/50 transition;
}
.bg-card-dark { background: #232325; }
.bg-dark-bg { background: #19191b; }
</style>