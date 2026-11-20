import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import CatalogView from '../views/CatalogView.vue'
import ThemeDetailView from '../views/ThemeDetailView.vue'
import ComponentsView from '../views/ComponentsView.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: CatalogView
  },
  {
    path: '/themes/:themeId',
    name: 'theme-detail',
    component: ThemeDetailView,
    props: true
  },
  {
    path: '/components/:slug?',
    name: 'components',
    component: ComponentsView,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
