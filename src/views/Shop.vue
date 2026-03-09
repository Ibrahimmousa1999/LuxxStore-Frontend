<template>
  <div style="background:var(--obsidian);min-height:100vh;padding:40px clamp(16px,4vw,60px)">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <div class="section-tag">{{ t('home.editors_pick') }}</div>
        <h1 class="section-title">{{ t('nav.shop') }}</h1>
        <p style="font-size:14px;color:var(--text-dim);margin-top:4px">
          {{ filteredProducts.length }} {{ t('common.results') }}
        </p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Search -->
        <div style="display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border-white);border-radius:10px;padding:8px 14px;width:220px">
          <span style="color:var(--text-muted)">🔍</span>
          <input v-model="searchQuery" :placeholder="t('common.search')" style="background:transparent;border:none;outline:none;color:var(--text);font-size:14px;width:100%;font-family:inherit" />
        </div>
        <!-- Sort -->
        <LuxSelect
          v-model="sortBy"
          :options="sortOptions"
          :searchable="false"
          style="width:180px"
        />
      </div>
    </div>

    <div class="flex gap-6" style="align-items:start">
      <!-- Sidebar Filters -->
      <aside style="width:220px;flex-shrink:0;position:sticky;top:90px" class="hidden md:block">
        <div class="lux-card">
          <h3 style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;text-transform:uppercase">{{ t('common.filter') }}</h3>

          <!-- Categories -->
          <div style="margin-bottom:20px">
            <h4 class="filter-title">{{ t('nav.categories') }}</h4>
            <div v-for="cat in filterCategories" :key="cat.key" @click="toggleCategory(cat.key)"
              class="filter-opt" :class="{ active: selectedCategories.includes(cat.key) }">
              <span class="filter-check">{{ selectedCategories.includes(cat.key) ? '✓' : '' }}</span>
              {{ cat.label }}
            </div>
          </div>

          <!-- Price Range -->
          <div style="margin-bottom:20px">
            <h4 class="filter-title">{{ t('product.price') }}</h4>
            <div style="display:flex;gap:8px">
              <input v-model="priceMin" type="number" placeholder="Min" class="lux-input" style="padding:8px 10px;font-size:13px" />
              <input v-model="priceMax" type="number" placeholder="Max" class="lux-input" style="padding:8px 10px;font-size:13px" />
            </div>
          </div>

          <button @click="clearFilters" class="btn btn-ghost btn-sm w-full" style="justify-content:center">✕ {{ t('common.cancel') }}</button>
        </div>
      </aside>

      <!-- Products Grid -->
      <main style="flex:1;min-width:0">
        <div v-if="loading" class="text-center py-20" style="color:var(--text-muted)">
          <div style="font-size:40px;margin-bottom:12px">✦</div>
          {{ t('common.loading') }}
        </div>
        <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
          <div style="font-size:48px;margin-bottom:12px">🔍</div>
          <p style="color:var(--text-muted)">{{ t('common.no_results') }}</p>
        </div>
        <div v-else class="shop-grid">
          <div v-for="product in filteredProducts" :key="product.id"
            class="product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <div style="aspect-ratio:1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--surface2)">
              <img v-if="product.image" :src="product.image" :alt="product.name"
                style="position:relative;z-index:1;width:100%;height:100%;object-fit:cover;transition:transform .5s"
                class="shop-img" />
              <div v-else style="font-size:64px">📦</div>
              <div v-if="product.featured"
                style="position:absolute;top:10px;inset-inline-end:10px;background:var(--gold);color:var(--obsidian);font-size:9px;font-weight:900;padding:2px 8px;border-radius:50px;z-index:2;letter-spacing:1px">
                FEATURED
              </div>
              <div v-else-if="product.old_price && product.old_price > product.price"
                style="position:absolute;top:10px;inset-inline-end:10px;background:var(--danger);color:white;font-size:9px;font-weight:900;padding:2px 8px;border-radius:50px;z-index:2;letter-spacing:1px">
                SALE
              </div>
            </div>
            <div style="padding:14px">
              <div style="font-size:10px;color:var(--gold);font-weight:700;letter-spacing:1px;margin-bottom:3px;text-transform:uppercase">{{ product.brand || product.category?.name || 'LUXSTORE' }}</div>
              <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:8px">{{ locale.value === 'ar' ? (product.name_ar || product.name) : (product.name_en || product.name) }}</div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div>
                  <span v-if="product.old_price && product.old_price > product.price" style="font-size:11px;color:var(--text-dim);text-decoration:line-through;margin-inline-end:5px">{{ Number(product.old_price).toLocaleString() }}</span>
                  <span style="font-size:17px;font-weight:900;color:var(--gold)">{{ Number(product.price).toLocaleString() }} {{ currency }}</span>
                </div>
                <button @click.stop="addToCart(product)"
                  style="width:34px;height:34px;border-radius:9px;background:var(--surface2);border:1px solid var(--border-white);color:var(--gold);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s"
                  class="add-btn">+</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import LuxSelect from '@/components/LuxSelect.vue'
