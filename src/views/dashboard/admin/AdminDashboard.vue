<template>
  <div>
    <div class="section-tag">{{ t('common.welcome_back') }}</div>
    <h1 class="section-title mb-8">{{ t('dashboard.admin.title') }}</h1>

    <!-- Loading State -->
    <div v-if="loading" class="lux-card text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
    </div>

    <div v-else>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card" :class="stat.color">
        <div class="stat-icon" :class="stat.color">{{ stat.icon }}</div>
        <div style="font-size:28px;font-weight:900;color:var(--text);margin-bottom:4px">{{ stat.value }}</div>
        <div style="font-size:13px;color:var(--text-muted)">{{ stat.label }}</div>
        <div style="display:flex;align-items:center;gap:4px;margin-top:8px">
          <span style="font-size:12px;font-weight:700;color:var(--success)">↑ {{ stat.growth }}</span>
          <span style="font-size:11px;color:var(--text-dim)">{{ t('dashboard.admin.growth') }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Orders Table -->
      <div class="lux-card" style="padding:0;overflow:hidden">
        <div style="padding:20px 24px;border-bottom:1px solid var(--border-white)">
          <h2 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--text)">{{ t('dashboard.admin.recent_orders') }}</h2>
        </div>
        <table class="lux-table" v-if="recentOrders.length > 0">
          <thead>
            <tr>
              <th>{{ t('common.order') }}</th>
              <th>{{ t('common.customer') }}</th>
              <th>{{ t('common.amount') }}</th>
              <th>{{ t('common.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td><span style="font-family:monospace;color:var(--gold)">#{{ order.id }}</span></td>
              <td>{{ order.customer }}</td>
              <td><span style="font-weight:700;color:var(--gold)">{{ order.amount.toLocaleString() }} {{ t('common.sar') }}</span></td>
              <td>
                <span class="lux-badge" :class="getStatusBadge(order.status)">{{ order.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center py-12">
          <div style="font-size:48px;margin-bottom:12px;opacity:0.3">📦</div>
          <div style="font-size:16px;font-weight:600;color:var(--text-muted);margin-bottom:4px">No Orders Yet</div>
          <div style="font-size:13px;color:var(--text-dim)">Orders will appear here once customers start purchasing</div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="lux-card" style="padding:0;overflow:hidden">
        <div style="padding:20px 24px;border-bottom:1px solid var(--border-white)">
          <h2 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--text)">{{ t('dashboard.admin.top_products') }}</h2>
        </div>
        <div style="padding:16px 24px" v-if="topProducts.length > 0">
          <div v-for="(product, i) in topProducts" :key="product.id"
            style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border-white)"
            :style="i === topProducts.length - 1 ? 'border-bottom:none' : ''"
          >
            <div style="width:24px;text-align:center;font-size:14px;font-weight:700;color:var(--text-dim)">{{ i + 1 }}</div>
            <img :src="product.image" :alt="product.name" style="width:46px;height:46px;object-fit:cover;border-radius:10px;border:1px solid var(--border-white)" />
            <div style="flex:1">
              <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px">{{ product.name }}</div>
              <div style="font-size:12px;color:var(--text-muted)">{{ product.sales }} {{ t('common.orders') || 'orders' }}</div>
            </div>
            <div style="font-size:15px;font-weight:800;color:var(--gold)">{{ product.revenue }}</div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <div style="font-size:48px;margin-bottom:12px;opacity:0.3">📊</div>
          <div style="font-size:16px;font-weight:600;color:var(--text-muted);margin-bottom:4px">No Products Yet</div>
          <div style="font-size:13px;color:var(--text-dim)">Top selling products will be displayed here</div>
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

const { t } = useI18n()

const loading = ref(true)
const stats = ref({
  total_users: 0,
  total_merchants: 0,
  total_products: 0,
  total_revenue: 0,
  recent_orders: [],
  top_products: []
})

const statCards = computed(() => [
  { icon: '👥', value: stats.value.total_users.toLocaleString(), label: t('dashboard.admin.total_users'), growth: '+12%', color: 'gold' },
  { icon: '🏪', value: stats.value.total_merchants.toLocaleString(), label: t('dashboard.admin.total_merchants'), growth: '+5%', color: 'purple' },
  { icon: '📦', value: stats.value.total_products.toLocaleString(), label: t('dashboard.admin.total_products'), growth: '+18%', color: 'teal' },
  { icon: '💰', value: Number(stats.value.total_revenue || 0).toLocaleString(), label: t('dashboard.admin.revenue') + ' (' + t('common.sar') + ')', growth: '+24%', color: 'gold' },
])

const recentOrders = computed(() => {
  return (stats.value.recent_orders || []).map(order => ({
    id: order.order_number || order.id,
    customer: order.customer_name || order.user?.name || 'N/A',
    amount: Number(order.total || 0),
    status: order.status
  }))
})

const topProducts = computed(() => {
  return (stats.value.top_products || []).map(product => ({
    id: product.id,
    name: product.name,
    sales: product.order_items_count || 0,
    revenue: Number(product.price * (product.order_items_count || 0)).toLocaleString() + ' SAR',
    image: product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100'
  }))
})

onMounted(async () => {
  await loadStats()
})

async function loadStats() {
  loading.value = true
  try {
    const response = await axios.get('/api/dashboard/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load admin stats:', error)
  } finally {
    loading.value = false
  }
}

function getStatusBadge(status) {
  if (status === t('common.delivered')) return 'badge-green'
  if (status === t('common.shipped')) return 'badge-blue'
  if (status === t('common.processing')) return 'badge-purple'
  return 'badge-gold'
}
</script>
