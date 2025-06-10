<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { ref, onMounted, watch } from 'vue'; 
import { useRouter } from 'vue-router'; 
import axios from 'axios';

const router = useRouter();

const isAuthenticated = ref(false);
const userEmail = ref('');
const userId = ref(null);

const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/products/get-products');
    products.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    products.value = [];
  }
};

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
  checkAuthStatus(); 
  router.push('/login'); 
};

onMounted(() => {
  checkAuthStatus();
  fetchProducts();
});

watch(router.currentRoute, () => {
  checkAuthStatus();
});
</script>

<template>
  <header class="main-header">
    <nav class="main-nav">
      <RouterLink to="/" class="nav-link">Главная</RouterLink>
      <RouterLink to="/cart" class="nav-link">Корзина</RouterLink>
      
      <template v-if="!isAuthenticated">
        <RouterLink to="/login" class="nav-link auth-button">Вход</RouterLink>
      </template>
      <template v-else>
        <RouterLink to="/my-orders" class="nav-link">Мои заказы</RouterLink>
        <RouterLink to="/favorites" class="nav-link">Избранное</RouterLink>
        <span class="user-info">Привет, {{ userEmail }}!</span>
        <button @click="logout" class="nav-link auth-button">Выход</button>
      </template>
    </nav>
  </header>

  <main class="content-area">
    <RouterView />
  </main>
</template>


<style scoped>
/* Общие стили для всего приложения (можно перенести в main.css или App.vue) */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  color: #333;
}

.main-header {
  background-color: #333;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #555;
}

.auth-button {
  background-color: #007bff;
  padding: 8px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.auth-button:hover {
  background-color: #0056b3;
}

.user-info {
  margin-left: auto; /* Отталкивает элементы влево, если есть */
  margin-right: 15px;
  font-weight: bold;
}

.content-area {
  padding: 20px;
  min-height: calc(100vh - 120px); /* Пример, чтобы футер был внизу */
}

.main-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 15px 0;
  position: sticky;
  bottom: 0;
  width: 100%;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Адаптивная сетка */
  gap: 20px;
  padding: 20px;
}

.product-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
}

.product-image {
  max-width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
}

h1 {
  text-align: center;
  margin-top: 20px;
}
</style>