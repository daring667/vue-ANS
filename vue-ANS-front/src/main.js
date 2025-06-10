import './assets/main.css'
import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import router from './router' // <-- ИМПОРТИРУЕМ РОУТЕР ИЗ ОТДЕЛЬНОГО ФАЙЛА

const app = createApp(App)

app.use(router) // <-- ИСПОЛЬЗУЕМ ИМПОРТИРОВАННЫЙ РОУТЕР
app.use(autoAnimatePlugin)
app.mount('#app')