<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <article class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <!-- 文章标题 -->
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ post.title }}
      </h1>

      <!-- 精选金句 -->
      <blockquote class="border-l-4 border-[#DE2910] pl-4 mb-8 bg-gray-50 py-4">
        <p class="text-xl font-medium text-[#DE2910]">
          {{ post.quote }}
        </p>
      </blockquote>

      <!-- 点评内容 -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">点评</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          {{ post.comment }}
        </div>
      </div>

      <!-- 文章正文 -->
      <div class="prose prose-lg max-w-none text-gray-800">
        {{ post.content }}
      </div>

      <!-- 返回首页 -->
      <div class="mt-8 border-t border-gray-100 pt-8">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-[#DE2910] text-sm font-medium rounded-md text-[#DE2910] bg-white hover:bg-[#DE2910] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DE2910] transition-colors"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据，实际项目中应该从API获取
const post = ref({
  id: 1,
  title: '示例文章标题',
  quote: '这是一句精选的金句，展示在文章详情页中',
  comment: '这是对文章的详细点评内容，提供深入的见解和分析。',
  content: '这是文章的完整内容，包含了所有的段落和细节...',
})
</script>