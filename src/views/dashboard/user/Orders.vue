<template>
  <div>
    <div class="section-tag">{{ t('dashboard.user.title') }}</div>
    <h1 class="section-title mb-8">{{ t('dashboard.user.orders') }}</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted)">{{ t('common.loading') }}...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!orders.length" class="lux-card text-center py-16 mt-5">
      <div style="font-size:64px;margin-bottom:16px">📦</div>
      <h3 style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px">{{ t('dashboard.user.no_orders') }}</h3>
      <p style="color:var(--text-muted);margin-bottom:24px">{{ t('dashboard.user.no_orders_desc') }}</p>
      <router-link to="/shop" class="btn btn-gold" style="border-radius:12px">{{ t('nav.shop') }}</router-link>
    </div>

    <!-- Orders List -->
    <div v-else style="display:flex;flex-direction:column;gap:16px">
      <div v-for="order in orders" :key="order.id" class="order-card lux-card">
        <!-- Order Header -->
        <div class="order-header">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <span class="order-number">#{{ order.order_number || order.id }}</span>
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
          </div>
          <span class="lux-badge" :class="getStatusBadge(order.status)">{{ t(`order.status.${order.status}`) }}</span>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'" 
              :alt="item.product_name"
              class="order-item-image" />
            <div class="order-item-details">
              <div class="order-item-name">{{ item.product_name }}</div>
              <div class="order-item-meta">{{ item.quantity }}x {{ item.price.toLocaleString() }} {{ currency }}</div>
            </div>
            <div class="order-item-total">
              {{ (item.quantity * item.price).toLocaleString() }} {{ currency }}
            </div>
          </div>
        </div>

        <!-- Order Footer -->
        <div class="gold-line" style="margin:16px 0"></div>
        <div class="order-footer">
          <div class="order-total-section">
            <div class="order-total-label">{{ t('cart.total') }}</div>
            <div class="order-total-amount">{{ order.total.toLocaleString() }} {{ currency }}</div>
          </div>
          <div class="order-actions">
            <button @click="viewOrderDetails(order)" class="btn btn-ghost btn-sm order-action-btn">
              <span>👁️</span> {{ t('common.view_details') }}
            </button>
            <button v-if="order.status === 'delivered'" class="btn btn-outline btn-sm order-action-btn">
              <span>🔄</span> {{ t('dashboard.user.reorder') }}
            </button>
          </div>
        </div>
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
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">{{ t('dashboard.admin.customer_information') }}</h3>
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
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">{{ t('dashboard.admin.shipping_address') }}</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="font-size:14px;color:var(--text);line-height:1.6">
                {{ selectedOrder.shipping_address }}<br>
                {{ selectedOrder.city }}, {{ selectedOrder.state }} {{ selectedOrder.zip }}
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">{{ t('dashboard.admin.order_items') }}</h3>
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
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">{{ t('dashboard.admin.order_summary') }}</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="display:flex;flex-direction:column;gap:8px">
                <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--text-muted)">
                  <span>{{ t('dashboard.admin.subtotal') }}</span>
                  <span>{{ Number(selectedOrder.subtotal || selectedOrder.total).toLocaleString() }} {{ currency }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--text-muted)">
                  <span>{{ t('dashboard.admin.shipping') }}</span>
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
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">{{ t('dashboard.admin.payment_information') }}</h3>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">{{ t('dashboard.admin.payment_method') }}</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text);text-transform:capitalize">{{ selectedOrder.payment_method || 'N/A' }}</div>
                </div>
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">{{ t('dashboard.admin.payment_status') }}</div>
                  <span class="lux-badge" :class="selectedOrder.payment_status === 'paid' ? 'badge-green' : 'badge-gold'">{{ selectedOrder.payment_status || 'pending' }}</span>
                </div>
                <div>
                  <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">{{ t('dashboard.admin.order_date') }}</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text)">{{ formatDate(selectedOrder.created_at) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedOrder.notes">
            <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:12px;letter-spacing:1px;text-transform:uppercase">{{ t('dashboard.admin.notes') }}</h3>
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
import { useConfig } from '@/composables/useConfig'
import { useOrdersStore } from '@/stores/orders'

const { t } = useI18n()
const { currency } = useConfig()
const ordersStore = useOrdersStore()

const orders = ref([])
const loading = ref(false)
const showOrderModal = ref(false)
const selectedOrder = ref(null)

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  loading.value = true
  try {
    const response = await ordersStore.fetchOrders()
    orders.value = response.data || response
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getStatusBadge(status) {
  const badges = {
    'delivered': 'badge-green',
    'shipped': 'badge-blue',
    'processing': 'badge-purple',
    'pending': 'badge-gold',
    'cancelled': 'badge-red'
  }
  return badges[status] || 'badge-gold'
}

function viewOrderDetails(order) {
  selectedOrder.value = order
  showOrderModal.value = true
}
</script>

<style scoped>
.order-card {
  transition: all 0.3s ease;
  border: 1px solid var(--border-white);
}

.order-card:hover {
  border-color: var(--gold);
  box-shadow: 0 8px 24px rgba(201, 168, 76, 0.15);
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-white);
}

.order-number {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
  background: rgba(201, 168, 76, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
}

.order-date {
  font-size: 13px;
  color: var(--text-dim);
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  background: var(--surface2);
  border-radius: 12px;
  transition: all 0.2s;
}

.order-item:hover {
  background: var(--surface3);
}

.order-item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border-white);
  flex-shrink: 0;
}

.order-item-details {
  flex: 1;
  min-width: 0;
}

.order-item-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[dir="rtl"] .order-item-name {
  font-family: 'Tajawal', sans-serif;
}

.order-item-meta {
  font-size: 13px;
  color: var(--text-muted);
}

.order-item-total {
  font-size: 16px;
  font-weight: 800;
  color: var(--gold);
  flex-shrink: 0;
}

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.order-total-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-total-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-total-amount {
  font-size: 24px;
  font-weight: 900;
  color: var(--gold);
  font-family: 'Playfair Display', serif;
}

[dir="rtl"] .order-total-amount {
  font-family: 'Tajawal', sans-serif;
}

.order-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.order-action-btn {
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.order-action-btn span {
  font-size: 16px;
}

@media (max-width: 640px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .order-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .order-actions {
    width: 100%;
  }
  
  .order-action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
