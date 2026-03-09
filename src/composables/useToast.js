import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  function showToast(type, title, message = '', duration = 3000) {
    const id = toastId++
    const toast = {
      id,
      type,
      title,
      message,
      duration,
      visible: true
    }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function success(title, message = '', duration = 3000) {
    return showToast('success', title, message, duration)
  }
  
  function error(title, message = '', duration = 4000) {
    return showToast('error', title, message, duration)
  }
  
  function warning(title, message = '', duration = 3500) {
    return showToast('warning', title, message, duration)
  }
  
  function info(title, message = '', duration = 3000) {
    return showToast('info', title, message, duration)
  }
  
  function confirm(title, message = '') {
    return new Promise((resolve) => {
      const id = toastId++
      const toast = {
        id,
        type: 'warning',
        title,
        message,
        duration: 0,
        visible: true,
        isConfirm: true,
        onConfirm: () => {
          removeToast(id)
          resolve(true)
        },
        onCancel: () => {
          removeToast(id)
          resolve(false)
        }
      }
      
      toasts.value.push(toast)
    })
  }
  
  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    confirm
  }
}
