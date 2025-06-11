<script setup>
import { inject } from 'vue'
import CartItem from './CartItem.vue'

const { cart, removeFromCart } = inject('cart')
</script>

<template>
  <div class="cart-list" v-auto-animate>
    <CartItem
      v-for="item in cart"
      :key="item.id"
      :title="item.title"
      :price="item.price"
      :image-url="item.imageUrl"
      @on-click-remove="() => removeFromCart(item)"
    />
  </div>
</template>

<style scoped>
.cart-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px; /* gap-4 = 1rem = 16px */
  justify-content: space-between;
}
</style>
