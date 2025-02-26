<template>
  <div class="article-detail">
    <div class="article-container">
      <!-- 返回按钮 -->
      <router-link to="/" class="back-link">
        ← 返回首页
      </router-link>
      
      <!-- 文章标题 -->
      <h1 class="detail-title">{{ article.title }}</h1>
      
      <!-- 金句 -->
      <div class="detail-quote" v-if="article.quote">
        {{ article.quote }}
      </div>
      
      <!-- 点评 -->
      <div class="detail-comment" v-if="article.comment">
        <h3 class="comment-title">点评</h3>
        {{ article.comment }}
      </div>
      
      <!-- 文章内容 -->
      <div class="detail-content">
        {{ article.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const article = ref({})

const fetchArticle = async () => {
  try {
    const response = await axios.get(`/api/article/${route.params.id}`)
    article.value = response.data.article
  } catch (error) {
    console.error('Error fetching article:', error)
  }
}

onMounted(() => {
  fetchArticle()
})
</script>