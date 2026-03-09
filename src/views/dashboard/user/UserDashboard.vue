<template>
  <div>
    <!-- Welcome Banner -->
    <div class="user-welcome-banner mb-8">
      <div class="welcome-bg-gradient"></div>
      <div class="welcome-content">
        <div class="welcome-user-section">
          <div class="user-avatar-large">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() || '✦' }}
          </div>
          <div class="user-info">
            <h1 class="welcome-title">{{ authStore.user?.name || 'User' }}</h1>
            <div class="user-role">CUSTOMER</div>
            <div class="member-since">
              <span class="member-icon">👤</span>
              <span>Member since January 2025</span>
            </div>
          </div>
        </div>
        <div class="membership-badge">
          <div class="badge-icon">👑</div>
          <div class="badge-content">
            <div class="badge-title">Gold Member</div>
            <div class="badge-subtitle">Premium Access</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card" :class="stat.color">
        <div class="stat-icon" :class="stat.color">{{ stat.icon }}</div>
        <div style="font-size:28px;font-weight:900;color:var(--text);margin-bottom:4px">{{ stat.value }}</div>
        <div style="font-size:13px;color:var(--text-muted)">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="lux-card" style="padding:0;overflow:hidden">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border-white);display:flex;align-items:center;justify-content:space-between">
        <h2 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--text)">{{ t('dashboard.user.recent_orders') }}</h2>
        <router-link to="/dashboard/user/orders" style="font-size:13px;color:var(--gold);text-decoration:none">{{ t('home.view_all') }}</router-link>
      </div>
      <div v-if="recentOrders.length === 0" class="text-center py-12">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.3">🛍️</div>
        <div style="font-size:16px;font-weight:600;color:var(--text-muted);margin-bottom:4px">{{ t('dashboard.user.no_orders') }}</div>
        <div style="font-size:13px;color:var(--text-dim);margin-bottom:16px">{{ t('dashboard.user.no_orders_desc') }}</div>
        <router-link to="/shop" class="btn btn-gold btn-sm no-underline">Start Shopping</router-link>
      </div>
      <div v-else style="padding:12px 0">
        <div v-for="order in recentOrders" :key="order.id"
          style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.03);transition:background .2s;cursor:pointer"
          @mouseover="(e) => e.currentTarget.style.background='var(--surface2)'"
          @mouseleave="(e) => e.currentTarget.style.background=''"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-family:monospace;font-size:13px;color:var(--gold)">#{{ order.id }}</span>
              <span style="font-size:12px;color:var(--text-dim)">{{ order.date }}</span>
            </div>
            <span class="lux-badge" :class="getStatusBadge(order.status)">{{ order.status }}</span>
          </div>
          <div style="display:flex;align-items:center;gap:14px">
            <img :src="order.image" :alt="order.product" style="width:54px;height:54px;object-fit:cover;border-radius:10px;border:1px solid var(--border-white)" />
            <div style="flex:1">
              <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:2px">{{ order.product }}</div>
              <div style="font-size:12px;color:var(--text-muted)">{{ order.items }} {{ t('cart.items') }}</div>
            </div>
            <div style="text-align:end">
              <div style="font-size:20px;font-weight:900;color:var(--gold)">{{ order.total.toLocaleString() }}</div>
              <div style="font-size:11px;color:var(--text-dim)">{{ currency }}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-ghost btn-sm">{{ t('dashboard.user.track_order') }}</button>
            <button class="btn btn-outline btn-sm">{{ t('dashboard.user.reorder') }}</button>
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
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const { currency } = useConfig()
const authStore = useAuthStore()

const loading = ref(true)
const stats = ref({
  total_orders: 0,
  pending_orders: 0,
  completed_orders: 0,
  total_spent: 0,
  recent_orders: []
})

const statCards = computed(() => [
  { icon: '📦', value: stats.value.total_orders.toString(), label: t('dashboard.user.total_orders'), color: 'gold' },
  { icon: '💰', value: Number(stats.value.total_spent || 0).toLocaleString() + ' ' + currency, label: t('dashboard.user.total_spent'), color: 'purple' },
  { icon: '⭐', value: t('dashboard.user.gold_member'), label: t('dashboard.user.membership'), color: 'teal' },
])

const recentOrders = computed(() => {
  return (stats.value.recent_orders || []).map(order => ({
    id: order.id,
    product: order.items?.[0]?.product_name || 'N/A',
    date: new Date(order.created_at).toLocaleDateString(),
    total: Number(order.total || 0),
    status: order.status
  }))
})

onMounted(async () => {
  await loadStats()
})

async function loadStats() {
  loading.value = true
  try {
    const response = await axios.get('/api/dashboard/user/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load user stats:', error)
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

<style scoped>
.user-welcome-banner {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border-gold);
  border-radius: 20px;
  overflow: hidden;
  padding: 40px;
}

.welcome-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(124,92,191,0.05) 100%);
  pointer-events: none;
}

.welcome-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.welcome-user-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold-dark), var(--gold));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 900;
  color: var(--obsidian);
  box-shadow: 0 8px 24px rgba(201,168,76,0.3);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.welcome-title {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 900;
  color: var(--text);
  margin: 0;
  line-height: 1.2;
}

[dir="rtl"] .welcome-title {
  font-family: 'Tajawal', sans-serif;
}

.user-role {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--gold);
  text-transform: uppercase;
}

.member-since {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.member-icon {
  font-size: 14px;
}

.membership-badge {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05));
  border: 2px solid var(--border-gold);
  border-radius: 16px;
  padding: 20px 28px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.badge-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 8px rgba(201,168,76,0.4));
}

.badge-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge-title {
  font-size: 16px;
  font-weight: 900;
  color: var(--gold);
  font-family: 'Playfair Display', serif;
}

[dir="rtl"] .badge-title {
  font-family: 'Tajawal', sans-serif;
}

.badge-subtitle {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .user-welcome-banner {
    padding: 24px;
  }
  
  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .welcome-user-section {
    width: 100%;
  }
  
  .membership-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>
