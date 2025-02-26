<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid gap-6 py-8">
      <article v-for="post in posts" :key="post.id" class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          <a :href="`/post/${post.id}`" class="hover:text-[#DE2910]">
            {{ post.title }}
          </a>
        </h2>
        
        <!-- 精选金句 -->
        <blockquote class="border-l-4 border-[#DE2910] pl-4 mb-4">
          <p class="text-lg font-medium text-[#DE2910]">
            {{ post.quote }}
          </p>
        </blockquote>

        <!-- 点评内容 -->
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">点评</h3>
          <p class="text-gray-600">
            {{ post.comment }}
          </p>
        </div>

        <!-- 文章预览 -->
        <div class="prose prose-sm max-w-none text-gray-500">
          {{ post.preview }}
        </div>

        <div class="mt-4 flex justify-end">
          <a
            :href="`/post/${post.id}`"
            target="_blank"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#DE2910] hover:bg-[#BE1800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DE2910]"
          >
            阅读全文
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据，实际项目中应该从API获取
const posts = ref([
  {
    id: 1,
    title: '示例文章标题',
    quote: '这是一句精选的金句，展示在文章卡片中',
    comment: '这是对文章的点评内容，提供对文章的见解和分析。',
    preview: '这是文章的预览内容，通常显示文章的前100个字...',
  },
  // 可以添加更多文章
])
</script>