import { useConfig } from '@/composables/useConfig'

const { t, locale } = useI18n()
const route = useRoute()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const { currency } = useConfig()

const searchQuery = ref('')
const sortBy = ref('newest')
const selectedCategories = ref([])
const priceMin = ref('')
const priceMax = ref('')
const loading = ref(false)
const allProducts = ref([])
const categories = ref([])

const sortOptions = computed(() => [
  { label: t('common.newest'), value: 'newest' },
  { label: t('common.price_low'), value: 'price_asc' },
  { label: t('common.price_high'), value: 'price_desc' }
])

onMounted(async () => {
  await loadProducts()
  await loadCategories()
  
  // Check if category filter is in URL query
  if (route.query.category) {
    const categoryId = parseInt(route.query.category)
    if (categoryId && !selectedCategories.value.includes(categoryId)) {
      selectedCategories.value = [categoryId]
    }
  }
})

// Watch for route query changes
watch(() => route.query.category, (newCategoryId) => {
  if (newCategoryId) {
    const categoryId = parseInt(newCategoryId)
    if (categoryId && !selectedCategories.value.includes(categoryId)) {
      selectedCategories.value = [categoryId]
    }
  }
})

async function loadProducts() {
  loading.value = true
  try {
    const response = await productsStore.fetchProducts()
    allProducts.value = response.data || response
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const allCategories = await productsStore.fetchCategories()
    // Filter to only show active categories in shop page
    categories.value = allCategories.filter(cat => cat.active)
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const filterCategories = computed(() => 
  categories.value.map(cat => ({
    key: cat.id,
    label: locale.value === 'ar' ? (cat.name_ar || cat.name) : (cat.name_en || cat.name)
  }))
)


const filteredProducts = computed(() => {
  if (!Array.isArray(allProducts.value)) return []
  
  let list = [...allProducts.value].filter(p => p.active)
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.name && p.category.name.toLowerCase().includes(q))
    )
  }
  
  if (selectedCategories.value.length > 0) {
    list = list.filter(p => selectedCategories.value.includes(p.category_id))
  }
  
  if (priceMin.value) list = list.filter(p => Number(p.price) >= Number(priceMin.value))
  if (priceMax.value) list = list.filter(p => Number(p.price) <= Number(priceMax.value))
  
  switch (sortBy.value) {
    case 'price_asc': 
      list.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case 'price_desc': 
      list.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case 'popular': 
      list.sort((a, b) => (b.sales || 0) - (a.sales || 0))
      break
    case 'newest':
    default:
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
  }
  
  return list
})

function toggleCategory(key) {
  const idx = selectedCategories.value.indexOf(key)
  if (idx >= 0) selectedCategories.value.splice(idx, 1)
  else selectedCategories.value.push(key)
}

function clearFilters() {
  selectedCategories.value = []
  priceMin.value = ''
  priceMax.value = ''
  searchQuery.value = ''
}

function addToCart(product) {
  cartStore.addItem({ 
    id: product.id, 
    name: product.name, 
    price: Number(product.price), 
    image: product.image 
  }, 1)
}
</script>

<style scoped>
.shop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 900px) { .shop-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .shop-grid { grid-template-columns: 1fr; } }
.shop-img { display: block; }
.product-card:hover .shop-img { transform: scale(1.07); }
.add-btn:hover { background: var(--gold) !important; color: var(--obsidian) !important; }
.filter-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}
.filter-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-muted);
  transition: color .2s;
  border-radius: 6px;
}
.filter-opt:hover, .filter-opt.active { color: var(--text); }
.filter-check {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--border-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
  transition: all .2s;
}
.filter-opt.active .filter-check { background: var(--gold); border-color: var(--gold); color: var(--obsidian); }
</style>
