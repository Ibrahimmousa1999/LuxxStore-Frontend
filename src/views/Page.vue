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

.page-content :deep(p) {
  margin-bottom: 16px;
  color: var(--text-muted);
}

.page-content :deep(ul),
.page-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
  color: var(--text-muted);
}

.page-content :deep(li) {
  margin-bottom: 8px;
}

.page-content :deep(a) {
  color: var(--gold);
  text-decoration: underline;
  transition: opacity 0.2s;
}

.page-content :deep(a:hover) {
  opacity: 0.8;
}

.page-content :deep(strong) {
  color: var(--text);
  font-weight: 700;
}

.page-content :deep(code) {
  background: var(--surface2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
}

.page-content :deep(blockquote) {
  border-left: 4px solid var(--gold);
  padding-left: 20px;
  margin: 24px 0;
  font-style: italic;
  color: var(--text-muted);
}
</style>
