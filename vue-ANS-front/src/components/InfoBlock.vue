<script setup>
defineProps({
  title: String,
  description: String,
  imageUrl: String
})
</script>

<template>
  <div class="info-block">
    <img class="info-image" height="80" width="80" :src="imageUrl" alt="Info image" />
    <h2 class="info-title">{{ title }}</h2>
    <p class="info-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 288px; /* 72 * 4 = 288 (так как Tailwind использует 1 единицу = 4px) */
  margin: 0 auto;
}

.info-image {
  height: 80px;
  width: 80px;
}

.info-title {
  margin-top: 1rem; /* mt-4 в Tailwind = 16px = 1rem */
  font-size: 1.5rem; /* text-2xl в Tailwind */
  font-weight: 500; /* font-medium в Tailwind */
  line-height: 2rem;
}

.info-description {
  color: rgb(156, 163, 175); /* text-gray-400 в Tailwind */
  margin-top: 0.5rem; /* mt-2 в Tailwind = 8px = 0.5rem */
}
</style>
