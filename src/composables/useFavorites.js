import { ref } from 'vue'
import axios from 'axios'

export function useFavorites() {
  const favorites = ref([])

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get(
        'https://34a43f60562e814c.mokky.dev/favorites?_relations=items'
      )
      favorites.value = data.map((obj) => {
        return {
          ...obj.item,
          isFavorite: true,
          favoriteId: obj.id
        }
      })
    } catch (err) {
      console.log('Error fetching favorites:', err)
    }
  }

  const addToFavorite = async (item) => {
    try {
      if (!item.isFavorite) {
        const obj = { item_id: item.id }

        item.isFavorite = true

        const { data } = await axios.post('https://34a43f60562e814c.mokky.dev/favorites', obj)

        item.favoriteId = data.id
        favorites.value.push(item) // Додаємо елемент до списку обраних
      } else {
        item.isFavorite = false

        await axios.delete(`https://34a43f60562e814c.mokky.dev/favorites/${item.favoriteId}`)

        item.favoriteId = null
        favorites.value = favorites.value.filter((fav) => fav.favoriteId !== item.favoriteId) // Видаляємо елемент зі списку обраних
      }
    } catch (err) {
      console.log('Error updating favorite:', err)
    }
  }

  return {
    favorites,
    fetchFavorites,
    addToFavorite
  }
}
