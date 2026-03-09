import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/utils/axios'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)

  async function fetchOrders(params = {}) {
    loading.value = true
    try {
      const response = await axios.get('/api/orders', { params })
      orders.value = response.data.data || response.data
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchOrder(id) {
    loading.value = true
    try {
      const response = await axios.get(`/api/orders/${id}`)
      currentOrder.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createOrder(orderData) {
    loading.value = true
    try {
      const response = await axios.post('/api/orders', orderData)
      orders.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(id, status) {
    loading.value = true
    try {
      const response = await axios.put(`/api/orders/${id}`, { status })
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = response.data
      }
      return response.data
    } catch (error) {
      console.error('Error updating order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteOrder(id) {
    loading.value = true
    try {
      await axios.delete(`/api/orders/${id}`)
      orders.value = orders.value.filter(o => o.id !== id)
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    loading,
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder
  }
})
