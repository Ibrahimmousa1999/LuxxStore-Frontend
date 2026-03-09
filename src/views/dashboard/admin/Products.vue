<template>
  <div>
    <Toast :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" @close="toast.show = false" />
    
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
      <div>
        <div class="section-tag">{{ t('dashboard.admin.title') }}</div>
        <h1 class="section-title">{{ t('dashboard.admin.products') }}</h1>
      </div>
    </div>

    <div class="lux-card" style="padding:0;overflow:hidden">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border-white);display:flex;gap:12px;flex-wrap:wrap">
        <input type="text" v-model="searchQuery" :placeholder="t('common.search')" class="lux-input" style="flex:1;min-width:200px;border-radius:10px" />
        <LuxSelect
          v-model="categoryFilter"
          :options="categoryOptions"
          :placeholder="t('dashboard.admin.all_categories')"
          :searchable="false"
          style="width:200px"
        />
        <LuxSelect
          v-model="statusFilter"
          :options="statusOptions"
          :placeholder="t('dashboard.admin.all_status')"
          :searchable="false"
          style="width:180px"
        />
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
        <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
      </div>
      
      <div v-else style="overflow-x:auto">
        <div v-if="filteredProducts.length > 0">
          <table class="lux-table">
            <thead>
              <tr>
                <th>{{ t('common.product') }}</th>
                <th>{{ t('common.category') }}</th>
                <th>{{ t('common.price') }}</th>
                <th>{{ t('dashboard.admin.stock') }}</th>
                <th>{{ t('common.status') }}</th>
                <th>{{ t('dashboard.admin.merchant') }}</th>
                <th>{{ t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div style="display:flex;align-items:center;gap:12px">
                  <img :src="product.image" :alt="product.name" style="width:44px;height:44px;object-fit:cover;border-radius:8px;border:1px solid var(--border-white)" />
                  <div>
                    <div style="font-weight:600">{{ product.name }}</div>
                    <div style="font-size:12px;color:var(--text-muted)">{{ product.brand || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td style="color:var(--text-muted)">{{ product.category?.name || 'N/A' }}</td>
              <td><span style="font-weight:700;color:var(--gold)">{{ product.price.toLocaleString() }} {{ currency }}</span></td>
              <td>
                <span :style="product.stock > 10 ? 'color:var(--success)' : 'color:var(--danger)'" style="font-weight:700">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <span class="lux-badge" :class="product.active ? 'badge-green' : 'badge-red'">
                  {{ product.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td style="color:var(--text-muted)">{{ product.user?.name || 'N/A' }}</td>
              <td>
                <div style="display:flex;gap:6px">
                  <button @click="viewProductDetails(product)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px" title="View Details">
                    👁️
                  </button>
                  <button @click="toggleProductStatus(product)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px" :title="product.active ? 'Click to Deactivate' : 'Click to Activate'">
                    {{ product.active ? '✓' : '✕' }}
                  </button>
                  <button @click="toggleFeatured(product)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px" :title="product.featured ? 'Remove from Featured' : 'Mark as Featured'">
                    {{ product.featured ? '⭐' : '☆' }}
                  </button>
                  <button @click="openDeleteModal(product)" class="btn btn-sm" style="border-radius:8px;padding:6px 10px;background:rgba(224,92,92,0.1);color:var(--danger);border:1px solid rgba(224,92,92,0.2)">🗑</button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-16">
          <div style="font-size:64px;margin-bottom:16px;opacity:0.3">📦</div>
          <div style="font-size:18px;font-weight:700;color:var(--text-muted);margin-bottom:6px">{{ t('dashboard.admin.no_products') }}</div>
          <div style="font-size:14px;color:var(--text-dim)">{{ t('dashboard.admin.no_products_desc') }}</div>
        </div>
      </div>
    </div>

    <!-- Product Details Modal - Simple Design -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="lux-card" style="max-width:700px;width:90%;max-height:90vh;overflow-y:auto">
        
        <!-- Header -->
        <div style="display:flex;align-items:start;justify-content:space-between;padding-bottom:20px;border-bottom:1px solid var(--border-white);margin-bottom:24px">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <img :src="selectedProduct?.image" :alt="selectedProduct?.name" style="width:60px;height:60px;object-fit:cover;border-radius:12px;border:1px solid var(--border-gold)" />
              <div>
                <h2 style="font-size:24px;font-weight:700;color:var(--text);margin-bottom:4px">{{ selectedProduct?.name }}</h2>
                <div style="display:flex;gap:8px">
                  <span v-if="selectedProduct?.featured" class="lux-badge badge-gold">⭐ {{ t('dashboard.admin.featured') }}</span>
                  <span class="lux-badge" :class="selectedProduct?.active ? 'badge-green' : 'badge-red'">{{ selectedProduct?.active ? t('dashboard.admin.active') : t('dashboard.admin.inactive') }}</span>
                </div>
              </div>
            </div>
          </div>
          <button @click="showDetailsModal = false" class="btn btn-ghost btn-sm" style="padding:8px">✕</button>
        </div>

        <!-- Content -->
        <div v-if="selectedProduct" style="display:flex;flex-direction:column;gap:24px">
          
          <!-- Price & Stock -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="lux-card" style="background:var(--surface2);padding:20px">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">{{ t('common.price') }}</div>
              <div style="font-size:28px;font-weight:900;color:var(--gold)">{{ selectedProduct.price.toLocaleString() }} {{ currency }}</div>
              <div v-if="selectedProduct.old_price" style="font-size:14px;color:var(--text-muted);text-decoration:line-through;margin-top:4px">{{ selectedProduct.old_price.toLocaleString() }} {{ currency }}</div>
            </div>
            <div class="lux-card" style="background:var(--surface2);padding:20px">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.stock') }}</div>
              <div style="font-size:28px;font-weight:900" :style="selectedProduct.stock > 10 ? 'color:var(--success)' : 'color:var(--danger)'">{{ selectedProduct.stock }}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:4px">{{ t('dashboard.admin.units_available') }}</div>
            </div>
          </div>

          <!-- Info Grid -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">{{ t('common.category') }}</div>
              <div style="font-size:14px;font-weight:600;color:var(--text)">{{ selectedProduct.category?.name || 'N/A' }}</div>
            </div>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">{{ t('dashboard.admin.brand') }}</div>
              <div style="font-size:14px;font-weight:600;color:var(--text)">{{ selectedProduct.brand || 'N/A' }}</div>
            </div>
            <div class="lux-card" style="background:var(--surface2);padding:16px">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">{{ t('dashboard.admin.merchant') }}</div>
              <div style="font-size:14px;font-weight:600;color:var(--text)">{{ selectedProduct.user?.name || 'N/A' }}</div>
            </div>
          </div>

          <!-- Stats -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
            <div class="lux-card" style="background:var(--surface2);padding:16px;text-align:center">
              <div style="font-size:20px;font-weight:700;color:var(--accent2);margin-bottom:4px">{{ selectedProduct.views || 0 }}</div>
              <div style="font-size:11px;color:var(--text-muted)">{{ t('dashboard.admin.views') }}</div>
            </div>
            <div class="lux-card" style="background:var(--surface2);padding:16px;text-align:center">
              <div style="font-size:20px;font-weight:700;color:var(--success);margin-bottom:4px">{{ selectedProduct.sales || 0 }}</div>
              <div style="font-size:11px;color:var(--text-muted)">{{ t('dashboard.admin.sales') }}</div>
            </div>
            <div class="lux-card" style="background:var(--surface2);padding:16px;text-align:center">
              <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:4px">{{ selectedProduct.rating || 0 }}</div>
              <div style="font-size:11px;color:var(--text-muted)">{{ t('dashboard.admin.rating') }}</div>
            </div>
            <div class="lux-card" style="background:var(--surface2);padding:16px;text-align:center">
              <div style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px">{{ selectedProduct.reviews_count || 0 }}</div>
              <div style="font-size:11px;color:var(--text-muted)">{{ t('dashboard.admin.reviews') }}</div>
            </div>
          </div>

          <!-- Description -->
          <div class="lux-card" style="background:var(--surface2);padding:20px">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">{{ t('product.description') }}</div>
            <div style="font-size:14px;color:var(--text);line-height:1.6">{{ selectedProduct.description || t('product.description') }}</div>
          </div>

        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content lux-card" style="max-width:500px;width:90%">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:64px;margin-bottom:16px">⚠️</div>
          <h2 style="font-size:24px;font-weight:900;color:var(--danger);margin-bottom:8px">Delete Product</h2>
          <p style="color:var(--text-muted);margin-bottom:8px">Are you sure you want to delete this product?</p>
          <p style="color:var(--text);font-weight:700;font-size:18px">{{ productToDelete?.name }}</p>
          <p style="color:var(--text-muted);font-size:14px;margin-top:8px">This action cannot be undone.</p>
        </div>
        
        <div style="display:flex;gap:12px">
          <button @click="showDeleteModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">Cancel</button>
          <button @click="confirmDelete" :disabled="deleting" class="btn" style="flex:1;border-radius:10px;background:var(--danger);color:white;border:none">
            {{ deleting ? 'Deleting...' : 'Delete Product' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'
import Toast from '@/components/Toast.vue'
import LuxSelect from '@/components/LuxSelect.vue'
import { useConfig } from '@/composables/useConfig'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const productsStore = useProductsStore()
const { currency } = useConfig()
const { theme } = useTheme()

const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const products = ref([])
const categories = ref([])
const loading = ref(false)
const showDeleteModal = ref(false)
const showDetailsModal = ref(false)
const productToDelete = ref(null)
const selectedProduct = ref(null)
const deleting = ref(false)

const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

onMounted(async () => {
  await loadProducts()
  await loadCategories()
})

async function loadProducts() {
  loading.value = true
  try {
    const response = await productsStore.fetchProducts()
    // Handle paginated response
    products.value = response.data || response
    console.log('Loaded products:', products.value)
    console.log('Total products:', products.value.length)
    console.log('Active products:', products.value.filter(p => p.active).length)
    console.log('Inactive products:', products.value.filter(p => !p.active).length)
  } catch (error) {
    console.error('Error loading products:', error)
    showToast('error', 'Error', 'Failed to load products')
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const allCategories = await productsStore.fetchCategories()
    // Filter to only show active categories in product forms
    categories.value = allCategories.filter(cat => cat.active)
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const categoryOptions = computed(() => [
  { label: t('dashboard.admin.all_categories'), value: '' },
  ...categories.value.map(cat => ({ label: cat.name, value: cat.id }))
])

const statusOptions = computed(() => [
  { label: t('dashboard.admin.all_status'), value: '' },
  { label: t('dashboard.admin.active'), value: 'active' },
  { label: t('dashboard.admin.inactive'), value: 'inactive' }
])

const filteredProducts = computed(() => {
  if (!Array.isArray(products.value)) {
    return []
  }
  console.log('Filtering products with:', {
    statusFilter: statusFilter.value,
    categoryFilter: categoryFilter.value,
    searchQuery: searchQuery.value
  })
  const filtered = products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || p.category_id == categoryFilter.value
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && p.active) || 
      (statusFilter.value === 'inactive' && !p.active)
    return matchesSearch && matchesCategory && matchesStatus
  })
  console.log('Filtered products count:', filtered.length)
  return filtered
})

function viewProductDetails(product) {
  selectedProduct.value = product
  showDetailsModal.value = true
}

async function toggleProductStatus(product) {
  try {
    const newStatus = !product.active
    await productsStore.updateProduct(product.id, { active: newStatus })
    // Update the product in place instead of reloading
    product.active = newStatus
    const status = newStatus ? 'activated' : 'deactivated'
    showToast('success', 'Status Updated', `${product.name} has been ${status}`)
  } catch (error) {
    console.error('Error toggling product status:', error)
    showToast('error', 'Error', 'Failed to update product status')
  }
}

async function toggleFeatured(product) {
  try {
    const newFeatured = !product.featured
    await productsStore.updateProduct(product.id, { featured: newFeatured })
    // Update the product in place instead of reloading
    product.featured = newFeatured
    const status = newFeatured ? 'marked as featured' : 'removed from featured'
    showToast('success', 'Featured Updated', `${product.name} has been ${status}`)
  } catch (error) {
    console.error('Error toggling featured:', error)
    showToast('error', 'Error', 'Failed to update featured status')
  }
}

function openDeleteModal(product) {
  productToDelete.value = product
  showDeleteModal.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await productsStore.deleteProduct(productToDelete.value.id)
    showToast('success', 'Product Deleted', `${productToDelete.value.name} has been removed`)
    showDeleteModal.value = false
    productToDelete.value = null
    await loadProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    showToast('error', 'Error', 'Failed to delete product')
  } finally {
    deleting.value = false
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
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
