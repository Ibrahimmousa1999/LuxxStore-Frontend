<template>
  <div>
    
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
      <div>
        <div class="section-tag">{{ t('dashboard.admin.title') }}</div>
        <h1 class="section-title">{{ activeTab === 'merchants' ? t('dashboard.admin.merchants') : activeTab === 'admins' ? 'Admins' : t('dashboard.admin.users') }}</h1>
      </div>
      <button v-if="activeTab === 'merchants'" @click="showMerchantModal = true" class="btn btn-gold" style="border-radius:12px">
        + {{ t('dashboard.admin.add_merchant') }}
      </button>
      <button v-if="activeTab === 'admins'" @click="showAdminModal = true" class="btn btn-gold" style="border-radius:12px">
        + Add Admin
      </button>
    </div>

    <!-- Tabs -->
    <div style="display:flex;gap:8px;margin-bottom:24px;border-bottom:1px solid var(--border-white)">
      <button @click="activeTab = 'users'" :class="activeTab === 'users' ? 'tab-active' : 'tab-inactive'" class="tab-btn">
        {{ t('dashboard.admin.all_users') }}
      </button>
      <button @click="activeTab = 'merchants'" :class="activeTab === 'merchants' ? 'tab-active' : 'tab-inactive'" class="tab-btn">
        {{ t('dashboard.admin.merchants') }}
      </button>
      <button @click="activeTab = 'admins'" :class="activeTab === 'admins' ? 'tab-active' : 'tab-inactive'" class="tab-btn">
        Admins
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="lux-card text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
    </div>

    <div v-else class="lux-card" style="padding:0;overflow:hidden">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border-white);display:flex;gap:12px;flex-wrap:wrap">
        <input type="text" v-model="searchQuery" :placeholder="t('common.search')" class="lux-input" style="flex:1;min-width:200px;border-radius:10px" />
        <LuxSelect
          v-model="roleFilter"
          :options="roleOptions"
          :placeholder="t('common.all')"
          :searchable="false"
          style="width:180px"
        />
      </div>
      <div style="overflow-x:auto">
        <table class="lux-table" v-if="filteredUsers.length > 0">
          <thead>
            <tr>
              <th>{{ t('auth.name') }}</th>
              <th>{{ t('auth.email') }}</th>
              <th>{{ t('dashboard.admin.role') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('dashboard.admin.joined') }}</th>
              <th>{{ t('common.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <div style="display:flex;align-items:center;gap:12px">
                  <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--gold-dark),var(--gold));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:var(--obsidian);flex-shrink:0">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <span style="font-weight:600;max-width:160px;min-width:160px">{{ user.name }}</span>
                </div>
              </td>
              <td style="color:var(--text-muted)">{{ user.email }}</td>
              <td><span class="lux-badge" :class="getRoleBadge(user.role)">{{ user.role }}</span></td>
              <td>
                <span class="lux-badge" :class="user.active ? 'badge-green' : 'badge-red'">
                  {{ user.active ? t('dashboard.admin.active') : t('dashboard.admin.inactive') }}
                </span>
              </td>
              <td style="color:var(--text-muted)">{{ formatDate(user.created_at) }}</td>
              <td>
                <div style="display:flex;gap:6px">
                  <button @click="toggleActive(user)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px" :title="user.active ? t('dashboard.admin.deactivate') : t('dashboard.admin.activate')">
                    {{ user.active ? '🔓' : '🔒' }}
                  </button>
                  <button @click="editUser(user)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px">✏️</button>
                  <button @click="openDeleteModal(user)" class="btn btn-sm" style="border-radius:8px;padding:6px 10px;background:rgba(224,92,92,0.1);color:var(--danger);border:1px solid rgba(224,92,92,0.2)">🗑</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center py-16">
          <div style="font-size:64px;margin-bottom:16px;opacity:0.3">{{ activeTab === 'merchants' ? '🏪' : '👥' }}</div>
          <div style="font-size:18px;font-weight:700;color:var(--text-muted);margin-bottom:6px">
            {{ activeTab === 'merchants' ? t('dashboard.admin.no_merchants') : t('dashboard.admin.no_users') }}
          </div>
          <div style="font-size:14px;color:var(--text-dim);margin-bottom:20px">
            {{ activeTab === 'merchants' ? t('dashboard.admin.no_merchants_desc') : t('dashboard.admin.no_users_desc') }}
          </div>
          <button v-if="activeTab === 'merchants'" @click="showMerchantModal = true" class="btn btn-gold" style="border-radius:12px">
            + {{ t('dashboard.admin.add_merchant') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Merchant Modal -->
    <div v-if="showMerchantModal" class="modal-overlay" @click.self="showMerchantModal = false">
      <div class="modal-content lux-card" style="max-width:500px;width:90%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
          <h2 style="font-size:24px;font-weight:900;color:var(--text)">{{ editingUser ? 'Edit Merchant' : 'Add New Merchant' }}</h2>
          <button @click="showMerchantModal = false" class="btn btn-ghost" style="padding:8px;border-radius:8px">✕</button>
        </div>
        <form @submit.prevent="saveMerchant">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Name *</label>
              <input v-model="merchantForm.name" type="text" class="lux-input" 
                :style="formErrors.name ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.name = ''" />
              <div v-if="formErrors.name" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.name }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Email *</label>
              <input v-model="merchantForm.email" type="email" class="lux-input" 
                :style="formErrors.email ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.email = ''" />
              <div v-if="formErrors.email" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.email }}</div>
            </div>
            <div v-if="!editingUser">
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Password *</label>
              <input v-model="merchantForm.password" type="password" class="lux-input" 
                :style="formErrors.password ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.password = ''" />
              <div v-if="formErrors.password" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.password }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Phone</label>
              <input v-model="merchantForm.phone" type="tel" class="lux-input" 
                :style="formErrors.phone ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.phone = ''" />
              <div v-if="formErrors.phone" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.phone }}</div>
            </div>
            <div style="display:flex;gap:12px;margin-top:8px">
              <button type="button" @click="showMerchantModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">Cancel</button>
              <button type="submit" :disabled="saving" class="btn btn-gold" style="flex:1;border-radius:10px">
                {{ saving ? 'Saving...' : (editingUser ? 'Update' : 'Create') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Admin Modal -->
    <div v-if="showAdminModal" class="modal-overlay" @click.self="showAdminModal = false">
      <div class="modal-content lux-card" style="max-width:500px;width:90%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
          <h2 style="font-size:24px;font-weight:900;color:var(--text)">Add New Admin</h2>
          <button @click="showAdminModal = false" class="btn btn-ghost" style="padding:8px;border-radius:8px">✕</button>
        </div>
        <form @submit.prevent="saveAdmin">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Name *</label>
              <input v-model="adminForm.name" type="text" class="lux-input" 
                :style="formErrors.name ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.name = ''" />
              <div v-if="formErrors.name" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.name }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Email *</label>
              <input v-model="adminForm.email" type="email" class="lux-input" 
                :style="formErrors.email ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.email = ''" />
              <div v-if="formErrors.email" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.email }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Password *</label>
              <input v-model="adminForm.password" type="password" class="lux-input" 
                :style="formErrors.password ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.password = ''" />
              <div v-if="formErrors.password" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.password }}</div>
              <div style="font-size:11px;color:var(--text-dim);margin-top:4px">Minimum 8 characters</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">Phone (Optional)</label>
              <input v-model="adminForm.phone" type="tel" class="lux-input" 
                :style="formErrors.phone ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.phone = ''" />
              <div v-if="formErrors.phone" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.phone }}</div>
            </div>
            <div style="padding:12px;background:rgba(212,175,55,0.1);border-radius:8px;border:1px solid rgba(212,175,55,0.3)">
              <div style="font-size:12px;color:var(--gold);font-weight:600;margin-bottom:4px">⚠️ Admin Privileges</div>
              <div style="font-size:11px;color:var(--text-muted)">This user will have full administrative access to the system.</div>
            </div>
            <div style="display:flex;gap:12px;margin-top:8px">
              <button type="button" @click="showAdminModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">Cancel</button>
              <button type="submit" :disabled="saving" class="btn btn-gold" style="flex:1;border-radius:10px">
                {{ saving ? 'Creating...' : 'Create Admin' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="modal-overlay" @click.self="showDeleteConfirmModal = false">
      <div class="modal-content lux-card" style="max-width:500px;width:90%">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:64px;margin-bottom:16px">⚠️</div>
          <h2 style="font-size:24px;font-weight:900;color:var(--danger);margin-bottom:8px">Delete User</h2>
          <p style="color:var(--text-muted);margin-bottom:8px">Are you sure you want to delete this user?</p>
          <p style="color:var(--text);font-weight:700;font-size:18px">{{ userToDelete?.name }}</p>
          <p style="color:var(--text-muted);font-size:14px;margin-top:8px">This action cannot be undone.</p>
        </div>
        
        <div style="display:flex;gap:12px">
          <button @click="showDeleteConfirmModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">Cancel</button>
          <button @click="confirmDelete" :disabled="deleting" class="btn" style="flex:1;border-radius:10px;background:var(--danger);color:white;border:none">
            {{ deleting ? 'Deleting...' : 'Delete User' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from '@/stores/users'
import { useToast } from '@/composables/useToast'
import LuxSelect from '@/components/LuxSelect.vue'
import axios from '@/utils/axios'

const { t } = useI18n()
const usersStore = useUsersStore()
const { success, error: showError } = useToast()

const activeTab = ref('users')
const searchQuery = ref('')
const roleFilter = ref('')
const users = ref([])
const loading = ref(false)
const showMerchantModal = ref(false)
const showAdminModal = ref(false)
const editingUser = ref(null)
const saving = ref(false)
const showDeleteConfirmModal = ref(false)
const userToDelete = ref(null)
const deleting = ref(false)

const merchantForm = ref({
  name: '',
  email: '',
  password: '',
  phone: ''
})

const adminForm = ref({
  name: '',
  email: '',
  password: '',
  phone: ''
})

const formErrors = ref({
  name: '',
  email: '',
  password: '',
  phone: ''
})

const roleOptions = computed(() => [
  { label: t('common.all'), value: '' },
  { label: t('auth.merchant'), value: 'merchant' },
  { label: t('auth.customer'), value: 'user' }
])

onMounted(() => {
  loadData()
})

// Watch for tab changes and reload data
watch(activeTab, () => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    if (activeTab.value === 'merchants') {
      users.value = await usersStore.fetchMerchants()
    } else {
      // Fetch all users (merchants, customers, admins)
      const allUsers = await usersStore.fetchUsers()
      users.value = allUsers
    }
  } catch (err) {
    console.error('Error loading users:', err)
    showError('Failed to Load Users', err.response?.data?.message || 'An error occurred while loading users')
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // Show only admins in admins tab, exclude admins from other tabs
    if (activeTab.value === 'admins') {
      if (user.role !== 'admin') return false
    } else {
      if (user.role === 'admin') return false
    }
    
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

function validateForm() {
  formErrors.value = {
    name: '',
    email: '',
    password: '',
    phone: ''
  }
  
  let isValid = true
  
  if (!merchantForm.value.name || merchantForm.value.name.trim().length < 2) {
    formErrors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!merchantForm.value.email || !emailRegex.test(merchantForm.value.email)) {
    formErrors.value.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!editingUser.value) {
    if (!merchantForm.value.password || merchantForm.value.password.length < 6) {
      formErrors.value.password = 'Password must be at least 6 characters'
      isValid = false
    }
  }
  
  if (merchantForm.value.phone && merchantForm.value.phone.length < 10) {
    formErrors.value.phone = 'Phone number must be at least 10 digits'
    isValid = false
  }
  
  return isValid
}

async function saveMerchant() {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  try {
    if (editingUser.value) {
      let editObject = {
        ...merchantForm.value,
      }
      delete editObject.password
      await usersStore.updateUser(editingUser.value.id, editObject)
      success('Merchant Updated Successfully', `${merchantForm.value.name} has been updated`)
    } else {
      await usersStore.createMerchant(merchantForm.value)
      success('Merchant Created Successfully', `${merchantForm.value.name} has been added to the system`)
    }
    showMerchantModal.value = false
    resetForm()
    await loadData()
  } catch (error) {
    console.error('Error saving merchant:', error)
    const errorMessage = error.response?.data?.message || 'Failed to save merchant'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      if (errors.email) formErrors.value.email = errors.email[0]
      if (errors.name) formErrors.value.name = errors.name[0]
      if (errors.password) formErrors.value.password = errors.password[0]
      if (errors.phone) formErrors.value.phone = errors.phone[0]
    } else {
      showError('Error', errorMessage)
    }
  } finally {
    saving.value = false
  }
}

function validateAdminForm() {
  formErrors.value = {
    name: '',
    email: '',
    password: '',
    phone: ''
  }
  
  let isValid = true
  
  if (!adminForm.value.name || adminForm.value.name.trim().length < 2) {
    formErrors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!adminForm.value.email || !emailRegex.test(adminForm.value.email)) {
    formErrors.value.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!adminForm.value.password || adminForm.value.password.length < 8) {
    formErrors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  if (adminForm.value.phone && adminForm.value.phone.length < 10) {
    formErrors.value.phone = 'Phone number must be at least 10 digits'
    isValid = false
  }
  
  return isValid
}

async function saveAdmin() {
  if (!validateAdminForm()) {
    return
  }
  
  saving.value = true
  try {
    const response = await axios.post('/admin/create-admin', adminForm.value)
    success('Admin Created Successfully', `${adminForm.value.name} has been added as an admin`)
    showAdminModal.value = false
    resetAdminForm()
    await loadData()
  } catch (error) {
    console.error('Error creating admin:', error)
    const errorMessage = error.response?.data?.message || 'Failed to create admin'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      if (errors.email) formErrors.value.email = errors.email[0]
      if (errors.name) formErrors.value.name = errors.name[0]
      if (errors.password) formErrors.value.password = errors.password[0]
      if (errors.phone) formErrors.value.phone = errors.phone[0]
    } else {
      showError('Error', errorMessage)
    }
  } finally {
    saving.value = false
  }
}

function editUser(user) {
  editingUser.value = user
  merchantForm.value = {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: ''
  }
  showMerchantModal.value = true
}

async function toggleActive(user) {
  try {
    await usersStore.toggleUserActive(user.id)
    const newStatus = user.active ? 'deactivated' : 'activated'
    showToast('success', 'Status Updated', `${user.name} has been ${newStatus}`)
    await loadData()
  } catch (error) {
    console.error('Error toggling user status:', error)
    showToast('error', 'Error', 'Failed to update user status')
  }
}

function openDeleteModal(user) {
  userToDelete.value = user
  showDeleteConfirmModal.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await usersStore.deleteUser(userToDelete.value.id)
    showToast('success', 'User Deleted', `${userToDelete.value.name} has been removed`)
    showDeleteConfirmModal.value = false
    userToDelete.value = null
    await loadData()
  } catch (error) {
    console.error('Error deleting user:', error)
    showToast('error', 'Error', 'Failed to delete user')
  } finally {
    deleting.value = false
  }
}

function resetForm() {
  merchantForm.value = { name: '', email: '', password: '', phone: '' }
  editingUser.value = null
}

function resetAdminForm() {
  adminForm.value = { name: '', email: '', password: '', phone: '' }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getRoleBadge(role) {
  if (role === 'admin') return 'badge-red'
  if (role === 'merchant') return 'badge-blue'
  return 'badge-purple'
}

function showToast(type, title, message) {
  toast.value = {
    show: true,
    type,
    title,
    message
  }
}
</script>

<style scoped>
.tab-btn {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

.tab-inactive:hover {
  color: var(--text);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
