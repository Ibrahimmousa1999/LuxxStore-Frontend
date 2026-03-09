<template>
  <div style="background:var(--obsidian)">

    <!-- ═══ HERO ═══ -->
    <section class="hero-centered-section">
      <div class="hero-centered-bg"></div>
      <div class="hero-glow-orb" style="top:15%;left:10%"></div>
      <div class="hero-glow-orb" style="bottom:20%;right:15%;animation-delay:2s"></div>
      
      <div class="hero-centered-content">
        <div class="hero-tag-modern">
          <span class="hero-tag-icon">✦</span>
          <span>{{ t('home.hero_tag') }}</span>
        </div>
        
        <h1 class="hero-centered-title">
          {{ t('home.hero_title_1') }}
          <span class="hero-centered-accent">{{ t('home.hero_title_2') }}</span>
          {{ t('home.hero_title_3') }}
        </h1>
        
        <p class="hero-centered-subtitle">{{ t('home.hero_subtitle') }}</p>
        
        <!-- CTA Buttons -->
        <div class="hero-centered-cta">
          <router-link to="/shop" class="btn-hero-primary">
            <span class="btn-hero-icon">🛍️</span>
            <span>{{ t('home.shop_now') }}</span>
            <span class="btn-hero-arrow">→</span>
          </router-link>
          <router-link to="/shop" class="btn-hero-secondary">
            <span>{{ t('home.browse_categories') }}</span>
          </router-link>
        </div>
        
        <!-- Stats Grid -->
        <div class="hero-stats-grid">
          <div class="hero-stat-card">
            <div class="stat-card-num">12K+</div>
            <div class="stat-card-label">{{ t('home.stat_products') }}</div>
          </div>
          <div class="hero-stat-card">
            <div class="stat-card-num">98%</div>
            <div class="stat-card-label">{{ t('home.stat_satisfaction') }}</div>
          </div>
          <div class="hero-stat-card">
            <div class="stat-card-num">500+</div>
            <div class="stat-card-label">{{ t('home.stat_brands') }}</div>
          </div>
        </div>
        
        <!-- Trust Badges -->
        <div class="hero-trust-badges-centered">
          <div class="trust-badge">
            <div class="trust-icon">✓</div>
            <div class="trust-text">
              <div class="trust-title">Free Shipping</div>
              <div class="trust-desc">On orders over 500 SAR</div>
            </div>
          </div>
          <div class="trust-badge">
            <div class="trust-icon">⚡</div>
            <div class="trust-text">
              <div class="trust-title">Fast Delivery</div>
              <div class="trust-desc">2-3 business days</div>
            </div>
          </div>
          <div class="trust-badge">
            <div class="trust-icon">🔒</div>
            <div class="trust-text">
              <div class="trust-title">Secure Payment</div>
              <div class="trust-desc">100% protected</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CATEGORIES ═══ -->
    <section class="lux-section">
      <div class="text-center mb-16">
        <div class="section-tag" style="font-size:13px;letter-spacing:2px">
          <span style="margin-right:8px">✨</span>
          {{ t('home.categories_tag') }}
        </div>
        <h2 class="section-title" style="font-size:clamp(32px,5vw,48px);margin-bottom:16px">{{ t('home.categories_title') }}</h2>
        <p style="font-size:17px;color:var(--text-muted);max-width:600px;margin:0 auto;line-height:1.6">{{ t('home.categories_desc') }}</p>
      </div>
      <div class="categories-grid">
        <div v-for="cat in categories" :key="cat.id"
          class="cat-card-enhanced"
          @click="$router.push({ path: '/shop', query: { category: cat.id } })"
        >
          <div class="cat-bg-enhanced" :style="{ background: cat.gradient }">
            <span style="font-size:64px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3))">{{ cat.emoji }}</span>
          </div>
          <div style="padding:20px">
            <h3 style="font-size:18px;font-weight:800;margin-bottom:6px;color:var(--text);font-family:'Playfair Display',serif">{{ locale === 'ar' ? (cat.name_ar || cat.name) : (cat.name_en || cat.name) }}</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:12px">{{ cat.count }}</p>
            <div style="display:inline-flex;align-items:center;gap:6px;color:var(--gold);font-size:13px;font-weight:600">
              <span>Explore</span>
              <span style="transition:transform 0.3s" class="cat-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="gold-line mx-10 md:mx-20"></div>

    <!-- ═══ FEATURED PRODUCTS ═══ -->
    <section class="lux-section">
      <div class="text-center mb-14">
        <div class="section-tag">{{ t('home.editors_pick') }}</div>
        <h2 class="section-title">
          <span class="accent">{{ t('home.featured_products') }}</span>
        </h2>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
        <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="featuredProducts.length === 0" class="lux-card text-center py-16">
        <div style="font-size:64px;margin-bottom:16px;opacity:0.3">📦</div>
        <div style="font-size:18px;font-weight:700;color:var(--text-muted);margin-bottom:6px">No Featured Products</div>
        <div style="font-size:14px;color:var(--text-dim)">Featured products will appear here soon</div>
      </div>
      
      <div v-else class="products-grid">
        <div v-for="product in featuredProducts" :key="product.id"
          class="product-card"
          @click="$router.push(`/product/${product.id}`)"
        >
          <!-- Image area -->
          <div style="aspect-ratio:1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;inset:0;transition:transform .6s;background:linear-gradient(135deg,#1a2a3a,#2a3a5a)"></div>
            <img v-if="getProductImage(product)" :src="getProductImage(product)" :alt="product.name"
              style="position:relative;z-index:1;width:100%;height:100%;object-fit:cover;transition:transform .6s"
              class="product-img-hover"
            />
            <span v-else style="position:relative;z-index:1;font-size:64px">📦</span>
            <div v-if="product.featured"
              style="position:absolute;top:12px;inset-inline-end:12px;background:var(--gold);color:var(--obsidian);font-size:10px;font-weight:800;padding:3px 10px;border-radius:50px;z-index:2;letter-spacing:1px">
              FEATURED
            </div>
            <button
              @click.stop="toggleWishlist(product)"
              style="position:absolute;top:12px;inset-inline-start:12px;width:34px;height:34px;border-radius:50%;background:rgba(10,10,15,0.7);display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;opacity:0;transition:opacity .3s;z-index:2"
              class="wish-btn"
            >{{ wishlist.includes(product.id) ? '❤️' : '🤍' }}</button>
          </div>
          <!-- Info -->
          <div style="padding:16px">
            <div style="font-size:11px;color:var(--gold);font-weight:700;letter-spacing:1px;margin-bottom:4px">{{ product.brand || product.category?.name || 'LUXURY' }}</div>
            <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:10px">{{ locale === 'ar' ? (product.name_ar || product.name) : (product.name_en || product.name) }}</div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div style="display:flex;gap:4px">
                <span v-if="product.old_price" style="font-size:12px;color:var(--text-dim);text-decoration:line-through;white-space:nowrap">{{ Number(product.old_price).toLocaleString() }} {{ currency }}</span>
                <span style="font-size:18px;font-weight:900;color:var(--gold);white-space:nowrap">{{ Number(product.price).toLocaleString() }} {{ currency }}</span>
              </div>
              <button @click.stop="addToCart(product)"
                style="width:36px;height:36px;border-radius:10px;background:var(--surface2);border:1px solid var(--border-white);color:var(--gold);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s"
                @mouseover="(e) => { e.currentTarget.style.background='var(--gold)'; e.currentTarget.style.color='var(--obsidian)'; }"
                @mouseleave="(e) => { e.currentTarget.style.background='var(--surface2)'; e.currentTarget.style.color='var(--gold)'; }"
              >+</button>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-10">
        <router-link to="/shop" class="btn btn-outline no-underline">{{ t('home.view_all') }}</router-link>
      </div>
    </section>


    <!-- ═══ NEWSLETTER ═══ -->
    <section class="lux-section text-center">
      <div class="gold-line mb-16 mx-10 md:mx-20"></div>
      <div class="section-tag">{{ t('nav.slogan') }}</div>
      <h2 class="section-title mb-3">{{ t('home.newsletter_title') }}</h2>
      <p style="font-size:15px;color:var(--text-muted);margin-bottom:32px;max-width:460px;margin-inline:auto">{{ t('home.newsletter_subtitle') }}</p>
      <div class="newsletter-form">
        <input v-model="newsletterEmail" type="email" class="lux-input" style="border-radius:50px;flex:1"
          :placeholder="t('home.email_placeholder')" />
        <button class="btn btn-gold" style="flex-shrink:0">{{ t('home.subscribe') }}</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import axios from '@/utils/axios'
