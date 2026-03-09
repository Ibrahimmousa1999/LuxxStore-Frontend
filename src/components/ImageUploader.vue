<template>
  <div class="image-uploader">
    <!-- Main Image Upload -->
    <div class="upload-section">
      <label class="upload-label">{{ t('dashboard.admin.main_product_image') }} *</label>
      <div 
        class="upload-area" 
        :class="{ 'dragging': isDragging, 'has-image': mainImage }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop($event, 'main')"
        @click="!mainImage && $refs.mainInput.click()"
      >
        <div v-if="!mainImage" class="upload-placeholder">
          <div class="upload-icon">📸</div>
          <p class="upload-text">{{ t('dashboard.admin.drag_drop_upload') }}</p>
          <p class="upload-hint">{{ t('dashboard.admin.image_format_hint') }}</p>
        </div>
        <div v-else class="image-preview">
          <img :src="mainImage" alt="Main product image" @error="handleImageError" />
          <div class="image-overlay">
            <button type="button" @click.stop="removeImage('main')" class="btn-remove">
              <span>✕</span>
            </button>
            <button type="button" @click.stop="$refs.mainInput.click()" class="btn-change">
              <span>🔄</span>
            </button>
          </div>
          <div v-if="imageError" class="image-error">
            <p>⚠️ {{ t('dashboard.admin.image_failed_load') }}</p>
          </div>
        </div>
        <input 
          ref="mainInput"
          type="file" 
          accept="image/*" 
          @change="handleFileSelect($event, 'main')"
          style="display: none"
        />
      </div>
      <div v-if="uploadingMain" class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <p class="progress-text">{{ t('dashboard.admin.uploading') }} {{ uploadProgress }}%</p>
      </div>
    </div>

    <!-- Gallery Images Upload -->
    <div class="upload-section">
      <label class="upload-label">{{ t('dashboard.admin.gallery_images') }}</label>
      <div class="gallery-grid">
        <!-- Existing gallery images -->
        <div v-for="(image, index) in galleryImages" :key="index" class="gallery-item">
          <img :src="image" alt="Gallery image" />
          <div class="image-overlay">
            <button type="button" @click="removeGalleryImage(index)" class="btn-remove">
              <span>✕</span>
            </button>
            <button type="button" @click="setAsMain(image, index)" class="btn-main" :title="t('dashboard.admin.set_as_main')">
              <span>⭐</span>
            </button>
          </div>
        </div>
        
        <!-- Add more button -->
        <div 
          v-if="galleryImages.length < 5"
          class="gallery-add"
          @click="$refs.galleryInput.click()"
        >
          <div class="add-icon">+</div>
          <p class="add-text">{{ t('dashboard.admin.add_image') }}</p>
        </div>
      </div>
      <input 
        ref="galleryInput"
        type="file" 
        accept="image/*" 
        multiple
        @change="handleFileSelect($event, 'gallery')"
        style="display: none"
      />
      <p class="upload-hint" style="margin-top: 8px">{{ t('dashboard.admin.gallery_limit') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()

const { error } = useToast()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ main: '', gallery: [] })
  }
})

const emit = defineEmits(['update:modelValue'])

const isDragging = ref(false)
const uploadingMain = ref(false)
const uploadProgress = ref(0)
const imageError = ref(false)
const mainImage = ref(props.modelValue.main || '')
const galleryImages = ref(props.modelValue.gallery || [])

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  mainImage.value = newVal.main || ''
  galleryImages.value = newVal.gallery || []
}, { deep: true })

// Emit changes
function emitUpdate() {
  emit('update:modelValue', {
    main: mainImage.value,
    gallery: [...galleryImages.value]
  })
}

function handleDrop(event, type) {
  isDragging.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    uploadFiles(files, type)
  }
}

function handleFileSelect(event, type) {
  const files = event.target.files
  if (files.length > 0) {
    uploadFiles(files, type)
  }
}

async function uploadFiles(files, type) {
  const validFiles = Array.from(files).filter(file => {
    const isImage = file.type.startsWith('image/')
    const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
    return isImage && isValidSize
  })

  if (validFiles.length === 0) {
    error('Invalid Files', 'Please select valid image files (max 5MB each)')
    return
  }

  for (const file of validFiles) {
    await uploadFile(file, type)
  }
}

async function uploadFile(file, type) {
  const formData = new FormData()
  formData.append('image', file)

  try {
    if (type === 'main') {
      uploadingMain.value = true
      uploadProgress.value = 0
    }

    const token = localStorage.getItem('token')
    const response = await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })

    if (response.data.success) {
      if (type === 'main') {
        mainImage.value = response.data.url
      } else {
        if (galleryImages.value.length < 5) {
          galleryImages.value.push(response.data.url)
        }
      }
      emitUpdate()
    }
  } catch (err) {
    console.error('Upload error:', err)
    error('Upload Failed', 'Failed to upload image. Please try again.')
  } finally {
    if (type === 'main') {
      uploadingMain.value = false
      uploadProgress.value = 0
    }
  }
}

function removeImage(type) {
  if (type === 'main') {
    mainImage.value = ''
    emitUpdate()
  }
}

function removeGalleryImage(index) {
  galleryImages.value.splice(index, 1)
  emitUpdate()
}

function setAsMain(image, index) {
  // Swap main image with gallery image
  const oldMain = mainImage.value
  mainImage.value = image
  if (oldMain) {
    galleryImages.value[index] = oldMain
  } else {
    galleryImages.value.splice(index, 1)
  }
  emitUpdate()
}

function handleImageError(event) {
  console.error('Image failed to load:', mainImage.value)
  imageError.value = true
  // Try to reload the image after a short delay
  setTimeout(() => {
    imageError.value = false
    event.target.src = mainImage.value + '?t=' + Date.now()
  }, 1000)
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.upload-area {
  position: relative;
  border: 2px dashed var(--border-white);
  border-radius: 12px;
  background: var(--surface2);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.upload-area:hover {
  border-color: var(--gold);
  background: var(--surface3);
}

.upload-area.dragging {
  border-color: var(--gold);
  background: var(--surface3);
  transform: scale(1.02);
}

.upload-area.has-image {
  cursor: default;
  border-style: solid;
}

.upload-placeholder {
  text-align: center;
  padding: 32px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 13px;
  color: var(--text-muted);
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay,
.gallery-item:hover .image-overlay {
  opacity: 1;
}

.btn-remove,
.btn-change,
.btn-main {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--danger);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-change {
  background: var(--gold);
}

.btn-main {
  background: var(--gold);
}

.btn-remove:hover {
  background: #c23030;
  transform: scale(1.1);
}

.btn-change:hover,
.btn-main:hover {
  background: var(--gold-dark);
  transform: scale(1.1);
}

.upload-progress {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--surface2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-dark), var(--gold));
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-white);
  background: var(--surface2);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-add {
  aspect-ratio: 1;
  border: 2px dashed var(--border-white);
  border-radius: 10px;
  background: var(--surface2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.gallery-add:hover {
  border-color: var(--gold);
  background: var(--surface3);
}

.add-icon {
  font-size: 32px;
  color: var(--gold);
  margin-bottom: 4px;
}

.add-text {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.image-error {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(224, 92, 92, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
</style>
