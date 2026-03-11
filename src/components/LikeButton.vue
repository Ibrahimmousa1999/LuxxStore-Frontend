<template>
  <button 
    @click.prevent="toggleLike" 
    :disabled="loading"
    class="like-btn"
    :class="{ 'liked': isLiked, 'loading': loading }"
    :title="isLiked ? t('product.unlike') : t('product.like')"
  >
    <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
        :fill="isLiked ? 'currentColor' : 'none'"
        :stroke="isLiked ? 'none' : 'currentColor'"
        stroke-width="2"
      />
    </svg>
    <div v-else class="spinner"></div>
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import axios from '@/utils/axios'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  initialLiked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['liked', 'unliked'])

const { t } = useI18n()
const authStore = useAuthStore()
const isLiked = ref(props.initialLiked)
const loading = ref(false)

async function toggleLike() {
  if (!authStore.isAuthenticated) {
    // Show login prompt or redirect to login
    alert(t('product.login_to_like'))
    return
  }

  loading.value = true
  try {
    if (isLiked.value) {
      // Unlike
      await axios.delete(`/products/${props.productId}/like`)
      isLiked.value = false
      emit('unliked', props.productId)
    } else {
      // Like
      await axios.post(`/products/${props.productId}/like`)
      isLiked.value = true
      emit('liked', props.productId)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.like-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--text-muted);
  position: relative;
}

.like-btn:hover {
  background: rgba(201, 168, 76, 0.1);
  color: var(--gold);
  transform: scale(1.1);
}

.like-btn.liked {
  color: var(--gold);
  animation: heartbeat 0.3s ease;
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--text-muted);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