import { useConfig } from '@/composables/useConfig'

const { t, locale } = useI18n()
const cartStore = useCartStore()
const { currency } = useConfig()
const wishlist = ref([])
const newsletterEmail = ref('')
const loading = ref(true)
const loadingCategories = ref(true)
const featuredProducts = ref([])
const categories = ref([])

const heroCards = computed(() => [
  { emoji: '👜', name: locale.value === 'ar' ? 'حقيبة فاخرة' : 'Luxury Bag', price: '1,299 SAR', bg: 'background:linear-gradient(135deg,#1a1a26,#2a2a45)', style: 'width:240px;top:0;inset-inline-end:60px' },
  { emoji: '⌚', name: locale.value === 'ar' ? 'ساعة كلاسيك' : 'Classic Watch', price: '4,500 SAR', bg: 'background:linear-gradient(135deg,#22223a,#1a1a26)', style: 'width:180px;bottom:30px;inset-inline-end:0' },
  { emoji: '💎', name: locale.value === 'ar' ? 'مجوهرات' : 'Jewelry', price: '', bg: 'background:var(--surface)', style: 'width:150px;top:50px;inset-inline-end:-10px' },
])

const categoryGradients = [
  'linear-gradient(135deg,#2a1a3a,#4a2a6a)',
  'linear-gradient(135deg,#1a2a3a,#2a4a6a)',
  'linear-gradient(135deg,#2a2a1a,#4a3a1a)',
  'linear-gradient(135deg,#1a3a2a,#2a5a3a)',
  'linear-gradient(135deg,#3a1a1a,#5a2a2a)',
  'linear-gradient(135deg,#1a1a3a,#2a2a6a)',
]

