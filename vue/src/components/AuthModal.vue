<template>
    <div class="auth-modal">
      <div class="auth-modal-content">
        <span class="close-btn" @click="$emit('close')">&times;</span>
        
        <h2>{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Email:</label>
            <input v-model="email" type="email" required>
          </div>
          
          <div class="form-group">
            <label>Пароль:</label>
            <input v-model="password" type="password" required>
          </div>
          
          <div class="form-group" v-if="!isLoginMode">
            <label>Повторите пароль:</label>
            <input v-model="confirmPassword" type="password" required>
          </div>
          
          <button type="submit" class="submit-btn">
            {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
          </button>
          
          <p class="toggle-mode">
            {{ isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
            <span @click="toggleMode">{{ isLoginMode ? 'Создать' : 'Войти' }}</span>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isLoginMode = ref(true);
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  
  const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value;
  };
  
  const handleSubmit = () => {
    if (!isLoginMode.value && password.value !== confirmPassword.value) {
      alert('Пароли не совпадают');
      return;
    }
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (isLoginMode.value) {
      const user = users.find(u => u.email === email.value && u.password === password.value);
      if (!user) {
        alert('Неверные данные');
        return;
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      if (users.some(u => u.email === email.value)) {
        alert('Пользователь уже существует');
        return;
      }
      const newUser = { email: email.value, password: password.value };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
  
    localStorage.setItem('isAuth', 'true');
    window.location.reload();
  };
  </script>
  
  <style scoped>
  .auth-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .auth-modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }
  
  .close-btn:hover {
    color: #333;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
    input:focus {
      border-color: #42b983;
      outline: none;
    }
    
    .submit-btn {
      width: 100%;
      padding: 12px;
      background-color: #42b983;
      color: white;
    }
  </style>