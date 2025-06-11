<script setup>
import { onMounted } from 'vue'
import { useFavorites } from '@/composables/useFavorites'
import CardList from '../components/CardList.vue'

const { favorites, fetchFavorites, addToFavorite } = useFavorites()

onMounted(async () => {
  await fetchFavorites()
})
</script>

<template>
  <h2 class="favorites-title">Мои закладки</h2>
  <CardList :items="favorites" is-favorites @add-to-favorite="addToFavorite" />
</template>

<style scoped>
.favorites-title {
  font-size: 1.875rem; /* text-3xl в Tailwind */
  line-height: 2.25rem;
  font-weight: 700; /* font-bold в Tailwind */
  margin-bottom: 2rem; /* mb-8 в Tailwind */
}
</style>
