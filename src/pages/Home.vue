<script setup>
import { inject, reactive, watch, ref, onMounted } from 'vue'
import { useFavorites } from '@/composables/useFavorites'
import axios from 'axios'
import debounce from 'lodash.debounce'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')
const { addToFavorite, fetchFavorites } = useFavorites()

const items = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 300)

const handleAddToFavorite = async (item) => {
  try {
    const updatedItem = await addToFavorite(item)
    // Обновляем элемент в массиве items
    const index = items.value.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      items.value[index] = updatedItem
    }
  } catch (err) {
    console.log('Error handling favorite:', err)
  }
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }

    const { data } = await axios.get(`https://34a43f60562e814c.mokky.dev/items`, {
      params
    })

    // Получаем текущие избранные элементы
    const favorites = await fetchFavorites()
    const favoriteIds = favorites.map((fav) => fav.id)

    items.value = data.map((obj) => {
      const isFavorite = favoriteIds.includes(obj.id)
      const favorite = favorites.find((f) => f.id === obj.id)

      return {
        ...obj,
        isFavorite,
        favoriteId: favorite?.favoriteId || null,
        isAdded: cart.value.some((cartItem) => cartItem.id === obj.id)
      }
    })
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []
  await fetchItems()
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(filters, fetchItems)
</script>

<template>
  <div class="header-container">
    <h2 class="page-title">Все Товары</h2>

    <div class="controls-container">
      <select @change="onChangeSelect" class="sort-select">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>

      <div class="search-container">
        <img class="search-icon" src="/search.svg" />
        <input
          @input="onChangeSearchInput"
          class="search-input"
          type="text"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="card-list-container">
    <CardList :items="items" @add-to-favorite="handleAddToFavorite" @add-to-cart="onClickAddPlus" />
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, bold;
}

.controls-container {
  display: flex;
  gap: 1rem;
}

.sort-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  width: 1rem;
  height: 1rem;
}

.search-input {
  padding: 0.5rem 1rem 0.5rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  width: 80%;
}

.search-input:focus {
  border-color: #9ca3af;
}

.card-list-container {
  margin-top: 2.5rem;
}
</style>
