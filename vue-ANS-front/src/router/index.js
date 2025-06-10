import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Favorites from '../pages/Favorites.vue'
import LoginRegister from '../pages/LoginRegister.vue' // <-- НОВЫЙ ИМПОРТ
import Cart from '../pages/Cart.vue'                   // <-- НОВЫЙ ИМПОРТ
import MyOrders from '../pages/MyOrders.vue'           // <-- НОВЫЙ ИМПОРТ

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  },
  {
    path: '/login', // Маршрут для страницы входа/регистрации
    name: 'LoginRegister',
    component: LoginRegister
  },
  {
    path: '/cart', // Маршрут для страницы корзины
    name: 'Cart',
    component: Cart
  },
  {
    path: '/my-orders', // Маршрут для страницы "Мои заказы"
    name: 'MyOrders',
    component: MyOrders,
    meta: { requiresAuth: true } // Требует авторизации
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Навигационная защита (Guards)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userToken'); // Используем 'userToken'

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Если маршрут требует авторизации и пользователь не авторизован,
    // перенаправляем на страницу входа
    next('/login');
  } else if (to.name === 'LoginRegister' && isAuthenticated) {
    // Если пользователь авторизован и пытается зайти на Login/Register,
    // перенаправляем на главную
    next('/');
  } else {
    // Иначе пропускаем
    next();
  }
})

export default router