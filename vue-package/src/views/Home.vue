<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/products/get-products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="home-page">
    <h1>Добро пожаловать в Neo-commerce!</h1>
    
    <div v-if="products.length === 0">
      <p>Загрузка товаров...</p>
    </div>
    <div v-else>
      <div class="product-list">
        <div v-for="product in products" :key="product.id" class="product-card">
          <h3>{{ product.title }}</h3>
          <p>Цена: {{ product.price }} $</p>
          <img :src="product.image" :alt="product.title" class="product-image" />
          <button>Добавить в корзину</button>
          <button>❤</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 20px;
}
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
</style>