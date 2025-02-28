import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import './style.css'
import App from './App.vue'

// Import components
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import UserSettings from './views/UserSettings.vue'

// Create router
const routes = [
  { path: '/', component: Home },
  { path: '/dashboard', component: Dashboard },
  { path: '/settings', component: UserSettings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(PrimeVue)

// Mount app
app.mount('#app')