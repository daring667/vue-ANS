<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const isLoginMode = ref(true); // true = вход, false = регистрация

const email = ref('');
const password = ref('');
const confirmPassword = ref(''); // Только для регистрации

const errorMessage = ref('');
const successMessage = ref('');

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  errorMessage.value = ''; // Сбрасываем сообщения
  successMessage.value = '';
  // Очищаем поля
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const handleAuth = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (isLoginMode.value) {
    // Логика входа
    try {
      const response = await axios.post('http://localhost:4000/api/users/sign-in', {
        email: email.value,
        password: password.value
      });
      
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Сохраняем user object
      successMessage.value = response.data.message;
      router.push('/'); // Перенаправляем на главную после успешного входа
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Ошибка входа. Проверьте почту и пароль.';
    }
  } else {
    // Логика регистрации
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Пароли не совпадают.';
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/api/users/register', {
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      });
      successMessage.value = response.data.message + ' Теперь вы можете войти.';
      email.value = ''; // Очищаем поля
      password.value = '';
      confirmPassword.value = '';
      isLoginMode.value = true; // Переключаемся на форму входа
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Ошибка регистрации. Попробуйте еще раз.';
    }
  }
};
</script>

<template>
  <div class="auth-container">
    <h2 class="auth-title">{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h2>
    
    <form @submit.prevent="handleAuth" class="auth-form">
      <input type="email" v-model="email" placeholder="Email" required class="auth-input" />
      <input type="password" v-model="password" placeholder="Пароль" required class="auth-input" />
      <input v-if="!isLoginMode" type="password" v-model="confirmPassword" placeholder="Подтвердите пароль" required class="auth-input" />
      
      <button type="submit" class="auth-button">
        {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

    <p class="toggle-mode">
      {{ isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }} 
      <a href="#" @click.prevent="toggleMode" class="toggle-link">
        {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
      </a>
    </p>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  background-color: #fff;
}

.auth-title {
  margin-bottom: 25px;
  color: #333;
  font-size: 1.8em;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  width: calc(100% - 30px); /* Учитываем padding */
}

.auth-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.auth-button {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  margin-top: 15px;
  font-size: 0.9em;
}

.success-message {
  color: #28a745;
  margin-top: 15px;
  font-size: 0.9em;
}

.toggle-mode {
  margin-top: 20px;
  font-size: 0.9em;
  color: #666;
}

.toggle-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.toggle-link:hover {
  text-decoration: underline;
}
</style>
* **Что делает:** Компонент с формами для входа и регистрации. Использует `axios` для отправки данных на бэкенд и `localStorage` для сохранения токена/данных пользователя. При успешном входе перенаправляет на главную.

**`src/pages/Cart.vue`**
```vue