const categoryEmojis = ['👗', '⌚', '🏺', '✨', '💎', '🎨']

async function loadCategories() {
  loadingCategories.value = true
  try {
    const response = await axios.get('/api/categories')
    const apiCategories = response.data.data || response.data
    // Filter to only show active categories on home page
    const activeCategories = apiCategories.filter(cat => cat.active)
    categories.value = activeCategories.map((cat, index) => ({
      ...cat,
      emoji: categoryEmojis[index % categoryEmojis.length],
      gradient: categoryGradients[index % categoryGradients.length],
      count: `${cat.products_count || 0} Products`
    }))
  } catch (error) {
    console.error('Failed to load categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

async function loadFeaturedProducts() {
  loading.value = true
  try {
    const response = await axios.get('/api/products', {
      params: {
        featured: 1,
        limit: 8
      }
    })
    featuredProducts.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to load featured products:', error)
    featuredProducts.value = []
  } finally {
    loading.value = false
  }
}


function getProductImage(product) {
  if (product.image) return product.image
  if (product.images) {
    try {
      const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
      return images[0] || null
    } catch (e) {
      return null
    }
  }
  return null
}

function addToCart(product) {
  cartStore.addItem({ 
    id: product.id, 
    name: product.name, 
    price: product.price, 
    image: getProductImage(product)
  }, 1)
}

function toggleWishlist(product) {
  const idx = wishlist.value.indexOf(product.id)
  if (idx >= 0) wishlist.value.splice(idx, 1)
  else wishlist.value.push(product.id)
}

onMounted(() => {
  loadFeaturedProducts()
  loadCategories()
})
</script>

<style scoped>
/* CENTERED HERO */
.hero-centered-section {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px clamp(20px,5vw,80px);
}
.hero-centered-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 70%, rgba(124,92,191,0.08) 0%, transparent 50%),
              var(--obsidian);
}
.hero-centered-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.hero-centered-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(48px, 7vw, 84px);
  line-height: 1.1;
  color: var(--text);
  font-weight: 900;
  max-width: 800px;
}
[dir="rtl"] .hero-centered-title {
  font-family: 'Tajawal', sans-serif;
}
.hero-centered-accent {
  display: block;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
  margin: 12px 0;
}
[dir="rtl"] .hero-centered-accent {
  font-style: normal;
}
.hero-centered-subtitle {
  font-size: 20px;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 600px;
}
.hero-centered-cta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Stats Grid */
.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 700px;
}
@media (max-width: 768px) {
  .hero-stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
.hero-stat-card {
  background: var(--surface);
  border: 1px solid var(--border-gold);
  border-radius: 20px;
  padding: 32px 24px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.hero-stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(201,168,76,0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.hero-stat-card:hover::before {
  opacity: 1;
}
.hero-stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(201,168,76,0.3);
  border-color: var(--gold);
}
.stat-card-num {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Playfair Display', serif;
  margin-bottom: 8px;
}
.stat-card-label {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 600;
}

/* Centered Trust Badges */
.hero-trust-badges-centered {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 20px;
}
@media (max-width: 768px) {
  .hero-trust-badges-centered {
    flex-direction: column;
    gap: 24px;
  }
}

/* MODERN SPLIT HERO (OLD) */
.hero-split-section {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 80px clamp(20px,5vw,80px);
}
.hero-split-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 30%, rgba(124,92,191,0.08) 0%, transparent 50%),
              var(--obsidian);
}
.hero-split-container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
@media (max-width: 1024px) {
  .hero-split-container {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  .hero-split-right {
    order: -1;
  }
}

/* Left Content */
.hero-split-left {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.hero-tag-modern {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  border-radius: 50px;
  background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05));
  border: 1px solid rgba(201,168,76,0.3);
  width: fit-content;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
}
.hero-tag-icon {
  font-size: 16px;
  animation: spin 20s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.hero-split-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(42px, 6vw, 72px);
  line-height: 1.1;
  color: var(--text);
  font-weight: 900;
}
[dir="rtl"] .hero-split-title {
  font-family: 'Tajawal', sans-serif;
}
.hero-split-accent {
  display: block;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
  margin: 8px 0;
}
[dir="rtl"] .hero-split-accent {
  font-style: normal;
}
.hero-split-subtitle {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 540px;
}

