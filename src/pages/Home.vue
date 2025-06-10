<script setup>
import { inject, reactive, watch, ref, onMounted } from 'vue'
import { useFavorites } from '@/composables/useFavorites'
import axios from 'axios'
import debounce from 'lodash.debounce'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')
const { addToFavorite } = useFavorites()

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

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://34a43f60562e814c.mokky.dev/favorites`)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.item_id === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })
  } catch (err) {
    console.log(err)
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

    items.value = data.map((obj) => {
      const existingItem = items.value.find((item) => item.id === obj.id)

      return {
        ...obj,
        isFavorite: existingItem?.isFavorite || false,
        favoriteId: existingItem?.favoriteId || null,
        isAdded: existingItem?.isAdded || false
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
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})

watch(filters, fetchItems)
</script>

<template>
  <div class="header-container">
    <h2 class="page-title">Все кроссовки</h2>

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
    <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
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
  width: 100%;
}

.search-input:focus {
  border-color: #9ca3af;
}

.card-list-container {
  margin-top: 2.5rem;
}
</style>
