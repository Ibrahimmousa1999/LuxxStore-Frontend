<template>
  <div>
    <Toast :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" @close="toast.show = false" />
    
    <div class="section-tag">{{ t('dashboard.admin.title') }}</div>
    <h1 class="section-title mb-8">{{ t('dashboard.admin.system_settings') }}</h1>
 <!-- Warning Banner -->
    <div class="lux-card" style="background:rgba(224,92,92,0.1);border:1px solid var(--danger);margin-bottom:24px">
      <div style="display:flex;align-items:start;gap:16px">
        <div style="font-size:32px">⚠️</div>
        <div>
          <h3 style="font-size:16px;font-weight:700;color:var(--danger);margin-bottom:8px">{{ t('dashboard.admin.danger_zone') }}</h3>
          <p style="color:var(--text-muted);font-size:14px;line-height:1.6">
            {{ t('dashboard.admin.danger_warning') }}
          </p>
        </div>
      </div>
    </div>
    <!-- Bulk Status Management -->
    <div style="margin-bottom:32px">
      <h2 style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:16px;display:flex;align-items:center;gap:8px">
        <span>🔄</span> {{ t('dashboard.admin.bulk_status') }}
      </h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">
        
        <!-- Activate/Deactivate Users -->
        <div class="lux-card" style="border:1px solid var(--border-gold);background:rgba(201,168,76,0.03)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <span style="font-size:24px">👥</span>
            <h3 style="font-size:14px;font-weight:700;color:var(--text)">{{ t('dashboard.admin.users_status') }}</h3>
          </div>
          <div style="display:flex;gap:8px">
            <button 
              @click="bulkStatusChange('users', true)" 
              :disabled="statusLoading.users"
              class="btn btn-sm"
              style="flex:1;background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:8px;font-size:12px"
            >
              ✓ {{ t('dashboard.admin.activate_all') }}
            </button>
            <button 
              @click="bulkStatusChange('users', false)" 
              :disabled="statusLoading.users"
              class="btn btn-sm"
              style="flex:1;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:8px;font-size:12px"
            >
              ✕ {{ t('dashboard.admin.deactivate_all') }}
            </button>
          </div>
        </div>

        <!-- Activate/Deactivate Merchants -->
        <div class="lux-card" style="border:1px solid var(--border-gold);background:rgba(201,168,76,0.03)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <span style="font-size:24px">🏪</span>
            <h3 style="font-size:14px;font-weight:700;color:var(--text)">{{ t('dashboard.admin.merchants_status') }}</h3>
          </div>
          <div style="display:flex;gap:8px">
            <button 
              @click="bulkStatusChange('merchants', true)" 
              :disabled="statusLoading.merchants"
              class="btn btn-sm"
              style="flex:1;background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:8px;font-size:12px"
            >
              ✓ {{ t('dashboard.admin.activate_all') }}
            </button>
            <button 
              @click="bulkStatusChange('merchants', false)" 
              :disabled="statusLoading.merchants"
              class="btn btn-sm"
              style="flex:1;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:8px;font-size:12px"
            >
              ✕ {{ t('dashboard.admin.deactivate_all') }}
            </button>
          </div>
        </div>

        <!-- Activate/Deactivate Products -->
        <div class="lux-card" style="border:1px solid var(--border-gold);background:rgba(201,168,76,0.03)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <span style="font-size:24px">📦</span>
            <h3 style="font-size:14px;font-weight:700;color:var(--text)">{{ t('dashboard.admin.products_status') }}</h3>
          </div>
          <div style="display:flex;gap:8px">
            <button 
              @click="bulkStatusChange('products', true)" 
              :disabled="statusLoading.products"
              class="btn btn-sm"
              style="flex:1;background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:8px;font-size:12px"
            >
              ✓ {{ t('dashboard.admin.activate_all') }}
            </button>
            <button 
              @click="bulkStatusChange('products', false)" 
              :disabled="statusLoading.products"
              class="btn btn-sm"
              style="flex:1;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:8px;font-size:12px"
            >
              ✕ {{ t('dashboard.admin.deactivate_all') }}
            </button>
          </div>
        </div>

        <!-- Activate/Deactivate Categories -->
        <div class="lux-card" style="border:1px solid var(--border-gold);background:rgba(201,168,76,0.03)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <span style="font-size:24px">📁</span>
            <h3 style="font-size:14px;font-weight:700;color:var(--text)">{{ t('dashboard.admin.categories_status') }}</h3>
          </div>
          <div style="display:flex;gap:8px">
            <button 
              @click="bulkStatusChange('categories', true)" 
              :disabled="statusLoading.categories"
              class="btn btn-sm"
              style="flex:1;background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:8px;font-size:12px"
            >
              ✓ {{ t('dashboard.admin.activate_all') }}
            </button>
            <button 
              @click="bulkStatusChange('categories', false)" 
              :disabled="statusLoading.categories"
              class="btn btn-sm"
              style="flex:1;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:8px;font-size:12px"
            >
              ✕ {{ t('dashboard.admin.deactivate_all') }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <div class="gold-line" style="margin:32px 0"></div>

   

    <!-- Reset Actions Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px">
      
      <!-- Reset Users -->
      <div class="lux-card" style="border:1px solid var(--border-white)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(147,51,234,0.1);display:flex;align-items:center;justify-content:center;font-size:24px">
            👥
          </div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:2px">{{ t('dashboard.admin.reset_users') }}</h3>
            <p style="font-size:12px;color:var(--text-muted)">{{ t('dashboard.admin.reset_users_desc') }}</p>
          </div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
          {{ t('dashboard.admin.reset_users_warning') }}
        </p>
        <button 
          @click="openConfirmModal('users')" 
          :disabled="loading.users"
          class="btn w-full"
          style="background:rgba(147,51,234,0.1);color:#9333ea;border:1px solid rgba(147,51,234,0.3);justify-content:center;border-radius:10px"
          @mouseover="(e) => { e.currentTarget.style.background='rgba(147,51,234,0.2)' }"
          @mouseleave="(e) => { e.currentTarget.style.background='rgba(147,51,234,0.1)' }"
        >
          {{ loading.users ? t('dashboard.admin.resetting') : t('dashboard.admin.reset_users') }}
        </button>
      </div>

      <!-- Reset Merchants -->
      <div class="lux-card" style="border:1px solid var(--border-white)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(234,179,8,0.1);display:flex;align-items:center;justify-content:center;font-size:24px">
            🏪
          </div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:2px">{{ t('dashboard.admin.reset_merchants') }}</h3>
            <p style="font-size:12px;color:var(--text-muted)">{{ t('dashboard.admin.reset_merchants_desc') }}</p>
          </div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
          {{ t('dashboard.admin.reset_merchants_warning') }}
        </p>
        <button 
          @click="openConfirmModal('merchants')" 
          :disabled="loading.merchants"
          class="btn w-full"
          style="background:rgba(234,179,8,0.1);color:#eab308;border:1px solid rgba(234,179,8,0.3);justify-content:center;border-radius:10px"
          @mouseover="(e) => { e.currentTarget.style.background='rgba(234,179,8,0.2)' }"
          @mouseleave="(e) => { e.currentTarget.style.background='rgba(234,179,8,0.1)' }"
        >
          {{ loading.merchants ? t('dashboard.admin.resetting') : t('dashboard.admin.reset_merchants') }}
        </button>
      </div>

      <!-- Reset Products -->
      <div class="lux-card" style="border:1px solid var(--border-white)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;font-size:24px">
            📦
          </div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:2px">{{ t('dashboard.admin.reset_products') }}</h3>
            <p style="font-size:12px;color:var(--text-muted)">{{ t('dashboard.admin.reset_products_desc') }}</p>
          </div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
          {{ t('dashboard.admin.reset_products_warning') }}
        </p>
        <button 
          @click="openConfirmModal('products')" 
          :disabled="loading.products"
          class="btn w-full"
          style="background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.3);justify-content:center;border-radius:10px"
          @mouseover="(e) => { e.currentTarget.style.background='rgba(59,130,246,0.2)' }"
          @mouseleave="(e) => { e.currentTarget.style.background='rgba(59,130,246,0.1)' }"
        >
          {{ loading.products ? t('dashboard.admin.resetting') : t('dashboard.admin.reset_products') }}
        </button>
      </div>

      <!-- Reset Categories -->
      <div class="lux-card" style="border:1px solid var(--border-white)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(16,185,129,0.1);display:flex;align-items:center;justify-content:center;font-size:24px">
            📁
          </div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:2px">{{ t('dashboard.admin.reset_categories') }}</h3>
            <p style="font-size:12px;color:var(--text-muted)">{{ t('dashboard.admin.reset_categories_desc') }}</p>
          </div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
          {{ t('dashboard.admin.reset_categories_warning') }}
        </p>
        <button 
          @click="openConfirmModal('categories')" 
          :disabled="loading.categories"
          class="btn w-full"
          style="background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);justify-content:center;border-radius:10px"
          @mouseover="(e) => { e.currentTarget.style.background='rgba(16,185,129,0.2)' }"
          @mouseleave="(e) => { e.currentTarget.style.background='rgba(16,185,129,0.1)' }"
        >
          {{ loading.categories ? t('dashboard.admin.resetting') : t('dashboard.admin.reset_categories') }}
        </button>
      </div>

      <!-- Reset Orders -->
      <div class="lux-card" style="border:1px solid var(--border-white)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center;font-size:24px">
            🧾
          </div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:2px">{{ t('dashboard.admin.reset_orders') }}</h3>
            <p style="font-size:12px;color:var(--text-muted)">{{ t('dashboard.admin.reset_orders_desc') }}</p>
          </div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
          {{ t('dashboard.admin.reset_orders_warning') }}
        </p>
        <button 
          @click="openConfirmModal('orders')" 
          :disabled="loading.orders"
          class="btn w-full"
          style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);justify-content:center;border-radius:10px"
          @mouseover="(e) => { e.currentTarget.style.background='rgba(239,68,68,0.2)' }"
          @mouseleave="(e) => { e.currentTarget.style.background='rgba(239,68,68,0.1)' }"
        >
          {{ loading.orders ? t('dashboard.admin.resetting') : t('dashboard.admin.reset_orders') }}
        </button>
      </div>

      <!-- Reset All Data -->
      <div class="lux-card" style="border:2px solid var(--danger);background:rgba(224,92,92,0.05)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(224,92,92,0.15);display:flex;align-items:center;justify-content:center;font-size:24px">
            💣
          </div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:var(--danger);margin-bottom:2px">{{ t('dashboard.admin.reset_all') }}</h3>
            <p style="font-size:12px;color:var(--danger)">{{ t('dashboard.admin.reset_all_desc') }}</p>
          </div>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
          {{ t('dashboard.admin.reset_all_warning') }}
        </p>
        <button 
          @click="openConfirmModal('all')" 
          :disabled="loading.all"
          class="btn w-full"
          style="background:var(--danger);color:white;border:none;justify-content:center;border-radius:10px"
          @mouseover="(e) => { e.currentTarget.style.background='#c53030' }"
          @mouseleave="(e) => { e.currentTarget.style.background='var(--danger)' }"
        >
          {{ loading.all ? t('dashboard.admin.resetting') : '⚠️ ' + t('dashboard.admin.reset_all') }}
        </button>
      </div>

    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-content lux-card" style="max-width:500px;width:90%">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:64px;margin-bottom:16px">⚠️</div>
          <h2 style="font-size:24px;font-weight:900;color:var(--danger);margin-bottom:8px">{{ t('dashboard.admin.confirm_reset') }}</h2>
          <p style="color:var(--text-muted);margin-bottom:16px">
            {{ t('dashboard.admin.reset_about') }} <strong style="color:var(--text)">{{ confirmType }}</strong>
          </p>
          <p style="color:var(--danger);font-size:14px;font-weight:600;background:rgba(224,92,92,0.1);padding:12px;border-radius:8px">
            {{ t('dashboard.admin.reset_warning_permanent') }}
          </p>
        </div>
        
        <div style="margin-bottom:24px">
          <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">
            {{ t('dashboard.admin.type_delete') }}:
          </label>
          <input 
            v-model="confirmText" 
            type="text" 
            class="lux-input" 
            placeholder="DELETE"
            style="border-radius:10px;text-align:center;font-weight:700"
            @keyup.enter="confirmText === 'DELETE' && confirmReset()"
          />
        </div>

        <div style="display:flex;gap:12px">
          <button @click="showConfirmModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">{{ t('dashboard.admin.cancel') }}</button>
          <button 
            @click="confirmReset" 
            :disabled="confirmText !== 'DELETE' || resetting"
            class="btn" 
            style="flex:1;border-radius:10px;background:var(--danger);color:white;border:none"
            :style="confirmText !== 'DELETE' ? 'opacity:0.5;cursor:not-allowed' : ''"
          >
            {{ resetting ? t('dashboard.admin.resetting') : t('dashboard.admin.confirm_delete') }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/utils/axios'
import Toast from '@/components/Toast.vue'

const { t } = useI18n()

const loading = ref({
  users: false,
  merchants: false,
  products: false,
  categories: false,
  orders: false,
  all: false
})

const statusLoading = ref({
  users: false,
  merchants: false,
  products: false,
  categories: false
})

const showConfirmModal = ref(false)
const confirmType = ref('')
const confirmText = ref('')
const resetting = ref(false)

const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

function showToast(type, title, message) {
  toast.value = {
    show: true,
    type,
    title,
    message
  }
}

function openConfirmModal(type) {
  confirmType.value = type
  confirmText.value = ''
  showConfirmModal.value = true
}

async function bulkStatusChange(type, active) {
  statusLoading.value[type] = true
  const action = active ? 'activate' : 'deactivate'
  
  try {
    const endpoint = `/admin/bulk-status/${type}`
    await axios.put(endpoint, { active })
    
    const actionText = active ? 'activated' : 'deactivated'
    showToast('success', 'Status Updated', `Successfully ${actionText} all ${type}. Refresh the ${type} page to see changes.`)
  } catch (error) {
    console.error('Error updating status:', error)
    showToast('error', 'Status Update Failed', error.response?.data?.message || 'Failed to update status')
  } finally {
    statusLoading.value[type] = false
  }
}

async function confirmReset() {
  if (confirmText.value !== 'DELETE') return
  
  resetting.value = true
  loading.value[confirmType.value] = true

  try {
    const endpoint = `/admin/reset/${confirmType.value}`
    await axios.delete(endpoint)
    
    showToast('success', 'Reset Successful', `Successfully reset ${confirmType.value}`)
    showConfirmModal.value = false
    confirmText.value = ''
  } catch (error) {
    console.error('Error resetting data:', error)
    showToast('error', 'Reset Failed', error.response?.data?.message || 'Failed to reset data')
  } finally {
    resetting.value = false
    loading.value[confirmType.value] = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