/* CTA Buttons */
.hero-split-cta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 36px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  color: var(--obsidian);
  font-size: 16px;
  font-weight: 800;
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 12px 40px rgba(201,168,76,0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.btn-hero-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  opacity: 0;
  transition: opacity 0.3s;
}
.btn-hero-primary:hover::before {
  opacity: 1;
}
.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 50px rgba(201,168,76,0.5);
}
.btn-hero-primary > * {
  position: relative;
  z-index: 1;
}
.btn-hero-arrow {
  transition: transform 0.3s;
}
.btn-hero-primary:hover .btn-hero-arrow {
  transform: translateX(4px);
}
.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  padding: 18px 36px;
  background: transparent;
  color: var(--text);
  font-size: 16px;
  font-weight: 700;
  border-radius: 16px;
  text-decoration: none;
  border: 2px solid var(--border-gold);
  transition: all 0.3s;
}
.btn-hero-secondary:hover {
  background: rgba(201,168,76,0.1);
  border-color: var(--gold);
  transform: translateY(-2px);
}

/* Trust Badges */
.hero-trust-badges {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.trust-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}
.trust-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05));
  border: 1px solid rgba(201,168,76,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.trust-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
}
.trust-desc {
  font-size: 12px;
  color: var(--text-muted);
}

/* Right Visual */
.hero-split-right {
  position: relative;
}
.hero-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
}
.hero-image-glow {
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%);
  filter: blur(60px);
  animation: pulse 4s ease-in-out infinite;
}
.hero-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  border: 2px solid var(--border-gold);
}
.hero-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}
.hero-image-wrapper:hover .hero-main-image {
  transform: scale(1.05);
}
.hero-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%);
}
.hero-float-stat {
  position: absolute;
  background: var(--surface);
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
}
.float-stat-num {
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Playfair Display', serif;
}
.float-stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}
.hero-deco-circle {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid rgba(201,168,76,0.2);
  animation: rotate 20s linear infinite;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* OLD HERO (keep for reference) */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 100px clamp(20px,5vw,80px) 60px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(124,92,191,0.06) 0%, transparent 50%),
              linear-gradient(180deg, var(--obsidian) 0%, var(--deep) 100%);
}
.hero-grid-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: linear-gradient(var(--gold) 1px, transparent 1px),
                    linear-gradient(90deg, var(--gold) 1px, transparent 1px);
  background-size: 80px 80px;
}
.hero-content { position: relative; z-index: 1; max-width: 620px; }
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 50px;
  border: 1px solid rgba(201,168,76,0.3);
  background: rgba(201,168,76,0.08);
  font-size: 12px;
  color: var(--gold);
  font-weight: 600;
  margin-bottom: 24px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(40px, 5vw, 68px);
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 20px;
}
[dir="rtl"] .hero-title { font-family: 'Tajawal', sans-serif; font-size: clamp(36px, 4.5vw, 60px); }
.hero-accent { color: var(--gold); font-style: italic; }
[dir="rtl"] .hero-accent { font-style: normal; }
.hero-subtitle { font-size: 17px; color: var(--text-muted); line-height: 1.8; margin-bottom: 36px; max-width: 480px; }
.hero-stats { display: flex; gap: 40px; margin-top: 56px; }
.hero-stat-num { font-size: 30px; font-weight: 900; color: var(--gold); font-family: 'Playfair Display', serif; }
[dir="rtl"] .hero-stat-num { font-family: 'Tajawal', sans-serif; }
.hero-stat-label { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.hero-visual {
  position: absolute;
  inset-inline-end: clamp(20px, 6vw, 80px);
  top: 50%;
  transform: translateY(-50%);
  width: 380px;
  height: 440px;
}
@media (max-width: 900px) { .hero-visual { display: none; } }
.hero-float-card {
  position: absolute;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  border: 1px solid var(--border-gold);
}
.hero-float-img {
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
}
/* CATEGORIES */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
@media (max-width: 900px) { .categories-grid { grid-template-columns: repeat(2, 1fr); } }
.cat-card {
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border-white);
  transition: all .4s;
  background: var(--surface);
}
.cat-card:hover { transform: translateY(-8px); border-color: var(--gold); }
.cat-bg { height: 200px; display: flex; align-items: center; justify-content: center; }

