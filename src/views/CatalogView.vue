<template>
  <div class="mfs-w-full">
    <ThemeCatalogPage
      :active-theme-id="currentTheme"
      @select-theme="setTheme"
      @open-theme-detail="goToDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTheme, type ThemeType } from '../lib'
import ThemeCatalogPage from '../components/ThemeCatalogPage.vue'

const router = useRouter()
const { currentTheme, setTheme } = useTheme()

const goToDetail = (themeId: ThemeType) => {
  router.push(`/themes/${themeId}`)
}
</script>
