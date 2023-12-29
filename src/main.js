import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const calcApp = createApp(App)
calcApp.use(createPinia())

calcApp.mount('#app')
