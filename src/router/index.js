import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Favorites from '../pages/Favorites.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('isAuth') === 'true'

  if (to.meta.requiresAuth && !isAuth) {
    alert('Пожалуйста, войдите в систему')
    next('/')
  } else {
    next()
  }
})

export default router
