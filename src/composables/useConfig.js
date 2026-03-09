export function useConfig() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  const currency = import.meta.env.VITE_CURRENCY || 'SAR'

  return {
    apiUrl,
    currency
  }
}
