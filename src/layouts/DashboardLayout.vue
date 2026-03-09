<template>
  <div class="flex min-h-screen" style="background:var(--obsidian)">

    <!-- SIDEBAR -->
    <aside class="sidebar-wrap" :class="{ 'open': sidebarOpen }">
      <!-- Logo -->
      <div style="padding:24px 20px 20px;border-bottom:1px solid var(--border-white);display:flex;align-items:center;justify-content:space-between">
        <router-link to="/" class="no-underline">
          <div :style="{ fontFamily: locale === 'ar' ? 'Tajawal, sans-serif' : 'Playfair Display, serif', fontSize: '18px', color: 'var(--gold)', fontWeight: '700' }">✦ {{ locale === 'ar' ? 'لوكس ستور' : 'LuxStore' }}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">
            {{ authStore.isAdmin ? t('dashboard.admin.title') : authStore.isMerchant ? t('dashboard.merchant.title') : t('dashboard.user.title') }}
          </div>
        </router-link>
        <!-- Close Button (Mobile Only) -->
        <button @click="sidebarOpen = false" class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all"
          style="background:rgba(201,168,76,0.1);border:1px solid var(--border-gold);color:var(--gold)">
          <span style="font-size:18px">✕</span>
        </button>
      </div>

      <!-- User Info -->
      <div style="display:flex;align-items:center;gap:12px;margin:16px;padding:14px;background:var(--surface);border-radius:12px;border:1px solid var(--border-white)">
        <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--gold-dark),var(--gold));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;color:var(--obsidian);font-weight:700">
          {{ authStore.user?.name?.charAt(0)?.toUpperCase() || '✦' }}
        </div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--text)">{{ authStore.user?.name || 'User' }}</div>
          <div style="font-size:11px;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:0.5px">
            {{ authStore.isAdmin ? 'Admin' : authStore.isMerchant ? 'Merchant' : 'Customer' }}
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav style="flex:1;padding:8px 12px;overflow-y:auto">
        <!-- Admin Links -->
        <template v-if="authStore.isAdmin">
          <div class="sidebar-section">{{ t('dashboard.admin.title') }}</div>
          <router-link v-for="link in adminLinks" :key="link.to" :to="link.to" @click="sidebarOpen = false" class="sidebar-item no-underline" :class="{ active: $route.path === link.to }">
            <span style="font-size:18px">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </router-link>
        </template>

        <!-- Merchant Links -->
        <template v-else-if="authStore.isMerchant">
          <div class="sidebar-section">{{ t('dashboard.merchant.title') }}</div>
          <router-link v-for="link in merchantLinks" :key="link.to" :to="link.to" @click="sidebarOpen = false" class="sidebar-item no-underline" :class="{ active: $route.path === link.to }">
            <span style="font-size:18px">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </router-link>
        </template>

        <!-- User Links -->
        <template v-else>
          <div class="sidebar-section">{{ t('dashboard.user.title') }}</div>
          <router-link v-for="link in userLinks" :key="link.to" :to="link.to" @click="sidebarOpen = false" class="sidebar-item no-underline" :class="{ active: $route.path === link.to }">
            <span style="font-size:18px">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </router-link>
        </template>
      </nav>

      <!-- Footer -->
      <div style="padding:16px;border-top:1px solid var(--border-white)">
        <button @click="handleLogout" class="btn btn-ghost btn-sm w-full" style="justify-content:center">
          🚪 {{ t('nav.logout') }}
        </button>
      </div>
    </aside>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="md:hidden fixed inset-0 bg-black bg-opacity-60 z-[1999]" style="backdrop-filter:blur(4px)"></div>

    <!-- MAIN -->
    <div style="flex:1;min-width:0;display:flex;flex-direction:column">
      <!-- Top Bar -->
      <div style="height:70px;display:flex;align-items:center;justify-content:space-between;padding:0 24px 0 32px;background:var(--deep);border-bottom:1px solid var(--border-gold);position:sticky;top:0;z-index:100">
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = !sidebarOpen" class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-all" 
            style="background:var(--surface);border:1px solid var(--border-gold);color:var(--gold)"
            @mouseover="(e) => e.currentTarget.style.borderColor='var(--gold)'"
            @mouseleave="(e) => e.currentTarget.style.borderColor='var(--border-gold)'">
            <span style="font-size:18px">☰</span>
          </button>
          <h2 :style="{ fontFamily: locale === 'ar' ? 'Tajawal, sans-serif' : 'Playfair Display, serif', fontSize: '20px', color: 'var(--text)', fontWeight: '700' }">{{ currentTitle }}</h2>
        </div>
        <div class="flex items-center gap-3">
          <!-- Language Toggle -->
          <button @click="toggleLanguage" 
            class="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
            style="background:var(--surface);border:1px solid var(--border-gold);color:var(--gold);font-size:14px;font-weight:700"
            :title="locale === 'ar' ? 'English' : 'العربية'"
            @mouseover="(e) => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.background='var(--surface2)' }"
            @mouseleave="(e) => { e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.background='var(--surface)' }">
            {{ locale === 'ar' ? 'EN' : 'ع' }}
          </button>
          
          <!-- Theme Toggle -->
          <button @click="toggleTheme" 
            class="flex items-center justify-center w-10 h-10 rounded-lg transition-all"
            style="background:var(--surface);border:1px solid var(--border-gold);color:var(--gold)"
            :title="theme === 'dark' ? 'Light Mode' : 'Dark Mode'"
            @mouseover="(e) => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.background='var(--surface2)' }"
            @mouseleave="(e) => { e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.background='var(--surface)' }">
            <span style="font-size:16px">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
          </button>
          
          <router-link to="/" class="btn btn-ghost btn-sm no-underline" style="border-radius:10px">🏠 {{ t('nav.home') }}</router-link>
          <div class="hidden md:block" style="font-size:13px;color:var(--text-muted)">{{ authStore.user?.email }}</div>
        </div>
      </div>

      <!-- Content -->
      <main style="flex:1;padding:32px;overflow-y:auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { theme, toggleTheme } = useTheme()
