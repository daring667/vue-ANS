import './assets/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import Home from './pages/Home.vue'
import Favorites from './pages/Favorites.vue'
import AuthPage from './pages/AuthPage.vue'

const app = createApp(App)

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  },
  { path: '/auth', name: 'Auth', component: AuthPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('isAuth') === 'true'
  if (to.meta.requiresAuth && !isAuth) {
    alert('Пожалуйста, войдите в систему')
    next('/auth')
  } else {
    next()
  }
})

app.use(router)
app.use(autoAnimatePlugin)
app.mount('#app')
