<template>
  <div>
    <div class="section-tag">{{ t('common.welcome_back') }}</div>
    <h1 class="section-title mb-8">{{ t('dashboard.merchant.title') }}</h1>

    <!-- Loading State -->
    <div v-if="loading" class="lux-card text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
    </div>

    <div v-else>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card" :class="stat.color">
        <div class="stat-icon" :class="stat.color">{{ stat.icon }}</div>
        <div style="font-size:28px;font-weight:900;color:var(--text);margin-bottom:4px">{{ stat.value }}</div>
        <div style="font-size:13px;color:var(--text-muted)">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Earnings Card -->
    <div class="lux-card mb-6" style="background:linear-gradient(135deg,rgba(201,168,76,0.05),rgba(201,168,76,0.12));border:2px solid var(--border-gold);box-shadow:0 8px 32px rgba(201,168,76,0.15);position:relative;overflow:hidden">
      <!-- Decorative Background -->
      <div style="position:absolute;top:-50px;right:-50px;width:200px;height:200px;background:radial-gradient(circle,rgba(201,168,76,0.15),transparent);border-radius:50%;pointer-events:none"></div>
      <div style="position:absolute;bottom:-30px;left:-30px;width:150px;height:150px;background:radial-gradient(circle,rgba(201,168,76,0.1),transparent);border-radius:50%;pointer-events:none"></div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <!-- Available Balance -->
        <div style="padding:24px;border-radius:16px;background:linear-gradient(135deg,var(--surface2),var(--surface3));border:1px solid var(--border-gold);position:relative;overflow:hidden">
          <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:radial-gradient(circle,rgba(201,168,76,0.2),transparent);border-radius:50%"></div>
          <div style="font-size:11px;color:var(--gold);margin-bottom:8px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;display:flex;align-items:center;gap:6px">
            <span style="font-size:16px">💰</span>
            {{ t('dashboard.merchant.available_balance') }}
          </div>
          <div style="font-size:36px;font-weight:900;color:var(--gold);font-family:'Playfair Display',serif;line-height:1;margin-bottom:4px">{{ Number(stats.available_balance || 0).toLocaleString() }}</div>
          <div style="font-size:13px;color:var(--text-muted);font-weight:600">{{ currency }}</div>
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-white);font-size:11px;color:var(--success);display:flex;align-items:center;gap:4px" v-if="stats.balance_growth">
            <span>↑ {{ stats.balance_growth }}%</span>
            <span style="color:var(--text-dim)">vs last month</span>
          </div>
        </div>
        
        <!-- Pending -->
        <div style="padding:24px;border-radius:16px;background:var(--surface2);border:1px solid var(--border-white)">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;display:flex;align-items:center;gap:6px">
            <span style="font-size:16px">⏳</span>
            {{ t('dashboard.merchant.pending') }}
          </div>
          <div style="font-size:32px;font-weight:900;color:var(--text);font-family:'Playfair Display',serif;line-height:1;margin-bottom:4px">{{ Number(stats.pending_revenue || 0).toLocaleString() }}</div>
          <div style="font-size:13px;color:var(--text-muted);font-weight:600">{{ currency }}</div>
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-white);font-size:11px;color:var(--text-dim)">
            {{ t('dashboard.admin.processing_orders', { count: stats.pending_orders || 0 }) }}
          </div>
        </div>
        
        <!-- Profit Margin -->
        <div style="padding:24px;border-radius:16px;background:var(--surface2);border:1px solid var(--border-white)">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;display:flex;align-items:center;gap:6px">
            <span style="font-size:16px">📈</span>
            {{ t('dashboard.merchant.profit_margin') }}
          </div>
          <div style="font-size:32px;font-weight:900;color:var(--success);font-family:'Playfair Display',serif;line-height:1;margin-bottom:4px">{{ stats.profit_margin || 0 }}%</div>
          <div style="font-size:13px;color:var(--text-muted);font-weight:600">{{ t('dashboard.admin.average_margin') }}</div>
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-white);font-size:11px;color:var(--success);display:flex;align-items:center;gap:4px" v-if="stats.margin_improvement">
            <span>↑ {{ stats.margin_improvement }}%</span>
            <span style="color:var(--text-dim)">improvement</span>
          </div>
        </div>
      </div>
      
      <div class="gold-line my-6"></div>
      
      <div class="flex items-center justify-between flex-wrap gap-4 relative z-10">
        <div>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px">Total Withdrawn</div>
          <div style="font-size:20px;font-weight:800;color:var(--text)">{{ Number(stats.total_withdrawn || 0).toLocaleString() }} {{ VITE_CURRENCY }}</div>
        </div>
        <button class="btn btn-gold" style="padding:12px 32px;border-radius:14px;font-size:15px;font-weight:700;box-shadow:0 4px 16px rgba(201,168,76,0.3);display:flex;align-items:center;gap:8px"
          @mouseover="(e) => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(201,168,76,0.5)' }"
          @mouseleave="(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(201,168,76,0.3)' }">
          <span style="font-size:18px">💸</span>
          {{ t('dashboard.merchant.withdraw') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="lux-card" style="padding:0;overflow:hidden">
        <div style="padding:20px 24px;border-bottom:1px solid var(--border-white)">
          <h2 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--text)">{{ t('dashboard.merchant.recent_orders') }}</h2>
        </div>
        <div style="padding:8px 0" v-if="recentOrders.length > 0">
          <div v-for="order in recentOrders" :key="order.id"
            style="display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.03);transition:background .2s"
            @mouseover="(e) => e.currentTarget.style.background='var(--surface2)'"
            @mouseleave="(e) => e.currentTarget.style.background=''"
          >
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px">{{ order.product }}</div>
              <div style="font-size:12px;color:var(--text-muted)">{{ order.customer }}</div>
            </div>
            <div style="text-align:end">
              <div style="font-size:15px;font-weight:800;color:var(--gold);margin-bottom:4px">{{ order.total.toLocaleString() }} {{ currency }}</div>
              <span class="lux-badge" :class="getStatusBadge(order.status)">{{ order.status }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <div style="font-size:48px;margin-bottom:12px;opacity:0.3">📦</div>
          <div style="font-size:16px;font-weight:600;color:var(--text-muted);margin-bottom:4px">No Orders Yet</div>
          <div style="font-size:13px;color:var(--text-dim)">Your orders will appear here once customers purchase your products</div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="lux-card" style="padding:0;overflow:hidden">
        <div style="padding:20px 24px;border-bottom:1px solid var(--border-white)">
          <h2 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--text)">{{ t('dashboard.merchant.top_products') }}</h2>
        </div>
        <div style="padding:16px 24px" v-if="topProducts.length > 0">
          <div v-for="(product, i) in topProducts" :key="product.id"
            style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border-white)"
            :style="i === topProducts.length - 1 ? 'border-bottom:none' : ''"
          >
            <img :src="product.image" :alt="product.name" style="width:46px;height:46px;object-fit:cover;border-radius:10px;border:1px solid var(--border-white)" />
            <div style="flex:1">
              <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px">{{ product.name }}</div>
              <div style="font-size:12px;color:var(--text-muted)">{{ product.sales }} {{ t('common.orders') || 'orders' }}</div>
            </div>
            <div style="font-size:15px;font-weight:800;color:var(--gold)">{{ product.revenue }} {{ currency }}</div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <div style="font-size:48px;margin-bottom:12px;opacity:0.3">📊</div>
          <div style="font-size:16px;font-weight:600;color:var(--text-muted);margin-bottom:4px">{{ t('dashboard.admin.no_products') }}</div>
          <div style="font-size:13px;color:var(--text-dim)">{{ t('dashboard.admin.add_products_top_sellers') }}</div>
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

