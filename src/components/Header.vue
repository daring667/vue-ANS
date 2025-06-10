<script setup>
import { ref, computed } from 'vue'
import AuthModal from './AuthModal.vue'

defineProps({
  totalPrice: Number
})

const emit = defineEmits(['openDrawer'])
const showAuthModal = ref(false)
const isAuth = computed(() => localStorage.getItem('isAuth') === 'true')

const toggleAuthModal = () => {
  showAuthModal.value = !showAuthModal.value
}

const logout = () => {
  localStorage.removeItem('isAuth')
  localStorage.removeItem('currentUser')
  window.location.reload()
}
</script>

<template>
  <header class="header">
    <router-link to="/">
      <div class="logo-container">
        <img src="/logo.png" alt="Logo" class="logo-img" />
        <div>
          <h2 class="title">E-commerce App</h2>
          <p class="subtitle">Доступный интернет-магазин для всех пользователей</p>
        </div>
      </div>
    </router-link>

    <ul class="nav-list">
      <li @click="() => emit('openDrawer')" class="nav-item">
        <img src="/cart.svg" alt="Cart" />
        <b>{{ totalPrice }} тг.</b>
      </li>

      <router-link to="/favorites">
        <li class="nav-item">
          <img src="/heart.svg" alt="Cart" />
          <span>Избранное</span>
        </li>
      </router-link>

      <li v-if="!isAuth" @click="toggleAuthModal" class="nav-item">
        <img src="/profile.svg" alt="Profile" />
        <span>Войти</span>
      </li>

      <li v-else class="nav-item" @click="logout">
        <img src="/profile.svg" alt="Profile" />
        <span>Выйти</span>
      </li>
    </ul>

    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(226, 232, 240);
  padding: 2rem 2.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-img {
  width: 100px;
  height: 100px;
}

.title {
  font-size: 1.25rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: black;
  font-weight: 700;
  line-height: 1.75rem;
  text-transform: uppercase;;
}

.subtitle {
  color: rgb(148, 163, 184);
  text-decoration: none;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgb(107, 114, 128);
  cursor: pointer;
}

.nav-item:hover {
  color: rgb(0, 0, 0);
}

.nav-item img {
  display: block;
}
</style>
