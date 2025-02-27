import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import Home from './views/Home.vue'
import Article from './views/Article.vue'
import CozeTest from './views/CozeTest.vue'
import CozeBiaoQingBao from './views/CozeBiaoQingBao.vue'
import './assets/styles/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/article/:id',
      name: 'article',
      component: Article
    },
    {
      path: '/coze-test',
      name: 'coze-test',
      component: CozeTest
    },
    {
      path: '/biaoqingbao',
      name: 'biaoqingbao',
      component: CozeBiaoQingBao
    }
  ]
})

const head = createHead()
const app = createApp(App)

app.use(router)
app.use(head)
app.mount('#app')