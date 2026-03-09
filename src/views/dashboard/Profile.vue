<template>
  <div>
    <Toast :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" @close="toast.show = false" />
    
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
      <div>
        <div class="section-tag">{{ t('dashboard.profile') || 'Profile' }}</div>
        <h1 class="section-title">{{ t('dashboard.my_profile') || 'My Profile' }}</h1>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted)">{{ t('common.loading') }}...</p>
    </div>

    <!-- Profile Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lux-card">
        <div class="text-center">
          <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,var(--gold-dark),var(--gold));display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:900;color:var(--obsidian);margin:0 auto 20px">
            {{ profile.name?.charAt(0).toUpperCase() }}
          </div>
          <h2 style="font-size:24px;font-weight:900;color:var(--text);margin-bottom:8px">{{ profile.name }}</h2>
          <p style="color:var(--text-muted);margin-bottom:16px">{{ profile.email }}</p>
          <span class="lux-badge" :class="getRoleBadge(profile.role)">{{ profile.role }}</span>
          
          <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border-white)">
            <div style="display:flex;flex-direction:column;gap:8px;text-align:left">
              <div style="display:flex;justify-content:space-between;font-size:14px">
                <span style="color:var(--text-muted)">{{ t('auth.phone') || 'Phone' }}:</span>
                <span style="color:var(--text);font-weight:600">{{ profile.phone || 'N/A' }}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:14px">
                <span style="color:var(--text-muted)">{{ t('common.status') }}:</span>
                <span class="lux-badge badge-green" v-if="profile.active">Active</span>
                <span class="lux-badge badge-red" v-else>Inactive</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:14px">
                <span style="color:var(--text-muted)">Member Since:</span>
                <span style="color:var(--text);font-weight:600">{{ formatDate(profile.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Profile Form -->
      <div class="lux-card lg:col-span-2">
        <h3 style="font-size:20px;font-weight:900;color:var(--text);margin-bottom:24px">Update Profile</h3>
        
        <form @submit.prevent="handleUpdateProfile">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
            <div class="lux-input-group">
              <label>{{ t('auth.name') }}</label>
              <input v-model="form.name" type="text" required class="lux-input" style="border-radius:10px" />
            </div>
            <div class="lux-input-group">
              <label>{{ t('auth.phone') }}</label>
              <input v-model="form.phone" type="tel" class="lux-input" style="border-radius:10px" />
            </div>
          </div>
          
          <div class="lux-input-group" style="margin-bottom:16px">
            <label>{{ t('auth.email') }}</label>
            <input v-model="form.email" type="email" required class="lux-input" style="border-radius:10px" />
          </div>

          <div style="border-top:1px solid var(--border-white);padding-top:24px;margin-top:24px">
            <h4 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">Change Password (Optional)</h4>
            
            <div class="lux-input-group" style="margin-bottom:16px">
              <label>Current Password</label>
              <input v-model="form.current_password" type="password" class="lux-input" style="border-radius:10px" placeholder="Enter current password" />
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
              <div class="lux-input-group">
                <label>New Password</label>
                <input v-model="form.password" type="password" class="lux-input" style="border-radius:10px" placeholder="Enter new password" />
              </div>
              <div class="lux-input-group">
                <label>Confirm Password</label>
                <input v-model="form.password_confirmation" type="password" class="lux-input" style="border-radius:10px" placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          <div style="display:flex;gap:12px;margin-top:24px">
            <button type="submit" :disabled="updating" class="btn btn-gold" style="flex:1;border-radius:10px">
              {{ updating ? 'Updating...' : 'Update Profile' }}
            </button>
            <button type="button" @click="showDeleteModal = true" class="btn" style="border-radius:10px;background:rgba(224,92,92,0.1);color:var(--danger);border:1px solid rgba(224,92,92,0.3)">
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content lux-card" style="max-width:500px;width:90%">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:64px;margin-bottom:16px">⚠️</div>
          <h2 style="font-size:24px;font-weight:900;color:var(--danger);margin-bottom:8px">Delete Account</h2>
          <p style="color:var(--text-muted)">This action cannot be undone. All your data will be permanently deleted.</p>
        </div>
        
        <form @submit.prevent="handleDeleteAccount">
          <div class="lux-input-group" style="margin-bottom:24px">
            <label>Enter your password to confirm</label>
            <input v-model="deletePassword" type="password" required class="lux-input" style="border-radius:10px" placeholder="Your password" />
          </div>
          
          <div style="display:flex;gap:12px">
            <button type="button" @click="showDeleteModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">Cancel</button>
            <button type="submit" :disabled="deleting" class="btn" style="flex:1;border-radius:10px;background:var(--danger);color:white;border:none">
              {{ deleting ? 'Deleting...' : 'Delete My Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import Toast from '@/components/Toast.vue'

const { t } = useI18n()
const router = useRouter()
const usersStore = useUsersStore()
const authStore = useAuthStore()

const profile = ref({})
const loading = ref(false)
const updating = ref(false)
const deleting = ref(false)
const showDeleteModal = ref(false)
const deletePassword = ref('')

const form = ref({
  name: '',
  email: '',
  phone: '',
  current_password: '',
  password: '',
  password_confirmation: ''
})

const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  loading.value = true
  try {
    profile.value = await usersStore.fetchProfile()
    form.value = {
      name: profile.value.name,
      email: profile.value.email,
      phone: profile.value.phone || '',
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    showToast('error', 'Error', 'Failed to load profile')
  } finally {
    loading.value = false
  }
}

async function handleUpdateProfile() {
  updating.value = true
  
  // Validate password fields if changing password
  if (form.value.password) {
    if (!form.value.current_password) {
      showToast('error', 'Validation Error', 'Current password is required to change password')
      updating.value = false
      return
    }
    if (form.value.password !== form.value.password_confirmation) {
      showToast('error', 'Validation Error', 'New passwords do not match')
      updating.value = false
      return
    }
  }
  
  try {
    const updateData = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone
    }
    
    if (form.value.password) {
      updateData.current_password = form.value.current_password
      updateData.password = form.value.password
    }
    
    const response = await usersStore.updateProfile(updateData)
    
    // Update auth store with new user data
    authStore.user = response.user
    localStorage.setItem('user', JSON.stringify(response.user))
    
    showToast('success', 'Profile Updated', 'Your profile has been updated successfully')
    
    // Clear password fields
    form.value.current_password = ''
    form.value.password = ''
    form.value.password_confirmation = ''
    
    await loadProfile()
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMsg = error.response?.data?.errors?.current_password?.[0] || 
                     error.response?.data?.message || 
                     'Failed to update profile'
    showToast('error', 'Update Failed', errorMsg)
  } finally {
    updating.value = false
  }
}

async function handleDeleteAccount() {
  deleting.value = true
  try {
    await usersStore.deleteAccount(deletePassword.value)
    showToast('success', 'Account Deleted', 'Your account has been deleted')
    
    setTimeout(() => {
      authStore.logout()
      router.push('/auth/login')
    }, 1500)
  } catch (error) {
    console.error('Error deleting account:', error)
    const errorMsg = error.response?.data?.errors?.password?.[0] || 
                     error.response?.data?.message || 
                     'Failed to delete account'
    showToast('error', 'Delete Failed', errorMsg)
  } finally {
    deleting.value = false
  }
}

function showToast(type, title, message) {
  toast.value = {
    show: true,
    type,
    title,
    message
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getRoleBadge(role) {
  if (role === 'admin') return 'badge-red'
  if (role === 'merchant') return 'badge-blue'
  return 'badge-purple'
}
</script>

<style scoped>
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
