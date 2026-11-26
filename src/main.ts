import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ThemePlugin from './lib'
import './lib/themes/index.css'

const app = createApp(App)
app.use(router)
app.use(ThemePlugin, { defaultTheme: 'clay', router })
app.mount('#app')
