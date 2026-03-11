<template>
  <div>
    <Toast :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" @close="toast.show = false" />
    
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
      <div>
        <div class="section-tag">{{ t('dashboard.merchant.title') }}</div>
        <h1 class="section-title">{{ t('dashboard.merchant.my_products') }}</h1>
      </div>
      <button @click="openProductModal()" class="btn btn-gold" style="border-radius:12px">
        + {{ t('dashboard.merchant.add_product') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="lux-card text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
    </div>

    <!-- Products Grid -->
    <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div style="position:relative;aspect-ratio:1;overflow:hidden;background:var(--surface2)">
          <img v-if="product.image" :src="product.image" :alt="product.name" style="width:100%;height:100%;object-fit:cover;transition:transform .4s" @error="handleImageError" />
          <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px">📦</div>
          <div style="position:absolute;top:10px;inset-inline-end:10px">
            <span class="lux-badge" :class="product.stock > 10 ? 'badge-green' : 'badge-red'">
              {{ product.stock > 10 ? t('common.in_stock') : t('common.low_stock') }}
            </span>
          </div>
        </div>
        <div style="padding:18px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <div style="font-size:11px;color:var(--gold);font-weight:700;letter-spacing:1px">{{ product.category?.name || 'N/A' }}</div>
            <span class="lux-badge" :class="product.active ? 'badge-green' : 'badge-red'" style="font-size:10px;padding:2px 8px">
              {{ product.active ? t('dashboard.admin.active_status') : t('dashboard.admin.inactive_status') }}
            </span>
          </div>
          <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px">{{ product.name }}</h3>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <span style="font-size:20px;font-weight:900;color:var(--gold)">{{ product.price.toLocaleString() }} {{ currency }}</span>
            <span style="font-size:12px;color:var(--text-muted)">{{ t('dashboard.admin.stock_label') }}: {{ product.stock }}</span>
          </div>
          <div style="display:flex;gap:8px">
            <button @click="toggleProductStatus(product)" class="btn btn-ghost btn-sm" style="border-radius:10px;padding:8px 12px" :title="product.active ? t('dashboard.admin.click_to_deactivate') : t('dashboard.admin.click_to_activate')">
              {{ product.active ? '✓' : '✕' }}
            </button>
            <button @click="openProductModal(product)" class="btn btn-outline btn-sm" style="flex:1;border-radius:10px;justify-content:center">
              {{ t('common.edit') }}
            </button>
            <button @click="confirmDelete(product)" class="btn btn-sm" style="border-radius:10px;padding:8px 12px;background:rgba(224,92,92,0.1);color:var(--danger);border:1px solid rgba(224,92,92,0.2)">
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="lux-card text-center py-16">
      <div style="font-size:64px;margin-bottom:16px;opacity:0.3">📦</div>
      <div style="font-size:18px;font-weight:700;color:var(--text-muted);margin-bottom:6px">{{ t('dashboard.admin.no_products') }}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-bottom:20px">{{ t('dashboard.admin.start_adding_products') }}</div>
      <button @click="openProductModal()" class="btn btn-gold" style="border-radius:12px">+ {{ t('dashboard.admin.add_first_product') }}</button>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="modal-overlay" @click.self="showProductModal = false">
      <div class="modal-content lux-card" style="max-width:600px;width:90%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
          <h2 style="font-size:24px;font-weight:900;color:var(--text)">{{ editingProduct ? t('dashboard.admin.edit_product') : t('dashboard.admin.add_new_product') }}</h2>
          <button @click="showProductModal = false" class="btn btn-ghost" style="padding:8px;border-radius:8px">✕</button>
        </div>
        <form @submit.prevent="saveProduct">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.product_name_en') }} *</label>
              <input v-model="productForm.name_en" type="text" required class="lux-input" style="border-radius:10px" placeholder="e.g., Luxury Watch" />
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.product_name_ar') }} *</label>
              <input v-model="productForm.name_ar" type="text" required class="lux-input" style="border-radius:10px" placeholder="مثال: ساعة فاخرة" dir="rtl" />
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('common.category') }} *</label>
              <LuxSelect
                v-model="productForm.category_id"
                :options="categoryOptions"
                :placeholder="t('dashboard.admin.select_category')"
                :searchable="true"
              />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div>
                <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.price_sar') }} *</label>
                <input v-model.number="productForm.price" type="number" step="0.01" min="0" required class="lux-input" style="border-radius:10px" placeholder="0.00" />
              </div>
              <div>
                <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.old_price_sar') }}</label>
                <input v-model.number="productForm.old_price" type="number" step="0.01" min="0" class="lux-input" style="border-radius:10px" placeholder="0.00" />
              </div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.stock_quantity') }} *</label>
              <input v-model.number="productForm.stock" type="number" min="0" required class="lux-input" style="border-radius:10px" placeholder="0" />
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.brand') }}</label>
              <input v-model="productForm.brand" type="text" class="lux-input" style="border-radius:10px" placeholder="e.g., Rolex, Gucci" />
            </div>
            <ImageUploader v-model="productForm.images" />
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.description_en') }} *</label>
              <textarea v-model="productForm.description_en" required class="lux-input" rows="3" style="border-radius:10px;resize:vertical" placeholder="English description"></textarea>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.description_ar') }} *</label>
              <textarea v-model="productForm.description_ar" required class="lux-input" rows="3" style="border-radius:10px;resize:vertical" placeholder="الوصف بالعربية" dir="rtl"></textarea>
            </div>
            <div style="display:flex;gap:12px;margin-top:8px">
              <button type="button" @click="showProductModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">{{ t('dashboard.admin.cancel') }}</button>
              <button type="submit" :disabled="saving" class="btn btn-gold" style="flex:1;border-radius:10px">
                {{ saving ? t('dashboard.admin.saving') : (editingProduct ? t('dashboard.admin.update_product') : t('dashboard.admin.create_product')) }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'
import Toast from '@/components/Toast.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import LuxSelect from '@/components/LuxSelect.vue'
import { useConfig } from '@/composables/useConfig'

const { t } = useI18n()
const productsStore = useProductsStore()
const { currency } = useConfig()

const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const products = ref([])
const categories = ref([])
const loading = ref(false)
const showProductModal = ref(false)
const editingProduct = ref(null)
const saving = ref(false)

const productForm = ref({
  name_en: '',
  name_ar: '',
  category_id: '',
  price: 0,
  old_price: 0,
  stock: 0,
  brand: '',
  description_en: '',
  description_ar: '',
  images: { main: '', gallery: [] }
})

onMounted(async () => {
  await loadProducts()
  await loadCategories()
})

async function loadProducts() {
  loading.value = true
  try {
    const response = await productsStore.fetchMyProducts()
    products.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('Error loading products:', error)
    showToast('error', 'Error', error.response?.data?.message || 'Failed to load products')
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

const categoryOptions = computed(() => 
  categories.value.map(cat => ({ label: cat.name, value: cat.id }))
)

function openProductModal(product = null) {
  if (product) {
    editingProduct.value = product
    productForm.value = {
      name_en: product.name_en || product.name || '',
      name_ar: product.name_ar || '',
      category_id: product.category_id || '',
      price: parseFloat(product.price) || 0,
      old_price: product.old_price ? parseFloat(product.old_price) : null,
      stock: parseInt(product.stock) || 0,
      brand: product.brand || '',
      description_en: product.description_en || product.description || '',
      description_ar: product.description_ar || '',
      images: {
        main: product.image || '',
        gallery: Array.isArray(product.images) ? product.images.filter(img => img !== product.image) : []
      }
    }
  } else {
    editingProduct.value = null
    resetForm()
  }
  showProductModal.value = true
}

async function saveProduct() {
  // Validate main image
  if (!productForm.value.images.main) {
    showToast('error', 'Validation Error', 'Please upload a main product image')
    return
  }

  saving.value = true
  try {
    // Prepare product data
    const productData = {
      name: productForm.value.name_en, // Backend expects 'name' field
      name_en: productForm.value.name_en,
      name_ar: productForm.value.name_ar,
      category_id: productForm.value.category_id,
      price: productForm.value.price,
      old_price: productForm.value.old_price,
      stock: productForm.value.stock,
      brand: productForm.value.brand,
      description: productForm.value.description_en, // Backend expects 'description' field
      description_en: productForm.value.description_en,
      description_ar: productForm.value.description_ar,
      image: productForm.value.images.main,
      images: [productForm.value.images.main, ...productForm.value.images.gallery]
    }

    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, productData)
      showToast('success', 'Product Updated', `${productForm.value.name_en} has been updated successfully`)
    } else {
      await productsStore.createProduct(productData)
      showToast('success', 'Product Created', `${productForm.value.name_en} has been added to your store`)
    }
    showProductModal.value = false
    resetForm()
    await loadProducts()
  } catch (error) {
    console.error('Error saving product:', error)
    showToast('error', 'Error', error.response?.data?.message || 'Failed to save product')
  } finally {
    saving.value = false
  }
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
    // Check if product is admin-locked
    if (error.response?.status === 403 && error.response?.data?.admin_locked) {
      showToast('error', 'Admin Locked', error.response.data.message || 'This product has been locked by an administrator. You cannot change its status.')
    } else {
      showToast('error', 'Error', error.response?.data?.message || 'Failed to update product status')
    }
  }
}

async function confirmDelete(product) {
  const confirmed = await confirm('Delete Product?', `Are you sure you want to delete "${product.name}"? This action cannot be undone.`)
  if (confirmed) {
    try {
      await productsStore.deleteProduct(product.id)
      showToast('success', 'Product Deleted', `${product.name} has been removed from your store`)
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('error', 'Error', 'Failed to delete product')
    }
  }
}

function resetForm() {
  productForm.value = {
    name_en: '',
    name_ar: '',
    category_id: '',
    price: 0,
    old_price: 0,
    stock: 0,
    brand: '',
    description_en: '',
    description_ar: '',
    images: { main: '', gallery: [] }
  }
  editingProduct.value = null
}

function showToast(type, title, message) {
  toast.value = {
    show: true,
    type,
    title,
    message
  }
}

function handleImageError(event) {
  console.error('Failed to load product image:', event.target.src)
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;background:var(--surface2)">📦</div>'
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
