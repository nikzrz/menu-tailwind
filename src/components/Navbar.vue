<template>
    <nav class="sticky top-16 z-30 bg-white/95 backdrop-blur-md pt-4 pb-3 shadow-md w-full">
      <div class="flex gap-3 overflow-x-auto px-4 snap-x snap-mandatory scrollbar-hide touch-pan-x">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="$emit('change', cat.id)"
          :class="[
            'px-6 py-2.5 rounded-full text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 flex-shrink-0',
            'focus:outline-none focus:ring-2 focus:ring-yandex-yellow/50 snap-center',
            modelValue === cat.id
              ? 'bg-yandex-yellow text-black shadow-md border border-yandex-yellow/80'
              : 'bg-gray-100/90 text-gray-900 hover:bg-yandex-yellow/20 hover:text-black'
          ]"
        >
          {{ cat[`name_${locale}`] || cat.name_en }}
        </button>
      </div>
    </nav>
  </template>
  
  <script setup>
  defineProps({
    categories: { type: Array, required: true },
    modelValue: { type: [String, Number], required: true }
  });
  defineEmits(['change']);
  
  import { useI18n } from 'vue-i18n'
  const { locale } = useI18n();
  </script>
  