/* Enhanced Category Cards */
.cat-card-enhanced {
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border-white);
  transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--surface);
  position: relative;
}
.cat-card-enhanced:hover { 
  transform: translateY(-12px) scale(1.02); 
  border-color: var(--gold);
  box-shadow: 0 20px 60px rgba(201,168,76,0.2);
}
.cat-card-enhanced:hover .cat-arrow {
  transform: translateX(4px);
}
.cat-bg-enhanced { 
  height: 220px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.cat-bg-enhanced::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%);
  opacity: 0;
  transition: opacity 0.4s;
}
.cat-card-enhanced:hover .cat-bg-enhanced::before {
  opacity: 1;
}

/* Hero Glow Orbs */
.hero-glow-orb {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%);
  filter: blur(60px);
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}
.promo-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%);
  filter: blur(80px);
  top: -200px;
  left: -200px;
  animation: pulse 6s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* PRODUCTS */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
.product-card:hover .wish-btn { opacity: 1 !important; }
.product-card:hover .product-img-hover { transform: scale(1.08); }

/* Enhanced Promo Section */
.promo-section-enhanced {
  margin: 80px clamp(20px,5vw,80px);
  padding: 60px clamp(30px,5vw,80px);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%);
  border: 2px solid var(--border-gold);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
.countdown-block-enhanced {
  background: var(--surface2);
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  padding: 20px 24px;
  min-width: 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transition: transform 0.3s;
}
.countdown-block-enhanced:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(201,168,76,0.3);
}

/* Original Promo */
.promo-section {
  margin: 0 clamp(20px, 5vw, 80px);
  border-radius: var(--radius);
  padding: 60px clamp(24px, 4vw, 80px);
  background: linear-gradient(135deg, #1a1a26, #2a2a45);
  border: 1px solid var(--border-gold);
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 40px;
}
@media (max-width: 768px) { .promo-section { grid-template-columns: 1fr; } }
.promo-glow {
  position: absolute;
  top: -50%;
  inset-inline-end: -10%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.promo-tag-badge {
  display: inline-block;
  background: var(--danger);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: 1px;
}
.promo-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(24px, 3vw, 36px);
  color: var(--text);
  margin-bottom: 8px;
}
[dir="rtl"] .promo-title { font-family: 'Tajawal', sans-serif; }
.countdown-block {
  text-align: center;
  min-width: 70px;
}
.countdown-num {
  font-size: 34px;
  font-weight: 900;
  color: var(--gold);
  font-family: 'Playfair Display', serif;
  background: var(--surface);
  border-radius: 12px;
  padding: 8px;
  display: block;
  border: 1px solid var(--border-gold);
}
.countdown-lbl {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  display: block;
}

/* NEWSLETTER */
.newsletter-form {
  display: flex;
  gap: 12px;
  max-width: 480px;
  margin: 0 auto;
}
@media (max-width: 640px) { .newsletter-form { flex-direction: column; } }
</style>
