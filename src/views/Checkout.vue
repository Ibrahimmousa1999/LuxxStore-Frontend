<template>
  <div style="background:var(--obsidian);min-height:100vh;padding:40px clamp(16px,4vw,60px)">
    <div class="section-tag">{{ t('nav.shop') }}</div>
    <h1 class="section-title mb-8">{{ t('checkout.title') }}</h1>

    <!-- Steps -->
    <div class="checkout-steps mb-10">
      <div v-for="(step, i) in steps" :key="i" class="checkout-step" :class="{ active: currentStep === i, done: currentStep > i }">
        <div class="step-circle">{{ currentStep > i ? '✓' : i + 1 }}</div>
        <span>{{ step }}</span>
      </div>
    </div>

    <div class="checkout-layout">
      <!-- Form -->
      <div style="flex:1;min-width:0">
        <!-- Step 0: Shipping -->
        <div v-if="currentStep === 0" class="lux-card mb-6">
          <h2 class="form-section-title">📦 {{ t('checkout.shipping_info') }}</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="lux-input-group">
              <label>{{ t('auth.name') }}</label>
              <input v-model="form.name" type="text" required class="lux-input" :placeholder="t('auth.name')" />
            </div>
            <div class="lux-input-group">
              <label>{{ t('auth.phone') }}</label>
              <input v-model="form.phone" type="tel" required class="lux-input" placeholder="+966 5x xxx xxxx" />
            </div>
          </div>
          <div class="lux-input-group">
            <label>{{ t('auth.email') }}</label>
            <input v-model="form.email" type="email" required class="lux-input" :placeholder="t('auth.email')" />
          </div>
          <div class="lux-input-group">
            <label>{{ t('checkout.address') }}</label>
            <input v-model="form.address" type="text" required class="lux-input" :placeholder="t('checkout.address')" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="lux-input-group">
              <label>{{ t('checkout.city') }}</label>
              <input v-model="form.city" type="text" class="lux-input" :placeholder="t('checkout.city')" />
            </div>
            <div class="lux-input-group">
              <label>{{ t('checkout.state') }}</label>
              <input v-model="form.state" type="text" class="lux-input" :placeholder="t('checkout.state')" />
            </div>
            <div class="lux-input-group">
              <label>{{ t('checkout.zip') }}</label>
              <input v-model="form.zip" type="text" class="lux-input" :placeholder="t('checkout.zip')" />
            </div>
          </div>
          <button @click="currentStep = 1" class="btn btn-gold" style="border-radius:12px">{{ t('common.confirm') }} →</button>
        </div>

        <!-- Step 1: Payment -->
        <div v-if="currentStep === 1" class="lux-card mb-6">
          <h2 class="form-section-title">💳 {{ t('checkout.payment') }}</h2>
          <div class="space-y-3">
            <label v-for="method in paymentMethods" :key="method.value"
              class="payment-opt" :class="{ active: paymentMethod === method.value }">
              <input type="radio" :value="method.value" v-model="paymentMethod" style="accent-color:var(--gold)" />
              <span style="font-size:22px">{{ method.icon }}</span>
              <div>
                <div style="font-size:15px;font-weight:600;color:var(--text)">{{ method.label }}</div>
                <div style="font-size:12px;color:var(--text-muted)">{{ method.desc }}</div>
              </div>
            </label>
          </div>
          <div class="flex gap-3 mt-6">
            <button @click="currentStep = 0" class="btn btn-ghost">← {{ t('common.cancel') }}</button>
            <button @click="currentStep = 2" class="btn btn-gold" style="border-radius:12px">{{ t('common.confirm') }} →</button>
          </div>
        </div>

        <!-- Step 2: Confirm -->
        <div v-if="currentStep === 2" class="lux-card">
          <h2 class="form-section-title">✅ {{ t('checkout.step_confirm') }}</h2>
          <div style="background:var(--surface2);border-radius:12px;padding:16px;margin-bottom:16px">
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">{{ t('checkout.shipping_info') }}</div>
            <div style="color:var(--text)">{{ form.name }} · {{ form.phone }}</div>
            <div style="color:var(--text-muted);font-size:14px">{{ form.address }}, {{ form.city }}</div>
          </div>
          <div style="background:var(--surface2);border-radius:12px;padding:16px;margin-bottom:20px">
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">{{ t('checkout.payment') }}</div>
            <div style="color:var(--text)">{{ paymentMethods.find(m => m.value === paymentMethod)?.label }}</div>
          </div>
          <div class="flex gap-3">
            <button @click="currentStep = 1" class="btn btn-ghost">← {{ t('common.cancel') }}</button>
            <button @click="placeOrder" :disabled="loading" class="btn btn-gold" style="border-radius:12px;flex:1;justify-content:center">
              {{ loading ? t('common.loading') : t('checkout.place_order') }}
            </button>
          </div>
          <div v-if="orderSuccess" class="mt-4 p-4 rounded-xl text-center" style="background:rgba(92,184,92,0.1);border:1px solid rgba(92,184,92,0.3);color:var(--success);font-size:16px">
            {{ t('checkout.order_success') }}
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div style="width:320px;flex-shrink:0">
        <div class="lux-card" style="position:sticky;top:90px">
          <h2 style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:16px">{{ t('cart.summary') }}</h2>
          <div v-for="item in cartStore.items" :key="item.id" style="display:flex;gap:12px;margin-bottom:12px;align-items:center">
            <img :src="item.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100'"
              :alt="item.name" style="width:50px;height:50px;object-fit:cover;border-radius:8px" />
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:var(--text)">{{ item.name }}</div>
              <div style="font-size:12px;color:var(--text-muted)">{{ item.quantity }}x {{ item.price.toLocaleString() }} {{ currency }}</div>
            </div>
          </div>
          <div class="gold-line my-4"></div>
          <div class="summary-row"><span style="color:var(--text-muted)">{{ t('cart.subtotal') }}</span><span>{{ cartStore.subtotal.toLocaleString() }}</span></div>
          <div class="summary-row"><span style="color:var(--text-muted)">{{ t('cart.shipping') }}</span><span style="color:var(--success)">{{ t('cart.free_shipping') }}</span></div>
          <div class="summary-row"><span style="color:var(--text-muted)">{{ t('cart.tax') }}</span><span>{{ (cartStore.subtotal * 0.15).toFixed(0) }}</span></div>
          <div class="gold-line my-3"></div>
          <div class="summary-row">
            <span style="font-weight:700;color:var(--text)">{{ t('cart.total') }}</span>
            <span style="font-size:20px;font-weight:900;color:var(--gold)">{{ (cartStore.total + cartStore.subtotal * 0.15).toFixed(0) }} {{ currency }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useConfig } from '@/composables/useConfig'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { currency } = useConfig()
