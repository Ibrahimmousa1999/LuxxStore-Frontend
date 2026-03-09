import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

export const useUsersStore = defineStore('users', () => {
  // Admin: Get all users
  async function fetchUsers(params = {}) {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  }

  // Admin: Get all merchants
  async function fetchMerchants() {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/admin/merchants`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Create merchant
  async function createMerchant(merchantData) {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_URL}/admin/merchants`, merchantData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Update user
  async function updateUser(id, userData) {
    const token = localStorage.getItem('token')
    const response = await axios.put(`${API_URL}/admin/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Delete user
  async function deleteUser(id) {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`${API_URL}/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Toggle user active status
  async function toggleUserActive(id) {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_URL}/admin/users/${id}/toggle-active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Get current user profile
  async function fetchProfile() {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Update current user profile
  async function updateProfile(profileData) {
    const token = localStorage.getItem('token')
    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Delete own account
  async function deleteAccount(password) {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { password }
    })
    return response.data
  }

  return {
    fetchUsers,
    fetchMerchants,
    createMerchant,
    updateUser,
    deleteUser,
    toggleUserActive,
    fetchProfile,
    updateProfile,
    deleteAccount
  }
})
