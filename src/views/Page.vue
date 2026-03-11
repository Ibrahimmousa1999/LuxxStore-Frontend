<template>
  <div style="min-height:100vh;background:var(--obsidian)">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-32">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style="border-color:var(--gold)"></div>
      <p style="color:var(--text-muted);font-size:14px">{{ t('common.loading') }}...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-32">
      <div style="font-size:64px;margin-bottom:16px;opacity:0.3">📄</div>
      <div style="font-size:24px;font-weight:700;color:var(--text-muted);margin-bottom:8px">{{ t('pages.not_found') }}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-bottom:24px">{{ t('pages.not_found_desc') }}</div>
      <router-link to="/" class="btn btn-gold">{{ t('pages.back_home') }}</router-link>
    </div>

    <!-- Page Content -->
    <div v-else-if="page" class="lux-section">
      <div class="lux-card" style="max-width:900px;margin:0 auto;padding:48px">
        <!-- Page Title -->
        <h1 style="font-size:clamp(32px,5vw,48px);font-weight:900;color:var(--text);margin-bottom:16px;font-family:'Playfair Display',serif">
          {{ locale === 'ar' ? page.title_ar : page.title_en }}
        </h1>
        
        <!-- Meta Info -->
        <div style="display:flex;align-items:center;gap:16px;padding-bottom:24px;margin-bottom:32px;border-bottom:1px solid var(--border-white)">
          <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted)">
            <span>📅</span>
            <span>{{ formatDate(page.updated_at || page.created_at) }}</span>
          </div>
        </div>

        <!-- Page Content -->
        <div 
          class="page-content"
          v-html="locale === 'ar' ? page.content_ar : page.content_en"
        ></div>

        <!-- Back Button -->
        <div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border-white)">
          <router-link to="/" class="btn btn-outline">{{ t('pages.back_home') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from '@/utils/axios'

const route = useRoute()
const { t, locale } = useI18n()

const page = ref(null)
const loading = ref(true)
const error = ref(false)

async function loadPage() {
  loading.value = true
  error.value = false
  try {
    const response = await axios.get(`/pages/${route.params.slug}`)
    page.value = response.data
    
    // Set page title and meta description
    if (page.value) {
      const title = locale.value === 'ar' ? page.value.title_ar : page.value.title_en
      const metaDesc = locale.value === 'ar' ? page.value.meta_description_ar : page.value.meta_description_en
      
      document.title = `${title} - LuxStore`
      
      if (metaDesc) {
        let metaTag = document.querySelector('meta[name="description"]')
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.name = 'description'
          document.head.appendChild(metaTag)
        }
        metaTag.content = metaDesc
      }
    }
  } catch (err) {
    console.error('Error loading page:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadPage()
})

watch(() => route.params.slug, () => {
  if (route.params.slug) {
    loadPage()
  }
})
</script>

<style scoped>
.page-content {
  color: var(--text);
  line-height: 1.8;
  font-size: 16px;
}

.page-content :deep(h1) {
  font-size: 40px;
  font-weight: 900;
  color: var(--text);
  margin-top: 48px;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
  border-bottom: 2px solid var(--gold);
  padding-bottom: 12px;
}

.page-content :deep(h2) {
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
  margin-top: 40px;
  margin-bottom: 16px;
  font-family: 'Playfair Display', serif;
}

.page-content :deep(h3) {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin-top: 32px;
  margin-bottom: 12px;
}

.page-content :deep(h4) {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  margin-top: 24px;
  margin-bottom: 10px;
}

.page-content :deep(h5) {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-top: 20px;
  margin-bottom: 8px;
}

.page-content :deep(h6) {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 16px;
  margin-bottom: 8px;
}

.page-content :deep(p) {
  margin-bottom: 16px;
  color: var(--text-muted);
  line-height: 1.8;
}

.page-content :deep(ul),
.page-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
  color: var(--text-muted);
}

.page-content :deep(li) {
  margin-bottom: 8px;
  line-height: 1.7;
}

.page-content :deep(a) {
  color: var(--gold);
  text-decoration: underline;
  transition: all 0.2s;
}

.page-content :deep(a:hover) {
  opacity: 0.8;
  color: var(--gold);
}

.page-content :deep(strong),
.page-content :deep(b) {
  color: var(--text);
  font-weight: 700;
}

.page-content :deep(em),
.page-content :deep(i) {
  font-style: italic;
  color: var(--text);
}

.page-content :deep(u) {
  text-decoration: underline;
}

.page-content :deep(s),
.page-content :deep(strike) {
  text-decoration: line-through;
  opacity: 0.7;
}

.page-content :deep(code) {
  background: var(--surface2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: var(--gold);
}

.page-content :deep(pre) {
  background: var(--surface2);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid var(--border-white);
}

.page-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: var(--text);
}

.page-content :deep(blockquote) {
  border-left: 4px solid var(--gold);
  padding-left: 20px;
  margin: 24px 0;
  font-style: italic;
  color: var(--text-muted);
  background: var(--surface2);
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
}

.page-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 24px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.page-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  background: var(--surface2);
  border-radius: 8px;
  overflow: hidden;
}

.page-content :deep(th) {
  background: var(--surface);
  color: var(--gold);
  font-weight: 700;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid var(--border-white);
}

.page-content :deep(td) {
  padding: 12px;
  border-bottom: 1px solid var(--border-white);
  color: var(--text-muted);
}

.page-content :deep(tr:last-child td) {
  border-bottom: none;
}

.page-content :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
  margin: 32px 0;
}

/* Quill editor specific styles */
.page-content :deep(.ql-align-center) {
  text-align: center;
}

.page-content :deep(.ql-align-right) {
  text-align: right;
}

.page-content :deep(.ql-align-justify) {
  text-align: justify;
}

.page-content :deep(.ql-indent-1) {
  padding-left: 3em;
}

.page-content :deep(.ql-indent-2) {
  padding-left: 6em;
}

.page-content :deep(.ql-indent-3) {
  padding-left: 9em;
}
</style>
