import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart')) || [])
  const loading = ref(false)

  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const subtotal = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0))
  const shipping = computed(() => subtotal.value > 100 ? 0 : 10)
  const total = computed(() => subtotal.value + shipping.value)

  function addItem(product, quantity = 1, options = {}) {
    const existingItem = items.value.find(item => 
      item.id === product.id && 
      JSON.stringify(item.options) === JSON.stringify(options)
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        quantity,
        options,
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })
    }

    saveCart()
  }

  function updateQuantity(itemId, quantity) {
    // Try to find by cartItemId first, then fall back to product id
    let index = items.value.findIndex(item => item.cartItemId === itemId)
    if (index === -1) {
      index = items.value.findIndex(item => item.id === itemId)
    }
    if (index === -1) return
    
    if (quantity <= 0) {
      items.value.splice(index, 1)
      saveCart()
    } else {
      items.value[index].quantity = quantity
      saveCart()
    }
  }

  function removeItem(itemId) {
    // Try to find by cartItemId first, then fall back to product id
    let index = items.value.findIndex(item => item.cartItemId === itemId)
    if (index === -1) {
      index = items.value.findIndex(item => item.id === itemId)
    }
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  function clearCart() {
    items.value = []
    saveCart()
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  async function checkout(customerData) {
    loading.value = true
    try {
      const orderData = {
        items: items.value.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          options: item.options
        })),
        ...customerData
      }

      const response = await axios.post('/api/orders', orderData)
      clearCart()
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    checkout
  }
})
