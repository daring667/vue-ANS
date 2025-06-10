<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const orders = ref([]);
const errorMessage = ref('');

const fetchOrders = async () => {
  errorMessage.value = '';
  try {
    const userId = JSON.parse(localStorage.getItem('user'))?.id; // Получаем ID пользователя из localStorage
    if (!userId) {
      errorMessage.value = 'Пользователь не авторизован или ID пользователя не найден.';
      return;
    }
    const response = await axios.get(`http://localhost:4000/api/orders/get-orders/${userId}`);
    orders.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке заказов:', error);
    errorMessage.value = 'Не удалось загрузить заказы. Попробуйте еще раз.';
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="my-orders-page">
    <h2>Мои заказы</h2>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    
    <div v-if="orders.length === 0 && !errorMessage">
      <p>У вас пока нет заказов.</p>
    </div>
    <div v-else>
      <div v-for="order in orders" :key="order.id" class="order-card">
        <h3>Заказ № {{ order.id }}</h3>
        <p>Дата: {{ new Date(order.date).toLocaleDateString() }}</p>
        <p>Общая сумма: {{ order.total }} $</p>
        <h4>Товары:</h4>
        <ul>
          <li v-for="item in order.items" :key="item.id">
            {{ item.name }} - {{ item.quantity }} шт. ({{ item.price }} $/шт.)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-orders-page {
  padding: 20px;
  text-align: center;
}

.order-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  text-align: left;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.05);
}

.order-card ul {
  list-style: none;
  padding: 0;
}

.order-card li {
  margin-bottom: 5px;
}
</style>