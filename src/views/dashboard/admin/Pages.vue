<template>
  <div style="padding:24px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <div>
        <h1 style="font-size:28px;font-weight:800;color:var(--text);margin-bottom:6px">{{ t('dashboard.admin.pages_management') }}</h1>
        <p style="color:var(--text-muted);font-size:14px">{{ t('dashboard.admin.pages_desc') }}</p>
      </div>
      <button @click="openPageModal()" class="btn btn-gold" style="border-radius:10px">
        <span style="margin-right:6px">+</span>
        {{ t('dashboard.admin.add_page') }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted)">{{ t('common.loading') }}...</p>
    </div>

    <div v-else class="lux-card" style="padding:0;overflow:hidden">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border-white);display:flex;gap:12px;flex-wrap:wrap">
        <input type="text" v-model="searchQuery" :placeholder="t('common.search')" class="lux-input" style="flex:1;min-width:200px;border-radius:10px" />
      </div>
      <div style="overflow-x:auto">
        <div v-if="filteredPages.length > 0">
          <table class="lux-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{{ t('dashboard.admin.page_title') }}</th>
                <th>{{ t('dashboard.admin.slug') }}</th>
                <th>{{ t('common.status') }}</th>
                <th>{{ t('dashboard.admin.order') }}</th>
                <th>{{ t('dashboard.admin.created') }}</th>
                <th>{{ t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="page in filteredPages" :key="page.id">
                <td><span style="font-family:monospace;color:var(--gold)">#{{ page.id }}</span></td>
                <td style="font-weight:600">{{ locale === 'ar' ? page.title_ar : page.title_en }}</td>
                <td><code style="background:var(--surface2);padding:2px 8px;border-radius:4px;font-size:12px">{{ page.slug }}</code></td>
                <td>
                  <span class="lux-badge" :class="page.active ? 'badge-green' : 'badge-red'">
                    {{ page.active ? t('dashboard.admin.active') : t('dashboard.admin.inactive') }}
                  </span>
                </td>
                <td><span style="color:var(--gold);font-weight:700">{{ page.order }}</span></td>
                <td style="color:var(--text-muted)">{{ formatDate(page.created_at) }}</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button @click="openPageModal(page)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px">✏️</button>
                    <button @click="toggleActive(page)" class="btn btn-ghost btn-sm" style="border-radius:8px;padding:6px 10px" :title="page.active ? t('dashboard.admin.deactivate') : t('dashboard.admin.activate')">
                      {{ page.active ? '✓' : '✕' }}
                    </button>
                    <button @click="openDeleteModal(page)" class="btn btn-sm" style="border-radius:8px;padding:6px 10px;background:rgba(224,92,92,0.1);color:var(--danger);border:1px solid rgba(224,92,92,0.2)">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-16">
          <div style="font-size:64px;margin-bottom:16px;opacity:0.3">📄</div>
          <div style="font-size:18px;font-weight:700;color:var(--text-muted);margin-bottom:6px">{{ t('dashboard.admin.no_pages') }}</div>
          <div style="font-size:14px;color:var(--text-dim)">{{ t('dashboard.admin.no_pages_desc') }}</div>
        </div>
      </div>
    </div>

    <!-- Page Modal -->
    <div v-if="showPageModal" class="modal-overlay" @click.self="showPageModal = false">
      <div class="modal-content" style="max-width:900px;max-height:90vh;overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h2 style="font-size:22px;font-weight:800;color:var(--text)">{{ editingPage ? t('dashboard.admin.edit_page') : t('dashboard.admin.add_page') }}</h2>
          <button @click="showPageModal = false" class="btn btn-ghost" style="width:36px;height:36px;padding:0;border-radius:50%">✕</button>
        </div>
        <form @submit.prevent="savePage">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.page_title_en') }} *</label>
              <input v-model="pageForm.title_en" type="text" required class="lux-input" style="border-radius:10px" :placeholder="t('dashboard.admin.page_title_en_placeholder')" 
                :style="formErrors.title_en ? 'border-color:var(--danger)' : ''" 
                @input="formErrors.title_en = ''" />
              <div v-if="formErrors.title_en" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.title_en }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.page_title_ar') }} *</label>
              <input v-model="pageForm.title_ar" type="text" required class="lux-input" style="border-radius:10px" :placeholder="t('dashboard.admin.page_title_ar_placeholder')" dir="rtl"
                :style="formErrors.title_ar ? 'border-color:var(--danger)' : ''" 
                @input="formErrors.title_ar = ''" />
              <div v-if="formErrors.title_ar" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.title_ar }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.slug') }}</label>
              <input v-model="pageForm.slug" type="text" class="lux-input" style="border-radius:10px;font-family:monospace" :placeholder="t('dashboard.admin.slug_placeholder')" 
                :style="formErrors.slug ? 'border-color:var(--danger)' : ''" 
                @input="formErrors.slug = ''" />
              <div style="font-size:12px;color:var(--text-muted);margin-top:4px">{{ t('dashboard.admin.slug_help') }}</div>
              <div v-if="formErrors.slug" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.slug }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.content_en') }} *</label>
              <RichTextEditor 
                v-model="pageForm.content_en" 
                :placeholder="t('dashboard.admin.content_en_placeholder')"
                height="400px"
                @update:modelValue="formErrors.content_en = ''"
              />
              <div v-if="formErrors.content_en" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.content_en }}</div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.content_ar') }} *</label>
              <RichTextEditor 
                v-model="pageForm.content_ar" 
                :placeholder="t('dashboard.admin.content_ar_placeholder')"
                height="400px"
                @update:modelValue="formErrors.content_ar = ''"
              />
              <div v-if="formErrors.content_ar" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formErrors.content_ar }}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div>
                <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.meta_desc_en') }}</label>
                <input v-model="pageForm.meta_description_en" type="text" class="lux-input" style="border-radius:10px" :placeholder="t('dashboard.admin.meta_desc_placeholder')" />
              </div>
              <div>
                <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.meta_desc_ar') }}</label>
                <input v-model="pageForm.meta_description_ar" type="text" class="lux-input" style="border-radius:10px" :placeholder="t('dashboard.admin.meta_desc_placeholder')" dir="rtl" />
              </div>
            </div>
            <div>
              <label style="display:block;font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">{{ t('dashboard.admin.order') }}</label>
              <input v-model.number="pageForm.order" type="number" class="lux-input" style="border-radius:10px" :placeholder="t('dashboard.admin.order_placeholder')" />
            </div>
            <div>
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                <input type="checkbox" v-model="pageForm.active" style="width:18px;height:18px;cursor:pointer" />
                <span style="font-size:14px;font-weight:600;color:var(--text)">{{ t('dashboard.admin.active') }}</span>
              </label>
            </div>
            <div style="display:flex;gap:12px;margin-top:8px">
              <button type="button" @click="showPageModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">{{ t('dashboard.admin.cancel') }}</button>
              <button type="submit" :disabled="saving" class="btn btn-gold" style="flex:1;border-radius:10px">
                {{ saving ? t('dashboard.admin.saving') : (editingPage ? t('dashboard.admin.update') : t('dashboard.admin.create')) }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="modal-overlay" @click.self="showDeleteConfirmModal = false">
      <div class="modal-content" style="max-width:400px">
        <h2 style="font-size:20px;font-weight:800;color:var(--text);margin-bottom:16px">{{ t('dashboard.admin.confirm_delete') }}</h2>
        <p style="color:var(--text-muted);margin-bottom:24px">{{ t('dashboard.admin.delete_page_confirm') }} <strong>{{ pageToDelete?.title_en }}</strong>?</p>
        <div style="display:flex;gap:12px">
          <button @click="showDeleteConfirmModal = false" class="btn btn-ghost" style="flex:1;border-radius:10px">{{ t('dashboard.admin.cancel') }}</button>
          <button @click="confirmDelete" :disabled="deleting" class="btn" style="flex:1;border-radius:10px;background:var(--danger);color:white">
            {{ deleting ? t('dashboard.admin.deleting') : t('dashboard.admin.delete') }}
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
import RichTextEditor from '@/components/RichTextEditor.vue'

const { t, locale } = useI18n()
const { success, error: showError } = useToast()

const pages = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showPageModal = ref(false)
const editingPage = ref(null)
const saving = ref(false)
const showDeleteConfirmModal = ref(false)
const pageToDelete = ref(null)
const deleting = ref(false)

const pageForm = ref({
  title_en: '',
  title_ar: '',
  slug: '',
  content_en: '',
  content_ar: '',
  meta_description_en: '',
  meta_description_ar: '',
  order: 0,
  active: true
})

const formErrors = ref({
  title_en: '',
  title_ar: '',
  slug: '',
  content_en: '',
  content_ar: ''
})

onMounted(() => {
  loadPages()
})

async function loadPages() {
  loading.value = true
  try {
    const response = await axios.get('/pages')
    pages.value = response.data.data || response.data
  } catch (err) {
    console.error('Error loading pages:', err)
    showError(t('common.failed_to_load') + ' ' + t('dashboard.admin.pages'), err.response?.data?.message || t('common.error'))
  } finally {
    loading.value = false
  }
}

const filteredPages = computed(() => {
  return pages.value.filter(page => {
    if (!searchQuery.value.trim()) return true
    
    const query = searchQuery.value.toLowerCase()
    return page.title_en.toLowerCase().includes(query) ||
           page.title_ar.includes(query) ||
           page.slug.toLowerCase().includes(query)
  })
})

function validateForm() {
  let isValid = true
  formErrors.value = {
    title_en: '',
    title_ar: '',
    slug: '',
    content_en: '',
    content_ar: ''
  }

  if (!pageForm.value.title_en.trim()) {
    formErrors.value.title_en = t('dashboard.admin.title_required')
    isValid = false
  }

  if (!pageForm.value.title_ar.trim()) {
    formErrors.value.title_ar = t('dashboard.admin.title_required')
    isValid = false
  }

  if (!pageForm.value.content_en.trim()) {
    formErrors.value.content_en = t('dashboard.admin.content_required')
    isValid = false
  }

  if (!pageForm.value.content_ar.trim()) {
    formErrors.value.content_ar = t('dashboard.admin.content_required')
    isValid = false
  }

  return isValid
}

async function savePage() {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  try {
    const pageData = { ...pageForm.value }
    
    if (editingPage.value) {
      await axios.put(`/pages/${editingPage.value.id}`, pageData)
      success(t('common.page_updated'), `${pageForm.value.title_en} ${t('common.page_updated_msg')}`)
    } else {
      await axios.post('/pages', pageData)
      success(t('common.page_created'), `${pageForm.value.title_en} ${t('common.page_created_msg')}`)
    }
    showPageModal.value = false
    resetForm()
    await loadPages()
  } catch (error) {
    console.error('Error saving page:', error)
    const errorMessage = error.response?.data?.message || 'Failed to save page'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      
      if (errors.title_en) formErrors.value.title_en = errors.title_en[0]
      if (errors.title_ar) formErrors.value.title_ar = errors.title_ar[0]
      if (errors.slug) formErrors.value.slug = errors.slug[0]
      if (errors.content_en) formErrors.value.content_en = errors.content_en[0]
      if (errors.content_ar) formErrors.value.content_ar = errors.content_ar[0]
      
      const errorMessages = Object.values(errors).flat().join(', ')
      showError(t('common.validation_error'), errorMessages)
    } else {
      showError(t('common.error_title'), errorMessage)
    }
  } finally {
    saving.value = false
  }
}

