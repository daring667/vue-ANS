<script setup>
import { inject } from 'vue';
import { RouterLink } from 'vue-router'; // Импортируем RouterLink

// Получаем пропсы от App.vue
const props = defineProps({
  totalPrice: Number
});

// Получаем функции и данные корзины через inject
const { openDrawer } = inject('cart');

// Получаем состояние авторизации через inject
const { isAuthenticated, userEmail, logout } = inject('auth'); 
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <RouterLink to="/">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" class="w-10" /> <div>
          <h2 class="text-xl font-bold uppercase">Vue Sneakers</h2>
          <p class="text-slate-500">Магазин лучших кроссовок</p>
        </div>
      </div>
    </RouterLink>

    <ul class="flex items-center gap-10">
      <li
        @click="openDrawer"
        class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="Cart" />
        <b>{{ totalPrice }} руб.</b>
      </li>

      <template v-if="!isAuthenticated">
        <RouterLink to="/login">
          <li class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
            <img src="/profile.svg" alt="Profile" />
            <span>Вход / Регистрация</span>
          </li>
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink to="/favorites">
          <li class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
            <img src="/heart.svg" alt="Favorites" />
            <span>Избранное</span>
          </li>
        </RouterLink>
        <RouterLink to="/my-orders">
          <li class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
            <img src="/orders.svg" alt="Orders" /> <span>Мои заказы</span>
          </li>
        </RouterLink>
        <li class="flex items-center gap-2 text-gray-500">
          <span>Привет, {{ userEmail }}!</span>
        </li>
        <li @click="logout" class="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-black">
          <img src="/logout.svg" alt="Logout" /> <span>Выход</span>
        </li>
      </template>
    </ul>
  </header>
</template>