<template>
  <Transition name="toast">
    <div v-if="visible" class="toast-container" :class="`toast-${type}`">
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div v-if="message" class="toast-message">{{ message }}</div>
      </div>
      <button @click="close" class="toast-close">✕</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: String,
  message: String,
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const visible = ref(props.show)
let timeout = null

watch(() => props.show, (newVal) => {
  visible.value = newVal
  if (newVal && props.duration > 0) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

function close() {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  background: var(--surface2);
  border: 1px solid var(--border-white);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  min-width: 320px;
  max-width: 450px;
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  background: rgba(46, 213, 115, 0.15);
  color: #2ed573;
}

.toast-error .toast-icon {
  background: rgba(224, 92, 92, 0.15);
  color: var(--danger);
}

.toast-warning .toast-icon {
  background: rgba(255, 195, 18, 0.15);
  color: #ffc312;
}

.toast-info .toast-icon {
  background: rgba(209, 177, 110, 0.15);
  color: var(--gold);
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
}

.toast-message {
  font-size: 13px;
  color: var(--text-muted);
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}

.toast-close:hover {
  color: var(--text);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
