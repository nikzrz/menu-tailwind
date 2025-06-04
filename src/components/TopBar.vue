<template>
  <header class="topbar">
    <!-- Background Layer -->
    <div class="topbar-bg" :style="backgroundStyle" />

    <!-- Content Overlay -->
    <div class="topbar-overlay">
      <div class="topbar-left">
        <div class="rest-label">
          <svg viewBox="0 0 24 24" width="28" height="28" class="chef-hat">
            <path
              d="M7 19h10M6 19v2h12v-2M19 19c1.5 0 2-2.5 0.7-3.4A5 5 0 0 0 12 4a5 5 0 0 0-7.7 11.6C2 16.5 2.5 19 4 19"
              stroke="#C1C1C1"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="rest-label-text">{{ t('restaurant') }}</span>
        </div>
        <div class="rest-info">
          <div class="rest-title">{{ restaurantName || '...' }}</div>
        </div>
      </div>
      <div class="topbar-right">
        <div class="table-id-btn">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" class="icon-user">
            <circle cx="12" cy="8" r="4" stroke="#212121" stroke-width="2" />
            <path d="M4 20a8 8 0 0 1 16 0" stroke="#212121" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span class="table-id-text">ID: {{ tableId }}</span>
        </div>
        <div class="lang-block">
          <button class="lang-globe-btn" @click="showLang = !showLang" title="Выбрать язык">
            <svg class="icon-globe" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#212121" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            </svg>
          </button>
          <div v-if="showLang" class="lang-dropdown">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLang(lang.code)"
              :class="['lang-option', { 'lang-selected': locale.value === lang.code }]"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  restaurantName: String,
  tableId: {
    type: [String, Number],
    default: 4,
  },
  restaurantPhotoPath: String,
});

const { t, locale } = useI18n();
const showLang = ref(false);

const languages = [
  { code: "ru", label: "русский" },
  { code: "en", label: "english" },
  { code: "de", label: "deutsch" },
  { code: "tr", label: "türkçe" },
];

function selectLang(code) {
  locale.value = code;
  localStorage.setItem("lang", code);
  showLang.value = false;
}

function getRestaurantPhoto(photoUrl) {
  if (!photoUrl) return "/no-image.png";
  return photoUrl;
}

const backgroundStyle = computed(() => ({
  backgroundImage: `linear-gradient(to bottom, rgba(26,26,26,0.7), rgba(26,26,26,0.9)), url(${getRestaurantPhoto(
    props.restaurantPhotoPath
  )})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  filter: "grayscale(80%) brightness(0.5)",
}));
</script>

<style scoped>
.topbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 40;
  overflow: visible; /* ⬅️ чтобы dropdown не обрезался */
  min-height: 96px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
  background: transparent;
}

.topbar-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  transition: background 0.3s ease;
}

.topbar-overlay {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.topbar-left {
  display: flex;
  flex-direction: column;
}

.rest-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.chef-hat {
  display: block;
}

.rest-label-text {
  color: #b3b3b3;
  font-size: 1.15rem;
  font-weight: 100;
  letter-spacing: 0.01em;
}

.rest-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rest-title {
  font-size: 2.1rem;
  color: #fff;
  font-weight: bold;
  letter-spacing: 0.01em;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
}
  
.lang-block {
  position: relative;
  margin-right: 10px;
}

.lang-globe-btn {
  background: #facc15;
  border: none;
  border-radius: 12px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.18s;
  outline: none;
}

.lang-globe-btn:hover {
  filter: brightness(0.95);
}

.icon-globe {
  width: 24px;
  height: 24px;
  stroke: #212121;
  display: block;
}

.lang-dropdown {
  position: absolute;
  right: 0;
  top: 44px;
  background: #facc15;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(60, 40, 10, 0.13);
  padding: 8px 0;
  z-index: 9999; /* 🔝 поверх всего */
  min-width: 130px;
}

.lang-option {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  padding: 10px 28px 10px 20px;
  text-align: left;
  font-size: 1.13rem;
  color: #fff;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.17s, color 0.17s;
  outline: none;
}

.lang-selected {
  color: #111;
  font-weight: bold;
  background: #f5e16d;
}

.lang-option:not(.lang-selected):hover {
  background: #ffe66c;
  color: #212121;
}

.table-id-btn {
  display: flex;
  align-items: center;
  background: #fff;
  color: #212121;
  border-radius: 14px;
  padding: 7px 18px 7px 9px;
  font-size: 1.09rem;
  font-weight: 500;
  box-shadow: 0 2px 6px 0 rgba(20, 20, 20, 0.04);
  gap: 7px;
}

.icon-user {
  margin-right: 6px;
}

.table-id-text {
  color: #212121;
  font-weight: bold;
}
</style>
