<template>
  <div class="toast-container-wrapper">
    <TransitionGroup name="toast-list">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-${toast.type}`"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✕</span>
          <span v-else-if="toast.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
        </div>
        
        <!-- Confirm buttons -->
        <div v-if="toast.isConfirm" class="toast-confirm-actions">
          <button @click="toast.onConfirm" class="toast-btn toast-btn-confirm">Yes</button>
          <button @click="toast.onCancel" class="toast-btn toast-btn-cancel">No</button>
        </div>
        
        <!-- Close button -->
        <button v-else @click="removeToast(toast.id)" class="toast-close">✕</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container-wrapper {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast-item {
  pointer-events: all;
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

.toast-confirm-actions {
  display: flex;
  gap: 8px;
}

.toast-btn {
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}

.toast-btn-confirm {
  background: var(--gold);
  color: var(--obsidian);
  border-color: var(--gold);
}

.toast-btn-confirm:hover {
  background: var(--gold-light);
}

.toast-btn-cancel {
  background: transparent;
  color: var(--text-muted);
  border-color: var(--border-white);
}

.toast-btn-cancel:hover {
  background: var(--surface3);
  color: var(--text);
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
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--text);
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .toast-container-wrapper {
    left: 16px;
    right: 16px;
    top: 16px;
  }
  
  .toast-item {
    min-width: auto;
    max-width: none;
  }
}
</style>
