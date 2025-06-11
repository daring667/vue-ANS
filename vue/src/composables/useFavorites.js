import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:4000/api'

export function useFavorites() {
  const favorites = ref([])

  const fetchFavorites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        favorites.value = []
        return
      }
      const { data } = await axios.get(`${API_BASE_URL}/favorites/${user.id}`)
      // Преобразуем массив объектов {userId, product} в массив только товаров
      favorites.value = data.map(fav => fav.product)
    } catch (err) {
      favorites.value = []
      console.error('Ошибка загрузки избранного:', err)
    }
  }

  const addToFavorite = async (item) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) return
      await axios.post(`${API_BASE_URL}/favorites/toggle`, {
        userId: user.id,
        product: item
      })
      await fetchFavorites()
    } catch (err) {
      console.error('Ошибка при изменении избранного:', err)
    }
  }

  return {
    favorites,
    fetchFavorites,
    addToFavorite
  }
}