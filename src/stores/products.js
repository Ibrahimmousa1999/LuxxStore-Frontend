import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/utils/axios'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const currentProduct = ref(null)

  async function fetchProducts(params = {}) {
    loading.value = true
    try {
      const response = await axios.get('/products', { params })
      products.value = response.data.data || response.data
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    loading.value = true
    try {
      const response = await axios.get(`/products/${id}`)
      currentProduct.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createProduct(productData) {
    loading.value = true
    try {
      const response = await axios.post('/products', productData)
      products.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id, productData) {
    loading.value = true
    try {
      const response = await axios.put(`/products/${id}`, productData)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data
      }
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id) {
    loading.value = true
    try {
      await axios.delete(`/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    loading.value = true
    try {
      const response = await axios.get('/categories')
      categories.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createCategory(categoryData) {
    loading.value = true
    try {
      const response = await axios.post('/categories', categoryData)
      categories.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchMyProducts(params = {}) {
    try {
      const response = await axios.get('/merchant/products', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching merchant products:', error)
      throw error
    }
  }

  return {
    products,
    categories,
    currentProduct,
    loading,
    fetchProducts,
    fetchProduct,
    fetchMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
    createCategory
  }
})
