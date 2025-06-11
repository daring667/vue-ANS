<script setup>
import axios from 'axios'
import { ref, computed, inject } from 'vue'

import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import InfoBlock from './InfoBlock.vue'

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const { cart } = inject('cart')

const isCreating = ref(false)
const orderId = ref(null)

const createOrder = async () => {
  try {
    isCreating.value = true

    const { data } = await axios.post(`https://34a43f60562e814c.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: props.totalPrice.value
    })

    cart.value = []
    orderId.value = data.id
  } catch (err) {
    console.log(err)
  } finally {
    isCreating.value = false
  }
}

const cartIsEmpty = computed(() => cart.value.length === 0)
const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value)
</script>

<template>
  <div class="overlay"></div>

  <div class="drawer">
    <DrawerHead />

    <div v-if="!totalPrice || orderId" class="info-container">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пустая"
        description="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="/package-icon.png"
      />
      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке`"
        image-url="/order-success-icon.png"
      />
    </div>

    <div v-else>
      <CartItemList />

      <div class="checkout-summary">
        <div class="summary-line">
          <span>Итого:</span>
          <div class="dashed-line"></div>
          <b>{{ totalPrice }} ₸</b>
        </div>

        <div class="summary-line">
          <span>Налог 5%:</span>
          <div class="dashed-line"></div>
          <b>{{ vatPrice }} ₸</b>
        </div>

        <button :disabled="buttonDisabled" @click="createOrder" class="checkout-button">
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 0.7;
  z-index: 10;
}

.drawer {
  background-color: white;
  width: 384px; /* w-96 = 24rem = 384px */
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 20;
  padding: 32px; /* p-8 */
  display: flex;
  flex-direction: column;
}

.info-container {
  display: flex;
  height: 100%;
  align-items: center;
}

.checkout-summary {
  display: flex;
  flex-direction: column;
  gap: 16px; /* gap-4 */
  margin-top: 28px; /* mt-7 ≈ 1.75rem */
}

.summary-line {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dashed-line {
  flex: 1;
  border-bottom: 1px dashed #ccc;
}

.checkout-button {
  margin-top: 16px;
  background-color: #84cc16; /* lime-500 */
  width: 100%;
  border-radius: 12px;
  padding: 12px 0;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
}

.checkout-button:hover {
  background-color: #65a30d; /* lime-600 */
}

.checkout-button:active {
  background-color: #4d7c0f; /* lime-700 */
}

.checkout-button:disabled {
  background-color: #cbd5e1; /* slate-300 */
  cursor: not-allowed;
}
</style>
