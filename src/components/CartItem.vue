<script setup>
const emit = defineEmits(['onClickRemove'])

defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number
})
</script>

<template>
  <div class="cart-item">
    <img class="product-img" :src="imageUrl" :alt="title" />

    <div class="info-block">
      <p>{{ title }}</p>

      <div class="bottom-row">
        <b class="price">{{ price }} руб.</b>
        <img @click="emit('onClickRemove')" class="remove-btn" src="/close.svg" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0; /* border-slate-200 */
  padding: 16px;
  border-radius: 12px; /* rounded-xl */
  gap: 16px; /* gap-4 */
}

.product-img {
  width: 64px; /* w-16 */
  height: 64px; /* h-16 */
  object-fit: cover;
}

.info-block {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  margin-top: 8px; /* mt-2 */
}

.price {
  flex: 1;
}

.remove-btn {
  opacity: 0.4;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
}
</style>
