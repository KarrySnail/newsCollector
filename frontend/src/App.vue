<template>
  <div class="min-h-screen bg-gray-100">

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>

    <footer class="bg-white border-t border-gray-200 mt-8">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-500 text-sm">
          © 2025 pudding's Blog. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: "pudding's Blog",
  meta: [
    { name: 'description', content: 'A personal blog powered by Feishu Bitable' }
  ]
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>