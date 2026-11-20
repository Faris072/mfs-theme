<template>
  <div class="components-view">
    <ComponentsDocPage
      :active-slug="activeSlug"
      @select="selectComponent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentsDocPage from '../components/ComponentsDocPage.vue'

const props = defineProps<{
  slug?: string
}>()

const route = useRoute()
const router = useRouter()

const activeSlug = computed(() => {
  const param = props.slug || route.params.slug
  return typeof param === 'string' && param.length > 0 ? param : 'button'
})

const selectComponent = (slug: string) => {
  router.push(`/components/${slug}`)
}
</script>

<style scoped>
.components-view {
  width: 100%;
}
</style>
