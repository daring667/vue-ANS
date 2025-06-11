<script setup>
import { ref, provide, watch, computed, onMounted } from 'vue' // Добавили onMounted
import { useRouter } from 'vue-router'; // Импортируем useRouter для отслеживания изменений маршрута
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

const router = useRouter(); // Инициализация роутера

/* Cart functionality (START) */
const cart = ref([])
const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}

const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)

provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart
})
/* Cart functionality (END) */

/* Authentication/Authorization functionality (START) */
const isAuthenticated = ref(false);
const userEmail = ref('');
const userId = ref(null);

const checkAuthStatus = () => {
  const token = localStorage.getItem('userToken');
  const storedUser = localStorage.getItem('user');
  if (token && storedUser) {
    isAuthenticated.value = true;
    const user = JSON.parse(storedUser);
    userEmail.value = user.email;
    userId.value = user.id;
  } else {
    isAuthenticated.value = false;
    userEmail.value = '';
    userId.value = null;
  }
};

const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('user');
  checkAuthStatus(); // Обновляем статус
  router.push('/login'); // Перенаправляем на страницу входа/регистрации
};

// Проверяем статус при загрузке компонента App.vue
onMounted(() => {
  checkAuthStatus();
});

// Отслеживаем изменения маршрута для обновления статуса авторизации
// Это полезно, если пользователь залогинился на одной странице, а потом перешел на другую
watch(router.currentRoute, () => {
  checkAuthStatus();
});

// Предоставляем состояние авторизации для других компонентов (например, Header)
provide('auth', {
  isAuthenticated,
  userEmail,
  userId,
  logout
});
/* Authentication/Authorization functionality (END) */

</script>

<template>
  <Drawer v-if="drawerOpen" :total-price="totalPrice" :vat-price="vatPrice" />

  <div class="app-container">
    <Header :total-price="totalPrice" @open-drawer="openDrawer" /> 

    <div class="content-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
.app-container {
  background-color: white;
  width: 80%;
  margin: 0 auto;
  border-radius: 0.75rem;
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  margin-top: 3.5rem;
}

.content-container {
  padding: 2.5rem;
}
</style>
