<template>
  <div class="mfs-w-full">
    <LandingPage
      :current-theme="currentTheme"
      @explore-catalog="goToCatalog"
      @select-theme="setTheme"
      @open-theme-detail="goToDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTheme, type ThemeType } from '../lib'
import LandingPage from '../components/LandingPage.vue'

const router = useRouter()
const { currentTheme, setTheme } = useTheme()

const goToCatalog = () => {
  router.push('/catalog')
}

const goToDetail = (themeId: ThemeType) => {
  router.push(`/themes/${themeId}`)
}
</script>
