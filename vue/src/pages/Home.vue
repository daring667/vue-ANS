<script setup>
import { inject, reactive, watch, ref, onMounted } from 'vue'
// import { useFavorites } from '@/composables/useFavorites' // Пока закомментируем
import axios from 'axios'
import debounce from 'lodash.debounce'
import CardList from '../components/CardList.vue' // Убедись, что путь к CardList.vue верен

// Получаем функции корзины
const { cart, addToCart, removeFromCart } = inject('cart')
// const { addToFavorite } = useFavorites() // Закомментируем пока не будет API для избранного

const items = ref([]) // Список всех товаров

const filters = reactive({
  sortBy: 'title', // Изменил на 'name' по умолчанию, так как наш JSON имеет поле name
  searchQuery: ''
})

// Наша базовая URL для бэкенда
const API_BASE_URL = 'http://localhost:4000/api';

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

// Функция для получения избранных товаров (будет имитация или пока заглушка)
// const fetchFavorites = async () => {
//   // Для экзамена, если нет времени делать полноценный бэкенд для избранного,
//   // можно просто хранить избранное в localStorage или пропустить эту часть.
//   // Если ТЗ требует, нужно добавить бэкенд для избранного (сохранение/получение).
//   // Пока оставим заглушку, которая имитирует избранное из localStorage.
//   console.log('Fetching favorites - using local storage imitation.');
//   const localFavorites = localStorage.getItem('favorites');
//   if (localFavorites) {
//     const favorites = JSON.parse(localFavorites);
//     items.value = items.value.map((item) => {
//       const isFavorite = favorites.some((favItem) => favItem.id === item.id);
//       return {
//         ...item,
//         isFavorite: isFavorite,
//         favoriteId: isFavorite ? item.id : null // Простая имитация favoriteId
//       };
//     });
//   } else {
//       // Если избранного в localStorage нет, убедимся, что isFavorite = false для всех
//       items.value = items.value.map(item => ({ ...item, isFavorite: false, favoriteId: null }));
//   }
// };


// Функция для получения товаров
const fetchItems = async () => {
  try {
    // Запрос на наш бэкенд
    const { data } = await axios.get(`${API_BASE_URL}/products/get-products`)
    
    // Применяем фильтрацию и сортировку на фронте
    let filteredItems = data;

    if (filters.searchQuery) {
        // Поиск по названию (name)
        filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
    }

    if (filters.sortBy) {
        filteredItems.sort((a, b) => {
            if (filters.sortBy === 'name') {
                return a.name.localeCompare(b.name); // Сортировка по названию
            }
            if (filters.sortBy === 'price') {
                return a.price - b.price; // Сортировка по цене (дешевые)
            }
            if (filters.sortBy === '-price') {
                return b.price - a.price; // Сортировка по цене (дорогие)
            }
            return 0;
        });
    }


    items.value = filteredItems.map((obj) => {
      // Проверяем, был ли товар уже добавлен в корзину
      const isAdded = cart.value.some((cartItem) => cartItem.id === obj.id);

      return {
        id: Number(obj.id),
        title: String(obj.title),    // <--- ИЗМЕНЕНО: теперь title берется из name
        imageUrl: String(obj.imageUrl), // <--- ИЗМЕНЕНО: теперь imageUrl берется из image
        price: Number(obj.price), // <--- УБЕДИМСЯ, ЧТО ЦЕНА ЧИСЛО
        isFavorite: false,   // Обновится fetchFavorites()
        favoriteId: null,    // Обновится fetchFavorites()
        isAdded: isAdded
      }
    })
    
    // После получения данных, обновляем статус избранного
    await fetchFavorites();

  } catch (err) {
    console.error('Ошибка при получении товаров:', err)
    items.value = []; // Очищаем, если ошибка
  }
}

onMounted(async () => {
  // Загружаем корзину из localStorage при монтировании
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  // Сначала получаем товары
  await fetchItems() 
  
  // Обновляем статус isAdded для всех товаров на основе загруженной корзины
  // items.value = items.value.map((item) => ({
  //   ...item,
  //   isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  // }))
  // Этот блок можно убрать, так как isAdded уже устанавливается в fetchItems
  // или в onClickAddPlus/removeFromCart
})

watch(cart, (newCart) => {
  // При изменении корзины, обновляем статус isAdded для всех товаров
  // Это важно, если isAdded меняется не только через onClickAddPlus
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: newCart.some((cartItem) => cartItem.id === item.id)
  }))
}, { deep: true });

watch(filters, fetchItems, { deep: true }); // Следим за изменениями filters и вызываем fetchItems

const addToFavorite = async (item) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    await axios.post(`${API_BASE_URL}/favorites/toggle`, {
      userId: user.id,
      product: item
    });

    // После изменения — обновляем избранное
    await fetchFavorites();
  } catch (err) {
    console.log('Ошибка при изменении избранного:', err);
  }
};

const fetchFavorites = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const { data: favorites } = await axios.get(`${API_BASE_URL}/favorites/${user.id}`);

    items.value = items.value.map((item) => {
      const favorite = favorites.find((fav) => fav.product.id === item.id);
      return {
        ...item,
        isFavorite: !!favorite,
        favoriteId: favorite ? favorite.product.id : null
      };
    });
  } catch (err) {
    console.log('Ошибка при получении избранного:', err);
  }
};

</script>

<template>
  <div class="header-container">
    <h2 class="page-title">Все Товары</h2>

    <div class="controls-container">
      <select @change="onChangeSelect" class="sort-select">
        <option value="title">По названию</option>
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
/* Эти стили ты просил не трогать, они остаются как есть */
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
  border: 1px solid #e2e8f0; /* slate-200 */
  border-radius: 0.375rem; /* rounded-md */
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
  border: 1px solid #e2e8f0; /* border-slate-200 */
  border-radius: 0.375rem; /* rounded-md */
  outline: none;
  width: 80%; /* w-full в Tailwind */
}

.search-input:focus {
  border-color: #9ca3af; /* border-slate-400 */
}

.card-list-container {
  margin-top: 2.5rem; /* mt-10 */
}
</style>