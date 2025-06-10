import { ref } from 'vue'
import axios from 'axios'

export function useFavorites() {
  const favorites = ref([])

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get(
        'https://34a43f60562e814c.mokky.dev/favorites?_relations=items'
      )
      favorites.value = data.map((obj) => ({
        ...obj.item,
        isFavorite: true,
        favoriteId: obj.id
      }))
      return favorites.value
    } catch (err) {
      console.log('Error fetching favorites:', err)
      return []
    }
  }

  const addToFavorite = async (item) => {
    try {
      if (!item.isFavorite) {
        // Добавляем в избранное
        const obj = { item_id: item.id }
        const { data } = await axios.post('https://34a43f60562e814c.mokky.dev/favorites', obj)
        return {
          ...item,
          isFavorite: true,
          favoriteId: data.id
        }
      } else {
        // Удаляем из избранного
        await axios.delete(`https://34a43f60562e814c.mokky.dev/favorites/${item.favoriteId}`)
        return {
          ...item,
          isFavorite: false,
          favoriteId: null
        }
      }
    } catch (err) {
      console.log('Error updating favorite:', err)
      return item
    }
  }

  return {
    favorites,
    fetchFavorites,
    addToFavorite
  }
}