function openPageModal(page = null) {
  editingPage.value = page
  if (page) {
    pageForm.value = {
      title_en: page.title_en || '',
      title_ar: page.title_ar || '',
      slug: page.slug || '',
      content_en: page.content_en || '',
      content_ar: page.content_ar || '',
      meta_description_en: page.meta_description_en || '',
      meta_description_ar: page.meta_description_ar || '',
      order: page.order || 0,
      active: page.active ?? true
    }
  } else {
    resetForm()
  }
  showPageModal.value = true
}

function resetForm() {
  pageForm.value = {
    title_en: '',
    title_ar: '',
    slug: '',
    content_en: '',
    content_ar: '',
    meta_description_en: '',
    meta_description_ar: '',
    order: 0,
    active: true
  }
  formErrors.value = {
    title_en: '',
    title_ar: '',
    slug: '',
    content_en: '',
    content_ar: ''
  }
  editingPage.value = null
}

async function toggleActive(page) {
  try {
    const newActiveStatus = !page.active
    await axios.put(`/pages/${page.id}`, {
      active: newActiveStatus
    })
    
    const index = pages.value.findIndex(p => p.id === page.id)
    if (index !== -1) {
      pages.value[index].active = newActiveStatus
    }
    
    const newStatus = newActiveStatus ? 'activated' : 'deactivated'
    const pageName = page.title_en || page.title_ar || 'Page'
    success(t('common.status_updated'), `${pageName} has been ${newStatus}`)
  } catch (error) {
    console.error('Error toggling page status:', error)
    showError(t('common.error_title'), t('common.failed_update_status'))
  }
}

function openDeleteModal(page) {
  pageToDelete.value = page
  showDeleteConfirmModal.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await axios.delete(`/pages/${pageToDelete.value.id}`)
    success(t('common.page_deleted'), `${pageToDelete.value.title_en} ${t('common.page_deleted_success')}`)
    showDeleteConfirmModal.value = false
    pageToDelete.value = null
    await loadPages()
  } catch (error) {
    console.error('Error deleting page:', error)
    showError(t('common.error_title'), error.response?.data?.message || t('common.failed_to_load'))
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--surface);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
</style>
