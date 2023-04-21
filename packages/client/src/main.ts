import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/index.scss'
import 'virtual:svg-icons-register'

createApp(App).use(router).use(store).mount('#app')
