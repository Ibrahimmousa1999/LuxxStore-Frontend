<template>
  <div :dir="locale === 'ar' ? 'rtl' : 'ltr'" :class="{ 'font-arabic': locale === 'ar' }">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ToastContainer from '@/components/ToastContainer.vue'

const { locale } = useI18n()
</script>
