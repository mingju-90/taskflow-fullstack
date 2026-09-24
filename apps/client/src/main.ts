import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.css'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

const app = createApp(App)

// 插件顺序保持稳定：状态、路由、组件库，最后挂载应用。
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
