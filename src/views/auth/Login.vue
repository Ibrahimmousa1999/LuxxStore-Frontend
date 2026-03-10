<template>
  <div class="auth-card">
    <Toast :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" @close="toast.show = false" />
    
    <!-- Top gold bar -->
    <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)"></div>

    <div class="text-center mb-7">
      <h2 class="auth-title">{{ t('auth.login_title') }}</h2>
      <p class="auth-subtitle">{{ t('auth.login_subtitle') }}</p>
    </div>

    <!-- Tabs -->
    <div class="auth-tabs mb-7">
      <button class="auth-tab active">{{ t('auth.login_button') }}</button>
      <router-link to="/auth/register" class="auth-tab no-underline">{{ t('auth.register_button') }}</router-link>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div class="lux-input-group">
        <label>{{ t('auth.email') }}</label>
        <input v-model="form.email" type="email" required class="lux-input" :placeholder="t('auth.email')" />
      </div>
      <div class="lux-input-group">
        <label>{{ t('auth.password') }}</label>
        <input v-model="form.password" type="password" required class="lux-input" :placeholder="'••••••••'" />
      </div>
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2 cursor-pointer" style="color:var(--text-muted)">
          <input type="checkbox" v-model="form.remember" style="accent-color:var(--gold)" />
          {{ t('auth.remember') }}
        </label>
        <a href="#" style="color:var(--gold);font-size:13px;text-decoration:none">{{ t('auth.forgot_password') }}</a>
      </div>
      <button type="submit" :disabled="loading" class="btn btn-gold w-full" style="border-radius:12px">
        {{ loading ? t('common.loading') : t('auth.login_button') }}
      </button>
    </form>

    <!-- Divider -->
    <div class="flex items-center gap-4 my-5" style="color:var(--text-dim);font-size:13px">
      <div style="flex:1;height:1px;background:var(--border-white)"></div>
      {{ t('auth.or') }}
      <div style="flex:1;height:1px;background:var(--border-white)"></div>
    </div>

    <!-- Google -->
    <button @click="handleGoogleLogin" class="google-btn w-full">
      <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
        <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
        <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
        <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
      </svg>
      {{ t('auth.google_login') }}
    </button>

    <p class="text-center mt-5" style="font-size:14px;color:var(--text-muted)">
      {{ t('auth.no_account') }}
      <router-link to="/auth/register" style="color:var(--gold);font-weight:600;text-decoration:none;margin-inline-start:4px">
        {{ t('auth.register_button') }}
      </router-link>
    </p>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Toast from '@/components/Toast.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: 'admin@gmail.com', password: '1212qwqwQ#', remember: false })
const loading = ref(false)

const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

async function handleLogin() {
  loading.value = true
  try {
    await authStore.login(form.value)
    showToast('success', 'Login Successful', `Welcome back, ${authStore.user.name}!`)
    setTimeout(() => {
      const route = authStore.isAdmin ? '/dashboard/admin' : authStore.isMerchant ? '/dashboard/merchant' : '/dashboard/user'
      router.push(route)
    }, 1000)
  } catch (err) {
    showToast('error', 'Login Failed', err.response?.data?.message || 'Invalid credentials')
  } finally {
    loading.value = false
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

function handleGoogleLogin() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/'
  window.location.href = `${apiUrl}api/auth/google/redirect`
}
</script>

<style scoped>
.auth-card {
  background: var(--surface);
  border-radius: 20px;
  padding: 36px;
  border: 1px solid var(--border-gold);
  position: relative;
  overflow: hidden;
}
.auth-title {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  color: var(--text);
  margin-bottom: 6px;
}
[dir="rtl"] .auth-title { font-family: 'Tajawal', sans-serif; }
.auth-subtitle { font-size: 14px; color: var(--text-muted); }
.auth-tabs {
  display: flex;
  background: var(--surface2);
  border-radius: 12px;
  padding: 4px;
}
.auth-tab {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all .2s;
  color: var(--text-muted);
  border: none;
  background: transparent;
  font-family: inherit;
  display: block;
}
.auth-tab.active {
  background: var(--gold);
  color: var(--obsidian);
}
.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface2);
  border: 1px solid var(--border-white);
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .2s;
}
.google-btn:hover { border-color: rgba(234,67,53,0.5); background: rgba(234,67,53,0.05); }
</style>
