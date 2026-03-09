<template>
  <div style="background:var(--obsidian);min-height:100vh;padding:40px clamp(16px,4vw,60px)">
    <!-- Header -->
    <div style="margin-bottom:40px">
      <div class="section-tag">{{ t('nav.shop') }}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:gap-4">
        <h1 class="section-title" style="margin:0">{{ t('cart.title') }}</h1>
        <div v-if="cartStore.items.length > 0" style="font-size:14px;color:var(--text-muted)">
          {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }} · {{ cartStore.subtotal.toLocaleString() }} {{ currency }}
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="cartStore.items.length === 0" class="lux-card text-center" style="padding:80px 40px;max-width:600px;margin:0 auto">
      <div style="font-size:80px;margin-bottom:24px;opacity:0.5">🛒</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:28px;color:var(--text);margin-bottom:12px">{{ t('cart.empty') }}</h2>
      <p style="color:var(--text-muted);margin-bottom:32px;font-size:15px">{{ t('cart.empty_desc') }}</p>
      <router-link to="/shop" class="btn btn-gold no-underline" style="border-radius:12px">
        ← {{ t('cart.continue_shopping') }}
      </router-link>
    </div>

    <!-- Cart with items -->
    <div v-else class="cart-layout">
      <!-- Items -->
      <div style="flex:1;min-width:0">
        <div class="lux-card" style="padding:0;overflow:hidden;margin-bottom:20px">
          <div v-for="(item, index) in cartStore.items" :key="item.cartItemId || item.id" 
            :style="index !== cartStore.items.length - 1 ? 'border-bottom:1px solid var(--border-white)' : ''"
            style="padding:24px;display:flex;gap:20px;align-items:center;transition:background .2s"
            @mouseover="(e) => e.currentTarget.style.background='var(--surface2)'"
            @mouseleave="(e) => e.currentTarget.style.background='transparent'">
            <!-- Image -->
            <div style="position:relative;flex-shrink:0">
              <img :src="item.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'"
                :alt="item.name"
                style="width:110px;height:110px;object-fit:cover;border-radius:14px;border:1px solid var(--border-gold)" />
              <button @click="cartStore.removeItem(item.cartItemId || item.id)"
                style="position:absolute;top:-8px;right:-8px;width:28px;height:28px;border-radius:50%;background:var(--danger);border:2px solid var(--obsidian);color:white;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,0.3)"
                @mouseover="(e) => e.currentTarget.style.transform='scale(1.1)'"
                @mouseleave="(e) => e.currentTarget.style.transform='scale(1)'"
                title="Remove item"
              >✕</button>
            </div>
            
            <!-- Details -->
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px">
              <div>
                <h3 style="font-size:17px;font-weight:700;color:var(--text);margin-bottom:6px">{{ item.name }}</h3>
                <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
                  <span v-if="item.options?.size" class="lux-badge badge-gold" style="font-size:11px">{{ item.options.size }}</span>
                  <span v-if="item.options?.color" class="lux-badge badge-purple" style="font-size:11px">{{ item.options.color }}</span>
                  <span style="font-size:13px;color:var(--text-dim)">SKU: #{{ item.id }}</span>
                </div>
              </div>
              
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
                <!-- Quantity Control -->
                <div style="display:flex;align-items:center;gap:12px">
                  <span style="font-size:13px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:1px">Qty:</span>
                  <div style="display:flex;align-items:center;gap:0;background:var(--surface3);border-radius:12px;border:1px solid var(--border-gold);overflow:hidden">
                    <button @click="cartStore.updateQuantity(item.cartItemId || item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      style="width:40px;height:40px;background:transparent;border:none;color:var(--gold);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .2s;font-weight:700"
                      :style="item.quantity <= 1 ? 'opacity:0.3;cursor:not-allowed' : ''"
                      @mouseover="(e) => item.quantity > 1 && (e.currentTarget.style.background='rgba(201,168,76,0.1)')"
                      @mouseleave="(e) => e.currentTarget.style.background='transparent'"
                    >−</button>
                    <span style="padding:0 16px;font-size:16px;font-weight:700;color:var(--text);min-width:50px;text-align:center">{{ item.quantity }}</span>
                    <button @click="cartStore.updateQuantity(item.cartItemId || item.id, item.quantity + 1)"
                      style="width:40px;height:40px;background:transparent;border:none;color:var(--gold);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .2s;font-weight:700"
                      @mouseover="(e) => e.currentTarget.style.background='rgba(201,168,76,0.1)'"
                      @mouseleave="(e) => e.currentTarget.style.background='transparent'"
                    >+</button>
                  </div>
                </div>
                
                <!-- Price -->
                <div style="text-align:right">
                  <div style="font-size:12px;color:var(--text-dim);margin-bottom:2px">{{ item.price.toLocaleString() }} × {{ item.quantity }}</div>
                  <div style="font-size:22px;font-weight:900;color:var(--gold);font-family:'Playfair Display',serif">{{ (item.price * item.quantity).toLocaleString() }} <span style="font-size:14px;font-weight:600">{{ currency }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between">
          <router-link to="/shop" class="btn btn-ghost no-underline" style="border-radius:12px">
            ← {{ t('cart.continue_shopping') }}
          </router-link>
          <button @click="clearCart" class="btn btn-outline" style="border-radius:12px;color:var(--danger);border-color:var(--danger)">
            🗑 Clear Cart
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div style="width:380px;flex-shrink:0">
        <div class="lux-card" style="position:sticky;top:90px;background:linear-gradient(135deg, var(--surface), var(--surface2));border:1px solid var(--border-gold)">
          <div style="text-align:center;margin-bottom:24px">
            <div style="font-size:12px;color:var(--gold);font-weight:700;letter-spacing:2px;margin-bottom:8px;text-transform:uppercase">Order</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:24px;color:var(--text);margin:0">{{ t('cart.summary') }}</h2>
          </div>
          
          <!-- Coupon -->
          <div style="margin-bottom:24px">
            <label style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;display:block">Promo Code</label>
            <div style="display:flex;gap:8px">
              <input v-model="coupon" type="text" :placeholder="t('cart.coupon')" class="lux-input" style="border-radius:10px;flex:1" />
              <button @click="applyCoupon" class="btn btn-gold btn-sm" style="flex-shrink:0;border-radius:10px;padding:0 20px">{{ t('cart.apply') }}</button>
            </div>
            <div v-if="couponApplied" style="margin-top:8px;font-size:12px;color:var(--success);display:flex;align-items:center;gap:6px">
              ✓ Coupon applied: <strong>{{ coupon }}</strong>
            </div>
          </div>
          
          <!-- Totals -->
          <div style="margin-bottom:20px">
            <div class="summary-row">
              <span style="color:var(--text-muted);font-size:14px">{{ t('cart.subtotal') }}</span>
              <span style="font-weight:600;color:var(--text)">{{ cartStore.subtotal.toLocaleString() }} {{ currency }}</span>
            </div>
            <div class="summary-row">
              <span style="color:var(--text-muted);font-size:14px;display:flex;align-items:center;gap:6px">
                {{ t('cart.shipping') }}
                <span v-if="cartStore.shipping === 0" style="font-size:10px;background:var(--success);color:white;padding:2px 6px;border-radius:4px;font-weight:700">FREE</span>
              </span>
              <span :style="cartStore.shipping === 0 ? 'color:var(--success);font-weight:700' : 'color:var(--text)'">{{ cartStore.shipping === 0 ? t('cart.free_shipping') : cartStore.shipping + ' ' + currency }}</span>
            </div>
            <div class="summary-row">
              <span style="color:var(--text-muted);font-size:14px">{{ t('cart.tax') }} (15%)</span>
              <span style="color:var(--text)">{{ (cartStore.subtotal * 0.15).toFixed(2) }} {{ currency }}</span>
            </div>
            <div v-if="couponApplied" class="summary-row">
              <span style="color:var(--success);font-size:14px">Discount</span>
              <span style="color:var(--success);font-weight:700">-{{ discount.toFixed(2) }} {{ currency }}</span>
            </div>
          </div>
          
          <div class="gold-line" style="margin:20px 0"></div>
          
          <div class="summary-row" style="margin-bottom:24px;padding:16px;background:rgba(201,168,76,0.05);border-radius:12px;border:1px solid var(--border-gold)">
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">Total Amount</div>
              <div style="font-size:18px;font-weight:700;color:var(--text)">{{ t('cart.total') }}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:28px;font-weight:900;color:var(--gold);font-family:'Playfair Display',serif;line-height:1">{{ finalTotal.toFixed(2) }}</div>
              <div style="font-size:13px;color:var(--text-muted);margin-top:2px">{{ currency }}</div>
            </div>
          </div>
          
          <router-link to="/checkout" class="btn btn-gold w-full no-underline" style="justify-content:center;border-radius:12px;font-size:16px;padding:14px">
            {{ t('cart.checkout') }} →
          </router-link>
          
          <!-- Trust Badges -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px">
            <div style="text-align:center;padding:12px;background:var(--surface3);border-radius:10px">
              <div style="font-size:20px;margin-bottom:4px">🔒</div>
              <div style="font-size:11px;color:var(--text-muted)">Secure Payment</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--surface3);border-radius:10px">
              <div style="font-size:20px;margin-bottom:4px">🚚</div>
              <div style="font-size:11px;color:var(--text-muted)">Fast Delivery</div>
            </div>
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
import { useConfig } from '@/composables/useConfig'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const { currency } = useConfig()
const { success, error, confirm } = useToast()
const coupon = ref('')
const couponApplied = ref(false)
const discount = ref(0)

const finalTotal = computed(() => {
  const tax = cartStore.subtotal * 0.15
  const total = cartStore.total + tax - discount.value
  return total > 0 ? total : 0
})

function applyCoupon() {
  if (coupon.value.trim()) {
    // Simple coupon logic - 10% discount for demo
    if (coupon.value.toUpperCase() === 'SAVE10') {
      discount.value = cartStore.subtotal * 0.1
      couponApplied.value = true
      success('Coupon Applied!', `You saved ${discount.value.toFixed(2)} SAR`)
    } else {
      error('Invalid Coupon', 'Please check your coupon code and try again')
    }
  }
}

async function clearCart() {
  const confirmed = await confirm('Clear Cart?', 'Are you sure you want to remove all items from your cart?')
  if (confirmed) {
    cartStore.items.forEach(item => {
      cartStore.removeItem(item.id)
    })
    success('Cart Cleared', 'All items have been removed from your cart')
  }
}
</script>

<style scoped>
.cart-layout {
  display: flex;
  gap: 32px;
  align-items: start;
}
@media (max-width: 1024px) {
  .cart-layout {
    flex-direction: column;
  }
  .cart-layout > div:last-child {
    width: 100% !important;
  }
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  color: var(--text);
}
</style>
