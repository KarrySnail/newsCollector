<template>
  <div class="article-list">
    <h1 class="main-title">AI咨询收集</h1>
    
    <div class="article-item" v-for="article in articles" :key="article.id">
      <h2 class="article-title">
        <router-link :to="{ name: 'article', params: { id: article.id }}">
          {{ article.title }}
        </router-link>
      </h2>
      
      <div class="article-quote" v-if="article.quote">
        {{ article.quote }}
      </div>
      
      <div class="article-comment" v-if="article.comment">
        {{ article.comment }}
      </div>
      
      <div class="article-preview">
        {{ article.preview }}
      </div>
      
      <router-link 
        class="read-more"
        :to="{ name: 'article', params: { id: article.id }}"
      >
        阅读全文 →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const articles = ref([])

const fetchArticles = async () => {
  try {
    const response = await axios.get('/api/getList')
    articles.value = response.data.articles
  } catch (error) {
    console.error('Error fetching articles:', error)
  }
}

onMounted(() => {
  fetchArticles()
})
</script>