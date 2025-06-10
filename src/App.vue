<script setup>
import { ref, provide, watch, computed } from 'vue'
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

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