const { t } = useI18n()
const { currency } = useConfig()

const loading = ref(true)
const stats = ref({
  total_products: 0,
  active_products: 0,
  total_orders: 0,
  total_revenue: 0,
  available_balance: 0,
  pending_revenue: 0,
  pending_orders: 0,
  profit_margin: 0,
  balance_growth: 0,
  margin_improvement: 0,
  total_withdrawn: 0,
  recent_orders: [],
  low_stock_products: []
})

const statCards = computed(() => [
  { icon: '📦', value: stats.value.total_products.toString(), label: t('dashboard.merchant.my_products'), color: 'teal' },
  { icon: '🧾', value: stats.value.total_orders.toString(), label: t('dashboard.merchant.orders'), color: 'purple' },
  { icon: '💰', value: Number(stats.value.total_revenue || 0).toLocaleString() + ' ' + currency, label: t('dashboard.merchant.earnings'), color: 'gold' },
])

const recentOrders = computed(() => {
  return (stats.value.recent_orders || []).map(order => ({
    id: order.id,
    product: order.items?.[0]?.product_name || 'N/A',
    customer: order.customer_name || order.user?.name || 'N/A',
    total: Number(order.total || 0),
    status: order.status
  }))
})

const topProducts = computed(() => {
  return (stats.value.low_stock_products || []).map(product => ({
    id: product.id,
    name: product.name,
    sales: product.sales || 0,
    revenue: Number(product.price * (product.sales || 0)).toLocaleString(),
    image: product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100'
  }))
})

onMounted(async () => {
  await loadStats()
})

async function loadStats() {
  loading.value = true
  try {
    const response = await axios.get('/dashboard/merchant/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load merchant stats:', error)
  } finally {
    loading.value = false
  }
}

function getStatusBadge(status) {
  if (status === t('common.shipped')) return 'badge-blue'
  if (status === t('common.processing')) return 'badge-purple'
  if (status === t('common.delivered')) return 'badge-green'
  return 'badge-gold'
}
</script>
