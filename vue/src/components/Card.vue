<script setup>
defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function
})
</script>

<template>
  <div class="sneaker-card">
    <img
      v-if="onClickFavorite"
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="Like 1"
      class="like-icon"
      @click="onClickFavorite"
    />

    <img :src="`http://localhost:4000${imageUrl}`" alt="Sneaker" class="sneakers_img" />

    <p class="title">{{ title }}</p>

    <div class="bottom-row">
      <div class="price-block">
        <span class="price-label">Цена:</span>
        <b>{{ price }} тг.</b>
      </div>

      <img
        v-if="onClickAdd"
        @click="onClickAdd"
        :src="!isAdded ? '/plus.svg' : '/checked.svg'"
        alt="Plus"
        class="add-icon"
      />
    </div>
  </div>
</template>

<style scoped>
.sneakers_img {
  height: 150px;
  width: 150px;
}

.sneaker-card {
  position: relative;
  background-color: white;
  border: 1px solid #f1f5f9; /* slate-100 */
  border-radius: 24px; /* rounded-3xl */
  padding: 32px; /* p-8 */
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.sneaker-card:hover {
  transform: translateY(-8px); /* -translate-y-2 */
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); /* shadow-xl */
}

.like-icon {
  position: absolute;
  top: 32px;
  left: 32px;
}

.title {
  margin-top: 8px; /* mt-2 */
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px; /* mt-5 */
}

.price-block {
  display: flex;
  flex-direction: column;
}

.price-label {
  color: #94a3b8; /* slate-400 */
}

.add-icon {
  cursor: pointer;
}
</style>
