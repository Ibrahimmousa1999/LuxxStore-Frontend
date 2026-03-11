<template>
  <div style="background:var(--obsidian);min-height:100vh;padding:40px clamp(16px,4vw,60px)">
    <div v-if="loading" class="text-center py-24" style="color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:16px">✦</div>
      {{ t('common.loading') }}
    </div>

    <div v-else-if="product" class="product-layout">
      <!-- Gallery -->
      <div>
        <div @click="showLightbox(0)" style="border-radius:var(--radius);overflow:hidden;border:1px solid var(--border-gold);aspect-ratio:1;margin-bottom:14px;background:var(--surface);cursor:pointer;position:relative">
          <img :src="selectedImage" :alt="product.name" style="width:100%;height:100%;object-fit:cover;transition:all .3s" />
          <div style="position:absolute;inset:0;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s" class="hover-overlay">
            <span style="font-size:48px;color:white">🔍</span>
          </div>
        </div>
        <div v-if="productImages.length > 1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
          <div v-for="(img, i) in productImages" :key="i"
            @click="selectedImage = img; selectedImageIndex = i"
            :style="selectedImage === img ? 'border:2px solid var(--gold)' : 'border:1px solid var(--border-white)'"
            style="border-radius:10px;overflow:hidden;cursor:pointer;aspect-ratio:1;background:var(--surface);transition:all .2s">
            <img :src="img" :alt="`img-${i}`" style="width:100%;height:100%;object-fit:cover" />
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      <vue-easy-lightbox
        :visible="lightboxVisible"
        :imgs="productImages"
        :index="selectedImageIndex"
        @hide="lightboxVisible = false"
      />

      <!-- Info -->
      <div>
        <!-- Category + Brand -->
        <div style="font-size:12px;color:var(--gold);font-weight:700;letter-spacing:2px;margin-bottom:6px;text-transform:uppercase">{{ product.category?.name || product.brand || 'LUXSTORE' }}</div>
        <h1 style="font-family:'Playfair Display',serif;font-size:clamp(24px,3vw,36px);color:var(--text);margin-bottom:12px">{{ product.name }}</h1>
        <div v-if="product.brand" style="font-size:13px;color:var(--text-muted);margin-bottom:16px">{{ product.brand }}</div>

        <!-- Rating & Stock -->
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:20px">
          <div v-if="product.rating" style="display:flex;gap:2px">
            <span v-for="i in 5" :key="i" style="font-size:16px;color:var(--gold)">{{ i <= product.rating ? '★' : '☆' }}</span>
          </div>
          <span v-if="product.reviews_count" style="font-size:14px;color:var(--text-muted)">({{ product.reviews_count }} {{ t('product.reviews') }})</span>
          <span :style="product.stock > 0 ? 'color:var(--success)' : 'color:var(--danger)'" style="font-size:13px;font-weight:700;background:rgba(92,184,92,0.1);padding:4px 12px;border-radius:20px">
            {{ product.stock > 0 ? `✓ ${product.stock} ${t('product.in_stock')}` : t('product.out_of_stock') }}
          </span>
          <span v-if="product.featured" class="lux-badge badge-gold" style="font-size:11px">{{ t('common.featured') }}</span>
        </div>

        <!-- Price -->
        <div style="margin-bottom:24px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
          <span style="font-size:36px;font-weight:900;color:var(--gold);font-family:'Playfair Display',serif">{{ product.price.toLocaleString() }} {{ currency }}</span>
          <span v-if="product.old_price" style="font-size:18px;color:var(--text-dim);text-decoration:line-through">{{ product.old_price.toLocaleString() }} {{ currency }}</span>
          <span v-if="product.old_price" style="background:rgba(224,92,92,0.15);color:var(--danger);padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700">
            SAVE {{ Math.round((1 - product.price / product.old_price) * 100) }}%
          </span>
        </div>

        <!-- Sizes -->
        <div v-if="product.sizes?.length" style="margin-bottom:22px">
          <div style="font-size:13px;color:var(--text-muted);font-weight:600;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">{{ t('product.size') }}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button v-for="size in product.sizes" :key="size"
              @click="selectedSize = size"
              :style="selectedSize === size ? 'border-color:var(--gold);background:rgba(201,168,76,0.1);color:var(--gold)' : 'border-color:var(--border-white);color:var(--text-muted)'"
              style="padding:8px 18px;border-radius:10px;border:1px solid;background:var(--surface);cursor:pointer;font-size:14px;font-weight:600;transition:all .2s;font-family:inherit">
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Colors -->
        <div v-if="product.colors?.length" style="margin-bottom:22px">
          <div style="font-size:13px;color:var(--text-muted);font-weight:600;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">{{ t('product.color') }}</div>
          <div style="display:flex;gap:10px">
            <button v-for="color in product.colors" :key="color.name"
              @click="selectedColor = color"
              :style="{ backgroundColor: color.value, transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)', boxShadow: selectedColor === color ? '0 0 0 3px var(--gold)' : 'none' }"
              style="width:32px;height:32px;border-radius:50%;cursor:pointer;border:2px solid rgba(255,255,255,0.15);transition:all .2s">
            </button>
          </div>
          <div v-if="selectedColor" style="font-size:13px;color:var(--text-muted);margin-top:6px">{{ selectedColor.name }}</div>
        </div>

        <!-- Quantity -->
        <div style="margin-bottom:28px">
          <div style="font-size:13px;color:var(--text-muted);font-weight:600;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">{{ t('product.quantity') }}</div>
          <div style="display:inline-flex;align-items:center;background:var(--surface2);border-radius:12px;border:1px solid var(--border-white);overflow:hidden">
            <button @click="quantity = Math.max(1, quantity - 1)"
              style="width:44px;height:44px;background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .2s">−</button>
            <span style="padding:0 20px;font-size:18px;font-weight:700;color:var(--text);min-width:60px;text-align:center">{{ quantity }}</span>
            <button @click="quantity++"
              style="width:44px;height:44px;background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .2s">+</button>
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex;gap:12px;margin-bottom:32px;flex-wrap:wrap">
          <button @click="addToCart" :disabled="product.stock === 0" class="btn btn-gold" style="flex:1;min-width:200px;border-radius:12px;padding:16px 32px;font-size:16px;font-weight:700">
            🛒 {{ t('product.add_to_cart') }}
          </button>
          <button @click="buyNow" :disabled="product.stock === 0" class="btn btn-outline" style="flex:1;min-width:200px;border-radius:12px;padding:16px 32px;font-size:16px;font-weight:700">
            ⚡ {{ t('product.buy_now') }}
          </button>
          <LikeButton :product-id="product.id" style="align-self:center" />
        </div>

        <!-- Description -->
        <div class="gold-line mb-6"></div>
        <h3 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--text);margin-bottom:12px">{{ t('product.description') }}</h3>
        <p style="font-size:15px;color:var(--text-muted);line-height:1.9">{{ product.description }}</p>

        <!-- Features -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px">
          <div v-for="feat in features" :key="feat.icon" style="display:flex;align-items:center;gap:10px;padding:14px;background:var(--surface);border-radius:12px;border:1px solid var(--border-white)">
            <span style="font-size:22px">{{ feat.icon }}</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text)">{{ feat.title }}</div>
              <div style="font-size:12px;color:var(--text-muted)">{{ feat.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { useConfig } from '@/composables/useConfig'
import VueEasyLightbox from 'vue-easy-lightbox'
import LikeButton from '@/components/LikeButton.vue'
import axios from '@/utils/axios'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const { currency } = useConfig()

const product = ref(null)
const loading = ref(true)
const selectedImage = ref('')
const selectedImageIndex = ref(0)
const selectedSize = ref(null)
const selectedColor = ref(null)
const quantity = ref(1)
const wishlist = ref(false)
const lightboxVisible = ref(false)

const productImages = computed(() => {
  if (!product.value) return []
  if (product.value.images && Array.isArray(product.value.images) && product.value.images.length > 0) {
    return product.value.images
  }
  if (product.value.image) {
    return [product.value.image]
  }
  return ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']
})

function showLightbox(index) {
  selectedImageIndex.value = index
  lightboxVisible.value = true
}

const features = computed(() => [
  { icon: '🚚', title: t('locale') === 'ar' ? 'شحن مجاني' : 'Free Shipping', desc: t('locale') === 'ar' ? 'على جميع الطلبات فوق 500 ريال' : 'On all orders over 500 SAR' },
  { icon: '↩️', title: t('locale') === 'ar' ? 'إرجاع مجاني' : 'Easy Returns', desc: t('locale') === 'ar' ? 'خلال 30 يوم' : 'Within 30 days' },
  { icon: '🔒', title: t('locale') === 'ar' ? 'دفع آمن' : 'Secure Payment', desc: t('locale') === 'ar' ? '100% دفع آمن' : '100% secure payment' },
  { icon: '✅', title: t('locale') === 'ar' ? 'ضمان الأصالة' : 'Authenticity', desc: t('locale') === 'ar' ? 'منتجات أصلية 100%' : '100% authentic products' },
])

onMounted(async () => {
  try {
    const response = await axios.get(`/products/${route.params.id}`)
    product.value = response.data
    console.log('Product data:', product.value)
    console.log('Product images:', product.value.images)
    selectedImage.value = productImages.value[0]
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
})

function addToCart() {
  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: selectedImage.value
  }, quantity.value, {
    size: selectedSize.value,
    color: selectedColor.value?.name
  })
}
</script>

<style scoped>
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}
@media (max-width: 900px) { .product-layout { grid-template-columns: 1fr; gap: 32px; } }

.hover-overlay {
  opacity: 0;
  transition: opacity 0.3s;
}
div:hover .hover-overlay {
  opacity: 1;
}
</style>
