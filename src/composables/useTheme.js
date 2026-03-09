import { ref, watch } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'dark')

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  function setTheme(newTheme) {
    theme.value = newTheme
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  // Apply theme on initialization
  applyTheme()

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: () => theme.value === 'dark'
  }
}
