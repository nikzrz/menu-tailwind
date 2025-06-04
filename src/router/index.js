// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import MenuList from '../components/MenuList.vue';
import DishDetail from '../components/DishDetail.vue';
import Orders from '../components/Orders.vue';
import Feedback from '../components/Feedback.vue';
import AdminLogin from '../admin/AdminLogin.vue';
import AdminDashboard from '../admin/AdminDashboard.vue';

import { supabase } from '@/supabase/client'; // Импортируем клиент Supabase

const DEFAULT_RESTAURANT_ID = 'b07eeea4-43c4-4463-a88c-4fa1c2ee31db'; // Ваш ID ресторана по умолчанию

const routes = [
  { path: '/menu/:restaurantId', component: MenuList, name: 'MenuList' },
  { path: '/dish/:id', component: DishDetail, name: 'DishDetail' }, // DishDetail будет сохранять restaurant_id
  { path: '/orders', component: Orders, name: 'Orders' },
  { path: '/feedback', component: Feedback, name: 'Feedback' },
  { path: '/admin/login', component: AdminLogin, name: 'AdminLogin' },
  {
    path: '/admin/dashboard',
    component: AdminDashboard,
    name: 'AdminDashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/menu/:id', // Предполагается, что :id здесь это restaurant_id
    name: 'AdminMenu',
    component: () => import('../admin/AdminMenu.vue'),
    meta: { requiresAuth: true }
  },
  // УДАЛЯЕМ статический редирект:
  // { path: '/', redirect: '/menu/b07eeea4-43c4-4463-a88c-4fa1c2ee31db' }

  // Добавляем маршрут для '/', он будет обработан в beforeEach
  {
    path: '/',
    name: 'Home',
    // Компонент для '/' можно не указывать, если beforeEach всегда будет делать редирект.
    // Либо можно указать компонент-заглушку или реальную домашнюю страницу,
    // если вы хотите, чтобы она отображалась, если lastSeenRestaurantId отсутствует.
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Динамический редирект для корневого пути '/'
  if (to.path === '/') {
    const lastSeenRestaurantId = localStorage.getItem('lastSeenRestaurantId');
    if (lastSeenRestaurantId) {
      // Если есть сохраненный ID, перенаправляем на меню этого ресторана
      next({ path: `/menu/${lastSeenRestaurantId}` });
      return; // Важно завершить выполнение здесь
    } else {
      // Если нет, перенаправляем на ресторан по умолчанию
      next({ path: `/menu/${DEFAULT_RESTAURANT_ID}` });
      return; // Важно завершить выполнение здесь
    }
  }

  // Логика защиты админских роутов (существующая)
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      next('/admin/login');
    } else {
      next();
    }
  } else {
    // Для всех остальных маршрутов
    next();
  }
});

export default router;
