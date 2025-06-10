import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LoginRegister from '../views/LoginRegister.vue'; 
import Cart from '../views/Cart.vue'; 
import MyOrders from '../views/MyOrders.vue';
import Favorites from '../views/Favorites.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'LoginRegister',
    component: LoginRegister
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: MyOrders,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userToken');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if ((to.name === 'LoginRegister' || to.name === 'Home') && isAuthenticated && to.path !== '/') {
    next('/');
  } else {
    next();
  }
});

export default router;