<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
      <div>
        <div class="section-tag">{{ t('dashboard.admin.title') }}</div>
        <h1 class="section-title">{{ t('dashboard.admin.categories_management') }}</h1>
      </div>
      <button @click="openCategoryModal()" class="btn btn-gold" style="border-radius:12px">
        + {{ t('dashboard.admin.add_category') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="lux-card text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
    </div>

    <div v-else class="lux-card" style="padding:0;overflow:hidden">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border-white);display:flex;gap:12px;flex-wrap:wrap">
        <input type="text" v-model="searchQuery" :placeholder="t('common.search')" class="lux-input" style="flex:1;min-width:200px;border-radius:10px" />
      </div>
      <div style="overflow-x:auto">
        <div v-if="filteredCategories.length > 0">
          <table class="lux-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{{ t('common.name') }}</th>
                <th>{{ t('product.description') }}</th>
                <th>{{ t('dashboard.admin.products_count') }}</th>
                <th>{{ t('common.status') }}</th>
                <th>{{ t('dashboard.admin.created') }}</th>
                <th>{{ t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in filteredCategories" :key="category.id">
                <td><span style="font-family:monospace;color:var(--gold)">#{{ category.id }}</span></td>
                <td style="font-weight:600">{{ category.name }}</td>
                <td style="color:var(--text-muted)">{{ category.description || 'N/A' }}</td>
                <td><span style="color:var(--gold);font-weight:700">{{ category.products_count || 0 }}</span></td>
                <td>
                  <span class="lux-badge" :class="category.active ? 'badge-green' : 'badge-red'">
                    {{ category.active ? t('dashboard.admin.active') : t('dashboard.admin.inactive') }}
                  </span>
                </td>
                <td style="color:var(--text-muted)">{{ formatDate(category.created_at) }}</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button @click="toggleActive(category)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px" :title="category.active ? t('dashboard.admin.deactivate') : t('dashboard.admin.activate')">
                      {{ category.active ? '🔓' : '🔒' }}
                    </button>
                    <button @click="openCategoryModal(category)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px">✏️</button>
                    <button @click="openDeleteModal(category)" class="btn btn-sm" style="border-radius:8px;padding:6px 10px;background:rgba(224,92,92,0.1);color:var(--danger);border:1px solid rgba(224,92,92,0.2)">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-16">
          <div style="font-size:64px;margin-bottom:16px;opacity:0.3">📁</div>
          <div style="font-size:18px;font-weight:700;color:var(--text-muted);margin-bottom:6px">{{ t('dashboard.admin.no_categories') }}</div>
          <div style="font-size:14px;color:var(--text-dim);margin-bottom:20px">{{ t('dashboard.admin.no_categories_desc') }}</div>
          <button @click="openCategoryModal()" class="btn btn-gold" style="border-radius:12px">+ {{ t('dashboard.admin.add_category') }}</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showCategoryModal" class="modal-overlay" @click.self="showCategoryModal = false">
      <div class="modal-content lux-card" style="max-width:600px;width:90%;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
          <h2 style="font-size:24px;font-weight:900;color:var(--text)">{{ editingCategory ? t('dashboard.admin.edit_category') : t('dashboard.admin.add_new_category') }}</h2>
          <button @click="showCategoryModal = false" class="btn btn-ghost" style="padding:8px;border-radius:8px">✕</button>
        </div>
        <form @submit.prevent="saveCategory">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.category_name_en') }} *</label>
              <input v-model="categoryForm.name_en" type="text" class="lux-input" placeholder="e.g., Fashion" 
                :style="formErrors.name_en ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.name_en = ''" />
              <div v-if="formErrors.name_en" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.name_en }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.category_name_ar') }} *</label>
              <input v-model="categoryForm.name_ar" type="text" class="lux-input" placeholder="مثال: الأزياء" dir="rtl" 
                :style="formErrors.name_ar ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.name_ar = ''" />
              <div v-if="formErrors.name_ar" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.name_ar }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.description_en') }}</label>
              <textarea v-model="categoryForm.description_en" class="lux-input" rows="2" placeholder="English description"
                :style="formErrors.description_en ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.description_en = ''"></textarea>
              <div v-if="formErrors.description_en" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.description_en }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.description_ar') }}</label>
              <textarea v-model="categoryForm.description_ar" class="lux-input" rows="2" placeholder="الوصف بالعربية" dir="rtl"
                :style="formErrors.description_ar ? 'border-radius:10px;border-color:var(--danger)' : 'border-radius:10px'" 
                @input="formErrors.description_ar = ''"></textarea>
              <div v-if="formErrors.description_ar" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.description_ar }}</div>
            </div>
            <div>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                <input type="checkbox" v-model="categoryForm.active" style="width:18px;height:18px;cursor:pointer" />
                <span style="font-size:14px;font-weight:600;color:var(--text)">{{ t('dashboard.admin.active') }}</span>
              </label>
            </div>
            <div style="display:flex;gap:12px;margin-top:8px">
              <button type="button" @click="showCategoryModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">{{ t('dashboard.admin.cancel') }}</button>
              <button type="submit" :disabled="saving" class="btn btn-gold" style="flex:1;border-radius:10px">
                {{ saving ? t('dashboard.admin.saving') : (editingCategory ? t('dashboard.admin.update') : t('dashboard.admin.create')) }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="modal-overlay" @click.self="showDeleteConfirmModal = false">
      <div class="modal-content lux-card" style="max-width:500px;width:90%">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:64px;margin-bottom:16px">⚠️</div>
          <h2 style="font-size:24px;font-weight:900;color:var(--danger);margin-bottom:8px">{{ t('dashboard.admin.delete_category') }}</h2>
          <p style="color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.delete_category_confirm') }}</p>
          <p style="color:var(--text);font-weight:700;font-size:18px">{{ categoryToDelete?.name }}</p>
          <p style="color:var(--text-muted);font-size:14px;margin-top:8px">{{ t('dashboard.admin.delete_category_warning') }}</p>
        </div>
        
        <div style="display:flex;gap:12px">
          <button @click="showDeleteConfirmModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">{{ t('dashboard.admin.cancel') }}</button>
          <button @click="confirmDelete" :disabled="deleting" class="btn" style="flex:1;border-radius:10px;background:var(--danger);color:white;border:none">
            {{ deleting ? t('dashboard.admin.deleting') : t('dashboard.admin.delete_category') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const { success, error: showError } = useToast()

const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showCategoryModal = ref(false)
const editingCategory = ref(null)
const saving = ref(false)
const showDeleteConfirmModal = ref(false)
const categoryToDelete = ref(null)
const deleting = ref(false)

const categoryForm = ref({
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  active: true
})

const formErrors = ref({
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: ''
})

onMounted(() => {
  loadCategories()
})

async function loadCategories() {
  loading.value = true
  try {
    const response = await axios.get('/categories')
    categories.value = response.data.data || response.data
  } catch (err) {
    console.error('Error loading categories:', err)
    showError('Failed to Load Categories', err.response?.data?.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}

const filteredCategories = computed(() => {
  return categories.value.filter(category => {
    if (!searchQuery.value.trim()) return true
    
    const query = searchQuery.value.toLowerCase()
    const matchesName = (category.name_en && category.name_en.toLowerCase().includes(query)) ||
                       (category.name_ar && category.name_ar.toLowerCase().includes(query)) ||
                       (category.name && category.name.toLowerCase().includes(query))
    const matchesDesc = (category.description_en && category.description_en.toLowerCase().includes(query)) ||
                       (category.description_ar && category.description_ar.toLowerCase().includes(query)) ||
                       (category.description && category.description.toLowerCase().includes(query))
    
    return matchesName || matchesDesc
  })
})

function validateForm() {
  formErrors.value = {
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: ''
  }
  
  let isValid = true
  
  if (!categoryForm.value.name_en || categoryForm.value.name_en.trim().length < 2) {
    formErrors.value.name_en = t('dashboard.admin.validation_name_en')
    isValid = false
  }
  
  if (!categoryForm.value.name_ar || categoryForm.value.name_ar.trim().length < 2) {
    formErrors.value.name_ar = t('dashboard.admin.validation_name_ar')
    isValid = false
  }
  
  return isValid
}

async function saveCategory() {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  try {
    // Prepare data with 'name' field for backend compatibility
    const categoryData = {
      ...categoryForm.value,
      name: categoryForm.value.name_en, // Backend expects 'name' field
      description: categoryForm.value.description_en || categoryForm.value.description_ar
    }
    
    if (editingCategory.value) {
      await axios.put(`/categories/${editingCategory.value.id}`, categoryData)
      success('Category Updated Successfully', `${categoryForm.value.name_en} has been updated`)
    } else {
      await axios.post('/categories', categoryData)
      success('Category Created Successfully', `${categoryForm.value.name_en} has been added`)
    }
    showCategoryModal.value = false
    resetForm()
    await loadCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    const errorMessage = error.response?.data?.message || 'Failed to save category'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      
      // Map backend errors to form fields
      if (errors.name) formErrors.value.name_en = errors.name[0]
      if (errors.name_en) formErrors.value.name_en = errors.name_en[0]
      if (errors.name_ar) formErrors.value.name_ar = errors.name_ar[0]
      if (errors.description) formErrors.value.description_en = errors.description[0]
      if (errors.description_en) formErrors.value.description_en = errors.description_en[0]
      if (errors.description_ar) formErrors.value.description_ar = errors.description_ar[0]
      
      // Show all errors in toast
      const errorMessages = Object.values(errors).flat().join(', ')
      showError('Validation Error', errorMessages)
    } else {
      showError('Error', errorMessage)
    }
  } finally {
    saving.value = false
  }
}

function openCategoryModal(category = null) {
  editingCategory.value = category
  if (category) {
    categoryForm.value = {
      name_en: category.name_en || category.name || '',
      name_ar: category.name_ar || '',
      description_en: category.description_en || category.description || '',
      description_ar: category.description_ar || '',
      active: category.active ?? true
    }
  } else {
    resetForm()
  }
  showCategoryModal.value = true
}

function resetForm() {
  categoryForm.value = {
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    active: true
  }
  formErrors.value = {
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: ''
  }
  editingCategory.value = null
}

async function toggleActive(category) {
  try {
    const newActiveStatus = !category.active
    await axios.put(`/categories/${category.id}`, {
      ...category,
      active: newActiveStatus
    })
    
    // Update only the specific category in local state
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value[index].active = newActiveStatus
    }
    
    const newStatus = newActiveStatus ? 'activated' : 'deactivated'
    const categoryName = category.name_en || category.name || 'Category'
    success('Status Updated', `${categoryName} has been ${newStatus}`)
  } catch (error) {
    console.error('Error toggling category status:', error)
    showError('Error', 'Failed to update category status')
  }
}

function openDeleteModal(category) {
  categoryToDelete.value = category
  showDeleteConfirmModal.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await axios.delete(`/categories/${categoryToDelete.value.id}`)
    success('Category Deleted', `${categoryToDelete.value.name} has been deleted successfully`)
    showDeleteConfirmModal.value = false
    categoryToDelete.value = null
    await loadCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    showError('Error', error.response?.data?.message || 'Failed to delete category')
  } finally {
    deleting.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal-content {
  position: relative;
  z-index: 1001;
}
</style>
