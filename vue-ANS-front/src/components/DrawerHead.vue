<script setup>
import { inject } from 'vue'

const { closeDrawer } = inject('cart')
</script>

<template>
  <div class="drawer-head">
    <svg
      @click="closeDrawer"
      class="close-btn"
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7H14.7143"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.71436 1L14.7144 7L8.71436 13"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <h2 class="drawer-title">Корзина</h2>
  </div>
</template>

<style scoped>
.drawer-head {
  display: flex;
  align-items: center;
  gap: 20px; /* gap-5 = 1.25rem = 20px */
  margin-bottom: 32px; /* mb-8 = 2rem = 32px */
}

.close-btn {
  opacity: 0.3;
  cursor: pointer;
  transform: rotate(180deg);
  transition: all 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  transform: rotate(180deg) translateX(-4px); /* hover:-translate-x-1 = -0.25rem = -4px */
}

.drawer-title {
  font-size: 24px; /* text-2xl */
  font-weight: bold;
}
</style>
