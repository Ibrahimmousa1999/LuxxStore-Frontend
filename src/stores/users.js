import { defineStore } from 'pinia'
import axios from '@/utils/axios'

export const useUsersStore = defineStore('users', () => {
  // Admin: Get all users
  async function fetchUsers(params = {}) {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  }

  // Admin: Get all merchants
  async function fetchMerchants() {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/admin/merchants`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Create merchant
  async function createMerchant(merchantData) {
    const token = localStorage.getItem('token')
    const response = await axios.post(`/admin/merchants`, merchantData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Update user
  async function updateUser(id, userData) {
    const token = localStorage.getItem('token')
    const response = await axios.put(`/admin/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Delete user
  async function deleteUser(id) {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Admin: Toggle user active status
  async function toggleUserActive(id) {
    const token = localStorage.getItem('token')
    const response = await axios.post(`/admin/users/${id}/toggle-active`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Get current user profile
  async function fetchProfile() {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Update current user profile
  async function updateProfile(profileData) {
    const token = localStorage.getItem('token')
    const response = await axios.put(`/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }

  // Delete own account
  async function deleteAccount(password) {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`/profile`, {
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