const { error } = useToast()

const currentStep = ref(0)
const orderSuccess = ref(false)
const loading = ref(false)

const steps = computed(() => [t('checkout.step_info'), t('checkout.step_payment'), t('checkout.step_confirm')])

const paymentMethods = computed(() => [
  { value: 'card', icon: '💳', label: t('checkout.credit_card'), desc: 'Visa, MasterCard, Amex' },
  { value: 'paypal', icon: '🅿️', label: t('checkout.paypal'), desc: 'Pay via PayPal account' },
  { value: 'cod', icon: '💵', label: t('checkout.cod'), desc: t('checkout.cod') },
])

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  address: '', city: '', state: '', zip: ''
})

const paymentMethod = ref('card')

async function placeOrder() {
  loading.value = true
  try {
    const orderData = {
      payment_method: paymentMethod.value,
      customer_name: form.value.name,
      customer_email: form.value.email,
      customer_phone: form.value.phone,
      shipping_address: form.value.address,
      city: form.value.city,
      state: form.value.state,
      zip: form.value.zip,
      notes: ''
    }
    
    await cartStore.checkout(orderData)
    orderSuccess.value = true
    
    // Redirect to appropriate orders page based on role
    const ordersRoute = authStore.isAdmin ? '/dashboard/admin/orders' 
                      : authStore.isMerchant ? '/dashboard/merchant/orders'
                      : '/dashboard/user/orders'
    
    setTimeout(() => router.push(ordersRoute), 2000)
  } catch (e) {
    console.error('Order failed:', e)
    error('Order Failed', e.response?.data?.message || t('checkout.order_failed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-layout { display: flex; gap: 32px; align-items: flex-start; }
@media (max-width: 900px) { .checkout-layout { flex-direction: column; } .checkout-layout > div:last-child { width: 100% !important; } }
.checkout-steps { display: flex; gap: 0; align-items: center; }
.checkout-step { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-dim); position: relative; flex: 1; }
.checkout-step:not(:last-child)::after { content: ''; flex: 1; height: 1px; background: var(--border-white); margin: 0 12px; }
.checkout-step.active { color: var(--gold); }
.checkout-step.done { color: var(--success); }
.step-circle { width: 30px; height: 30px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border-white); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.checkout-step.active .step-circle { background: var(--gold); color: var(--obsidian); border-color: var(--gold); }
.checkout-step.done .step-circle { background: rgba(92,184,92,0.2); color: var(--success); border-color: var(--success); }
.form-section-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text); margin-bottom: 20px; }
[dir="rtl"] .form-section-title { font-family: 'Tajawal', sans-serif; }
.payment-opt { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 12px; border: 1px solid var(--border-white); cursor: pointer; transition: all .2s; margin-bottom: 8px; }
.payment-opt.active { border-color: var(--gold); background: rgba(201,168,76,0.05); }
.payment-opt:hover { border-color: rgba(201,168,76,0.4); }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text); margin-bottom: 8px; }
</style>
