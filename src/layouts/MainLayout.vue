<template>
  <div class="min-h-screen flex flex-col" style="background:var(--obsidian)">

    <!-- NAVBAR -->
    <header
      class="fixed top-0 inset-x-0 z-50"
      style="background:rgba(10,10,15,0.95);backdrop-filter:blur(24px);border-bottom:1px solid var(--border-gold);box-shadow:0 4px 24px rgba(0,0,0,0.4)"
    >
      <div class="max-w-[1400px] mx-auto px-6 md:px-8 h-[80px] flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 no-underline group" style="transition:all .3s">
          <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,var(--gold-dark),var(--gold));display:flex;align-items:center;justify-content:center;font-size:20px;transition:all .3s;box-shadow:0 4px 12px rgba(201,168,76,0.3)"
            @mouseover="(e) => e.currentTarget.style.transform='rotate(180deg)'"
            @mouseleave="(e) => e.currentTarget.style.transform='rotate(0deg)'">
            ✦
          </div>
          <div>
            <div style="font-family:'Playfair Display',serif;color:var(--gold);font-size:22px;font-weight:900;line-height:1;letter-spacing:-0.5px">LUXSTORE</div>
            <div style="font-size:9px;color:var(--text-dim);font-family:'Inter',sans-serif;letter-spacing:2px;text-transform:uppercase;margin-top:2px">{{ t('nav.slogan') }}</div>
          </div>
        </router-link>

        <!-- Nav Links -->
        <nav class="hidden lg:flex items-center gap-2">
          <router-link
            v-for="link in navLinks" :key="link.to" :to="link.to"
            class="nav-link"
            style="padding:10px 20px;border-radius:12px;font-size:15px;font-weight:600;transition:all .3s;text-decoration:none;position:relative"
            :style="$route.path === link.to
              ? 'color:var(--gold);background:rgba(201,168,76,0.1)'
              : 'color:var(--text-muted)'"
            @mouseover="(e) => { e.target.style.color='var(--gold)'; e.target.style.background='rgba(201,168,76,0.05)' }"
            @mouseleave="(e) => $route.path !== link.to && (e.target.style.color='var(--text-muted)', e.target.style.background='transparent')"
          >
            {{ link.label }}
            <div v-if="$route.path === link.to" style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:20px;height:2px;background:var(--gold);border-radius:2px"></div>
          </router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <button @click="showMobileMenu = true" class="lg:hidden flex items-center justify-center w-12 h-12 rounded-2xl transition-all"
          style="background:linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12));border:1.5px solid var(--border-gold);color:var(--gold);box-shadow:0 2px 8px rgba(0,0,0,0.2)">
          <span style="font-size:24px">☰</span>
        </button>

        <!-- Actions -->
        <div class="flex items-center gap-2.5">
          <!-- Theme Toggle -->
          <button @click="toggleTheme" 
            class="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl transition-all group"
            style="background:linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12));border:1.5px solid var(--border-gold);color:var(--gold);box-shadow:0 2px 8px rgba(0,0,0,0.2);backdrop-filter:blur(10px)"
            :title="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            @mouseover="(e) => { e.currentTarget.style.background='linear-gradient(135deg, var(--gold-dark), var(--gold))'; e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(201,168,76,0.4)'; e.currentTarget.style.color='var(--obsidian)' }"
            @mouseleave="(e) => { e.currentTarget.style.background='linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12))'; e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)'; e.currentTarget.style.color='var(--gold)' }">
            <span style="font-size:20px;transition:all .3s">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
          </button>

          <!-- Lang Toggle -->
          <button
            @click="toggleLocale"
            class="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-black transition-all"
            style="background:linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12));border:1.5px solid var(--border-gold);color:var(--gold);box-shadow:0 2px 8px rgba(0,0,0,0.2);backdrop-filter:blur(10px);letter-spacing:0.5px"
            @mouseover="(e) => { e.currentTarget.style.background='linear-gradient(135deg, var(--gold-dark), var(--gold))'; e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(201,168,76,0.4)'; e.currentTarget.style.color='var(--obsidian)' }"
            @mouseleave="(e) => { e.currentTarget.style.background='linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12))'; e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)'; e.currentTarget.style.color='var(--gold)' }"
          >{{ locale === 'ar' ? 'EN' : 'AR' }}</button>

          <!-- Cart -->
          <router-link to="/cart" 
            class="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all no-underline"
            style="background:linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12));border:1.5px solid var(--border-gold);color:var(--gold);box-shadow:0 2px 8px rgba(0,0,0,0.2);backdrop-filter:blur(10px)"
            @mouseover="(e) => { e.currentTarget.style.background='linear-gradient(135deg, var(--gold-dark), var(--gold))'; e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(201,168,76,0.4)'; e.currentTarget.style.color='var(--obsidian)' }"
            @mouseleave="(e) => { e.currentTarget.style.background='linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12))'; e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)'; e.currentTarget.style.color='var(--gold)' }">
            <span style="font-size:22px;transition:all .3s">🛒</span>
            <span v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -end-2 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-black"
              style="background:linear-gradient(135deg,#e05c5c,#ff6b6b);color:white;box-shadow:0 3px 12px rgba(224,92,92,0.5);border:2px solid var(--obsidian);animation:pulse 2s infinite">
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Auth buttons -->
          <template v-if="authStore.isAuthenticated">
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                style="background:linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12));border:1.5px solid var(--border-gold);color:var(--text);box-shadow:0 2px 8px rgba(0,0,0,0.2);backdrop-filter:blur(10px)"
                @mouseover="(e) => { e.currentTarget.style.background='linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.2))'; e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(201,168,76,0.3)' }"
                @mouseleave="(e) => { e.currentTarget.style.background='linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.12))'; e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)' }"
              >
                <span class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black" style="background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:var(--obsidian);box-shadow:0 3px 10px rgba(201,168,76,0.4);border:2px solid rgba(201,168,76,0.3)">
                  {{ authStore.user?.name?.charAt(0)?.toUpperCase() || '👤' }}
                </span>
                <span class="hidden lg:block" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--gold);font-weight:700">{{ authStore.user?.name }}</span>
                <span style="font-size:10px;color:var(--gold)">▼</span>
              </button>
              <!-- Dropdown -->
              <div v-if="showUserMenu"
                class="absolute end-0 mt-3 w-56 rounded-xl overflow-hidden z-50"
                style="background:var(--surface2);border:1px solid var(--border-gold);box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:slideDown 0.2s ease"
              >
                <div style="padding:12px 16px;border-bottom:1px solid var(--border-white)">
                  <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">{{ authStore.user?.name }}</div>
                  <div style="font-size:11px;color:var(--text-dim)">{{ authStore.user?.email }}</div>
                </div>
                <router-link :to="dashboardRoute" class="flex items-center gap-3 px-4 py-3 text-sm transition-all no-underline"
                  style="color:var(--text-muted)" @click="showUserMenu=false"
                  @mouseover="(e) => { e.currentTarget.style.background='var(--surface3)'; e.currentTarget.style.color='var(--gold)' }"
                  @mouseleave="(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-muted)' }"
                >
                  <span style="font-size:16px">📊</span>
                  <span>{{ t('nav.dashboard') }}</span>
                </router-link>
                <div style="height:1px;background:var(--border-white);margin:4px 0"></div>
                <button @click="handleLogout"
                  class="flex items-center gap-3 w-full px-4 py-3 text-sm text-start transition-all"
                  style="color:var(--danger);background:transparent;border:none;font-family:inherit;cursor:pointer"
                  @mouseover="(e) => { e.currentTarget.style.background='rgba(224,92,92,0.1)'; e.currentTarget.style.color='var(--danger)' }"
                  @mouseleave="(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--danger)' }"
                >
                  <span style="font-size:16px">🚪</span>
                  <span>{{ t('nav.logout') }}</span>
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/auth/login" 
              class="no-underline" 
              style="padding:12px 28px;border-radius:16px;font-size:15px;font-weight:800;background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:var(--obsidian);box-shadow:0 4px 16px rgba(201,168,76,0.4);border:1.5px solid var(--gold);transition:all .3s;letter-spacing:0.5px"
              @mouseover="(e) => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(201,168,76,0.6)'; e.currentTarget.style.background='linear-gradient(135deg,var(--gold),var(--gold-light))' }"
              @mouseleave="(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(201,168,76,0.4)'; e.currentTarget.style.background='linear-gradient(135deg,var(--gold-dark),var(--gold))' }">
              ✦ {{ t('nav.login') }}
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div v-if="showMobileMenu" class="fixed inset-0 z-[60] lg:hidden" @click.self="showMobileMenu = false"
      style="background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);animation:fadeIn 0.3s ease">
      <div class="fixed top-0 inset-inline-end-0 bottom-0 w-[85%] max-w-[320px]"
        style="background:var(--surface);border-inline-start:1px solid var(--border-gold);box-shadow:-4px 0 24px rgba(0,0,0,0.5);animation:slideInRight 0.3s ease;overflow-y:auto">
        
        <!-- Mobile Menu Header -->
        <div style="padding:24px;border-bottom:1px solid var(--border-white);display:flex;align-items:center;justify-content:space-between">
          <div style="font-family:'Playfair Display',serif;color:var(--gold);font-size:20px;font-weight:900">LUXSTORE</div>
          <button @click="showMobileMenu = false" class="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
            style="background:rgba(201,168,76,0.1);border:1px solid var(--border-gold);color:var(--gold)">
            <span style="font-size:20px">✕</span>
          </button>
        </div>

        <!-- Mobile Nav Links -->
        <nav style="padding:16px">
          <router-link
            v-for="link in navLinks" :key="link.to" :to="link.to"
            @click="showMobileMenu = false"
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 text-base font-semibold transition-all no-underline"
            :style="$route.path === link.to
              ? 'color:var(--gold);background:rgba(201,168,76,0.15);border:1px solid var(--border-gold)'
              : 'color:var(--text-muted);background:transparent;border:1px solid transparent'"
            @mouseover="(e) => $route.path !== link.to && (e.currentTarget.style.background='rgba(201,168,76,0.05)', e.currentTarget.style.color='var(--gold)')"
            @mouseleave="(e) => $route.path !== link.to && (e.currentTarget.style.background='transparent', e.currentTarget.style.color='var(--text-muted)')">
            {{ link.label }}
          </router-link>
        </nav>

        <div style="height:1px;background:var(--border-white);margin:16px"></div>

        <!-- Mobile Actions -->
        <div style="padding:16px;display:flex;flex-direction:column;gap:12px">
          <!-- Theme Toggle -->
          <button @click="toggleTheme" class="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all"
            style="background:rgba(201,168,76,0.08);border:1px solid var(--border-gold);color:var(--text)">
            <span style="font-size:15px;font-weight:600">{{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
            <span style="font-size:20px">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
          </button>

          <!-- Language Toggle -->
          <button @click="toggleLocale" class="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all"
            style="background:rgba(201,168,76,0.08);border:1px solid var(--border-gold);color:var(--text)">
            <span style="font-size:15px;font-weight:600">{{ locale === 'ar' ? 'English' : 'العربية' }}</span>
            <span style="font-size:16px;font-weight:900;color:var(--gold)">{{ locale === 'ar' ? 'EN' : 'AR' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- PAGE CONTENT -->
    <main class="flex-1 pt-[80px]">
      <router-view />
    </main>

    <!-- FOOTER -->
    <footer style="background:var(--deep);border-top:1px solid var(--border-gold);padding:60px clamp(20px,5vw,80px) 30px">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <!-- Brand -->
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:22px;color:var(--gold);margin-bottom:12px">✦ لوكس ستور</div>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8">{{ t('footer.tagline') }}</p>
          <div class="flex gap-3 mt-4">
            <a v-for="s in socials" :key="s.icon" href="#"
              class="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all no-underline"
              style="background:var(--surface);border:1px solid var(--border-white);color:var(--text-muted)"
              @mouseover="(e) => e.currentTarget.style.borderColor='var(--gold)'"
              @mouseleave="(e) => e.currentTarget.style.borderColor='var(--border-white)'"
            >{{ s.icon }}</a>
          </div>
        </div>
        <!-- Shop -->
        <div>
          <h4 class="footer-col-title">{{ t('footer.shop') }}</h4>
          <router-link to="/shop" class="footer-link">{{ t('home.new_arrivals') }}</router-link>
          <router-link to="/shop" class="footer-link">{{ t('home.featured_products') }}</router-link>
          <router-link to="/shop" class="footer-link">{{ t('footer.sale') }}</router-link>
        </div>
        <!-- Support -->
        <div>
          <h4 class="footer-col-title">{{ t('footer.support') }}</h4>
          <a href="#" class="footer-link">{{ t('footer.contact') }}</a>
          <a href="#" class="footer-link">{{ t('footer.faq') }}</a>
          <a href="#" class="footer-link">{{ t('footer.returns') }}</a>
        </div>
        <!-- Company -->
        <div>
          <h4 class="footer-col-title">{{ t('footer.company') }}</h4>
          <a href="#" class="footer-link">{{ t('footer.about') }}</a>
          <a href="#" class="footer-link">{{ t('footer.careers') }}</a>
          <a href="#" class="footer-link">{{ t('footer.press') }}</a>
        </div>
      </div>
      <div class="gold-line"></div>
      <div class="flex flex-col md:flex-row items-center justify-between pt-6 gap-3"
        style="font-size:13px;color:var(--text-dim)">
        <span>© 2026 لوكس ستور | LuxStore. {{ t('footer.rights') }}.</span>
        <div class="flex gap-4">
          <a href="#" class="footer-link-sm">Privacy Policy</a>
          <a href="#" class="footer-link-sm">Terms of Service</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useTheme } from '@/composables/useTheme'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { theme, toggleTheme } = useTheme()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const navLinks = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/shop', label: t('nav.shop') },
])

const socials = [
  { icon: '𝕏' }, { icon: '📘' }, { icon: '📸' }, { icon: '▶️' }
]

const dashboardRoute = computed(() => {
  if (authStore.isAdmin) return '/dashboard/admin'
  if (authStore.isMerchant) return '/dashboard/merchant'
  return '/dashboard/user'
})

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'ar' : 'en'
  localStorage.setItem('locale', locale.value)
  const dir = locale.value === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', locale.value)
}

function handleLogout() {
  showUserMenu.value = false
  authStore.logout()
  router.push('/')
}

// Close dropdown on outside click
function onOutsideClick(e) {
  if (!e.target.closest('.relative')) showUserMenu.value = false
}

onMounted(() => {
  const dir = locale.value === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', locale.value)
  document.addEventListener('click', onOutsideClick)
})

onUnmounted(() => document.removeEventListener('click', onOutsideClick))
</script>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* RTL support for mobile menu */
[dir="rtl"] .fixed.inset-inline-end-0 {
  animation: slideInLeft 0.3s ease;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.footer-col-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
}
.footer-link {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-decoration: none;
  transition: color .2s;
}
.footer-link:hover { color: var(--text); }
.footer-link-sm {
  font-size: 13px;
  color: var(--text-dim);
  text-decoration: none;
  transition: color .2s;
}
.footer-link-sm:hover { color: var(--text-muted); }
</style>
