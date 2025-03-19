import { createApp } from 'vue'
import router from './router/index'

import App from './App.vue'
import '@/assets/output.css'
import '../src/assets/style/index.scss'

import 'ant-design-vue/dist/reset.css'

// ant
import { DatePicker } from 'ant-design-vue'
import Antd from 'ant-design-vue'

// icons
import 'virtual:svg-icons-register'

import globalComponent from '@/components/install.js' // 全局组件

// pinia
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.config.productionTip = false

app.use(router)
app.use(DatePicker)
app.use(Antd)
app.use(globalComponent)
app.use(pinia)

app.mount('#app')
