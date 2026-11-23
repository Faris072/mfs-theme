<template>
  <div class="mfs-w-full">
    <ThemeDetailPage
      :theme-id="activeTheme"
      :active-theme-id="currentTheme"
      @back="goToCatalog"
      @change-theme="switchThemePage"
      @set-active-theme="setTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme, type ThemeType } from '../lib'
import { THEMES_DATA } from '../data/themesData'
import ThemeDetailPage from '../components/ThemeDetailPage.vue'

const props = defineProps<{
  themeId?: string
}>()

const route = useRoute()
const router = useRouter()
const { currentTheme, setTheme } = useTheme()

const activeTheme = computed<ThemeType>(() => {
  const param = (props.themeId || route.params.themeId || 'clay') as string
  if (Object.prototype.hasOwnProperty.call(THEMES_DATA, param)) {
    return param as ThemeType
  }
  return 'clay'
})

const goToCatalog = () => {
  router.push('/catalog')
}

const switchThemePage = (id: ThemeType) => {
  router.push(`/themes/${id}`)
}
</script>