const sidebarOpen = ref(false)

// Scroll to top on route change
watch(() => route.path, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

function toggleLanguage() {
  const newLocale = locale.value === 'en' ? 'ar' : 'en'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
  document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', newLocale)
}

// Ensure theme is applied on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})

const adminLinks = computed(() => [
  { to: '/dashboard/admin', icon: '📊', label: t('dashboard.admin.overview') },
  { to: '/dashboard/admin/users', icon: '👥', label: t('dashboard.admin.users') },
  { to: '/dashboard/admin/products', icon: '📦', label: t('dashboard.admin.products') },
  { to: '/dashboard/admin/categories', icon: '📁', label: t('nav.categories') },
  { to: '/dashboard/admin/orders', icon: '🧾', label: t('dashboard.admin.orders') },
  { to: '/dashboard/admin/settings', icon: '⚙️', label: t('dashboard.admin.settings') },
  { to: '/dashboard/profile', icon: '👤', label: t('dashboard.admin.profile') },
])

const merchantLinks = computed(() => [
  { to: '/dashboard/merchant', icon: '📊', label: t('dashboard.merchant.overview') },
  { to: '/dashboard/merchant/products', icon: '📦', label: t('dashboard.merchant.my_products') },
  { to: '/dashboard/merchant/orders', icon: '🧾', label: t('dashboard.merchant.orders') },
  { to: '/dashboard/profile', icon: '👤', label: t('dashboard.admin.profile') },
])

const userLinks = computed(() => [
  { to: '/dashboard/user', icon: '🏠', label: t('dashboard.user.overview') },
  { to: '/dashboard/user/orders', icon: '📦', label: t('dashboard.user.orders') },
  { to: '/dashboard/profile', icon: '👤', label: t('dashboard.admin.profile') },
])

const currentTitle = computed(() => {
  const all = [...adminLinks.value, ...merchantLinks.value, ...userLinks.value]
  return all.find(l => l.to === route.path)?.label || 'Dashboard'
})

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.sidebar-wrap {
  width: 260px;
  min-height: 100vh;
  background: var(--deep);
  border-inline-end: 1px solid var(--border-gold);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  transition: transform 0.3s;
}
.sidebar-section {
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 2px;
  font-weight: 700;
  padding: 16px 8px 8px;
  text-transform: uppercase;
}
@media (max-width: 768px) {
  .sidebar-wrap {
    position: fixed;
    inset-inline-start: -260px;
    z-index: 2000;
  }
  .sidebar-wrap.open { inset-inline-start: 0; }
}
</style>
