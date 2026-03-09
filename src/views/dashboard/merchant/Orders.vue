<template>
  <div>
    <Toast :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" @close="toast.show = false" />
    
    <div class="section-tag">{{ t('dashboard.merchant.title') }}</div>
    <h1 class="section-title mb-8">{{ t('dashboard.merchant.orders') }}</h1>

    <div class="lux-card" style="padding:0;overflow:visible">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border-white);display:flex;gap:12px;flex-wrap:wrap">
        <input type="text" v-model="searchQuery" :placeholder="t('common.search')" class="lux-input" style="flex:1;min-width:200px;border-radius:10px" />
        <LuxSelect
          v-model="statusFilter"
          :options="statusFilterOptions"
          :placeholder="t('common.all')"
          :searchable="false"
          style="width:180px"
        />
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
        <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
      </div>
      
      <div v-else-if="filteredOrders.length > 0" style="overflow-x:auto;overflow-y:visible">
        <table class="lux-table">
          <thead>
            <tr>
              <th>{{ t('common.order') }}</th>
              <th>{{ t('common.customer') }}</th>
              <th>{{ t('common.date') }}</th>
              <th>{{ t('cart.total') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('common.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td><span style="font-family:monospace;color:var(--gold)">#{{ order.order_number || order.id }}</span></td>
              <td style="font-weight:600">{{ order.user?.name || 'N/A' }}</td>
              <td style="color:var(--text-muted)">{{ formatDate(order.created_at) }}</td>
              <td><span style="font-weight:700;color:var(--gold)">{{ order.total.toLocaleString() }} {{ currency }}</span></td>
              <td><span class="lux-badge" :class="getStatusBadge(order.status)">{{ t(`order.status.${order.status}`) }}</span></td>
              <td>
                <div style="display:flex;gap:8px;align-items:center">
                  <button @click="viewOrderDetails(order)" class="btn btn-ghost btn-sm" style="padding:6px 12px;border-radius:8px;white-space:nowrap">
                    👁️ {{ t('common.view') }}
                  </button>
                  <LuxSelect
                    v-model="order.status"
                    @update:modelValue="updateOrderStatus(order)"
                    :options="orderStatusOptions"
                    :searchable="false"
                    style="width:140px"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div style="font-size:64px;margin-bottom:16px;opacity:0.3">📦</div>
        <div style="font-size:18px;font-weight:700;color:var(--text-muted);margin-bottom:6px">No Orders Yet</div>
        <div style="font-size:14px;color:var(--text-dim)">Orders for your products will appear here</div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal" class="modal-overlay" @click.self="showOrderModal = false">
      <div class="modal-content lux-card" style="max-width:800px;width:90%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border-white)">
          <div>
            <h2 style="font-size:24px;font-weight:900;color:var(--text);margin-bottom:4px">{{ t('common.order') }} #{{ selectedOrder?.order_number || selectedOrder?.id }}</h2>
            <span class="lux-badge" :class="getStatusBadge(selectedOrder?.status)">{{ t(`order.status.${selectedOrder?.status}`) }}</span>
          </div>
          <button @click="showOrderModal = false" class="btn btn-ghost" style="padding:8px;border-radius:8px">✕</button>
        </div>

        <div v-if="selectedOrder" style="display:flex;flex-direction:column;gap:24px">
          <!-- Customer Information -->
          <div>
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">{{ t('common.customer') }} Information</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">{{ t('common.name') }}</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text)">{{ selectedOrder.customer_name || selectedOrder.user?.name }}</div>
                </div>
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">{{ t('common.email') }}</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text)">{{ selectedOrder.customer_email || selectedOrder.user?.email }}</div>
                </div>
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">{{ t('common.phone') }}</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text)">{{ selectedOrder.customer_phone || 'N/A' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div>
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">Shipping Address</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="font-size:14px;color:var(--text);line-height:1.6">
                {{ selectedOrder.shipping_address }}<br>
                {{ selectedOrder.city }}, {{ selectedOrder.state }} {{ selectedOrder.zip }}
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">Order Items</h3>
            <div class="lux-card" style="background:var(--surface2);padding:0;overflow:hidden">
              <div v-for="item in selectedOrder.items" :key="item.id" style="padding:16px;border-bottom:1px solid var(--border-white);display:flex;gap:16px;align-items:center">
                <img v-if="item.product?.image" :src="item.product.image" :alt="item.product_name" style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border-white)" />
                <div v-else style="width:60px;height:60px;background:var(--surface);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px">📦</div>
                <div style="flex:1">
                  <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:4px">{{ item.product_name }}</div>
                  <div style="font-size:13px;color:var(--text-muted)">{{ item.quantity }}x {{ Number(item.price).toLocaleString() }} {{ currency }}</div>
                </div>
                <div style="font-size:18px;font-weight:900;color:var(--gold)">{{ Number(item.total || item.price * item.quantity).toLocaleString() }} {{ currency }}</div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div>
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">Order Summary</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="display:flex;flex-direction:column;gap:8px">
                <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--text-muted)">
                  <span>Subtotal</span>
                  <span>{{ Number(selectedOrder.subtotal || selectedOrder.total).toLocaleString() }} {{ currency }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--text-muted)">
                  <span>Shipping</span>
                  <span>{{ Number(selectedOrder.shipping || 0).toLocaleString() }} {{ currency }}</span>
                </div>
                <div style="height:1px;background:var(--border-white);margin:8px 0"></div>
                <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:900;color:var(--gold)">
                  <span>Total</span>
                  <span>{{ Number(selectedOrder.total).toLocaleString() }} {{ currency }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div>
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">Payment Information</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Payment Method</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text);text-transform:capitalize">{{ selectedOrder.payment_method || 'N/A' }}</div>
                </div>
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Payment Status</div>
                  <span class="lux-badge" :class="selectedOrder.payment_status === 'paid' ? 'badge-green' : 'badge-gold'">{{ selectedOrder.payment_status || 'pending' }}</span>
                </div>
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Order Date</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text)">{{ formatDate(selectedOrder.created_at) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedOrder.notes">
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">Notes</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <p style="font-size:14px;color:var(--text);line-height:1.6">{{ selectedOrder.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/utils/axios'
import Toast from '@/components/Toast.vue'
import LuxSelect from '@/components/LuxSelect.vue'
import { useConfig } from '@/composables/useConfig'

const { t } = useI18n()
const { currency } = useConfig()

const searchQuery = ref('')
const statusFilter = ref('')
const orders = ref([])
const loading = ref(false)
const showOrderModal = ref(false)
const selectedOrder = ref(null)

const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const statusFilterOptions = computed(() => [
  { label: t('common.all'), value: '' },
  { label: t('common.pending'), value: 'pending' },
  { label: t('common.processing'), value: 'processing' },
  { label: t('common.shipped'), value: 'shipped' },
  { label: t('common.delivered'), value: 'delivered' }
])

const orderStatusOptions = computed(() => [
  { label: t('order.status.pending'), value: 'pending' },
  { label: t('order.status.processing'), value: 'processing' },
  { label: t('order.status.shipped'), value: 'shipped' },
  { label: t('order.status.delivered'), value: 'delivered' },
  { label: t('order.status.cancelled'), value: 'cancelled' }
])

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  loading.value = true
  try {
    const response = await axios.get('/orders')
    // Handle paginated response
    orders.value = response.data.data || response.data
  } catch (error) {
    console.error('Error loading orders:', error)
    showToast('error', 'Error', error.response?.data?.message || 'Failed to load orders')
  } finally {
    loading.value = false
  }
}

const filteredOrders = computed(() => {
  if (!Array.isArray(orders.value)) {
    return []
  }
  return orders.value.filter(order => {
    const customerName = order.user?.name || ''
    const orderNumber = order.order_number || order.id.toString()
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         orderNumber.includes(searchQuery.value)
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

async function updateOrderStatus(order) {
  try {
    await axios.put(`/orders/${order.id}`, { status: order.status })
    showToast('success', 'Status Updated', `Order #${order.order_number || order.id} status changed to ${order.status}`)
  } catch (error) {
    console.error('Error updating order status:', error)
    showToast('error', 'Error', error.response?.data?.message || 'Failed to update order status')
    await loadOrders()
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getStatusBadge(status) {
  if (status === 'delivered') return 'badge-green'
  if (status === 'shipped') return 'badge-blue'
  if (status === 'processing') return 'badge-purple'
  if (status === 'cancelled') return 'badge-red'
  return 'badge-gold'
}

function showToast(type, title, message) {
  toast.value = {
    show: true,
    type,
    title,
    message
  }
}

function viewOrderDetails(order) {
  selectedOrder.value = order
  showOrderModal.value = true
}
</script>
