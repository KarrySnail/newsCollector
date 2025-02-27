<template>
  <div class="chat-container">
    <h1 class="chat-title">Coze Test</h1>
    
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']">
        {{ message.content }}
      </div>
    </div>

    <div class="input-container">
      <input 
        type="text" 
        v-model="userInput" 
        @keyup.enter="sendMessage"
        placeholder="输入您的问题..."
        class="message-input"
      />
      <button @click="sendMessage" class="send-button" :disabled="isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

const userInput = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value
  messages.value.push({ role: 'user', content: userMessage })
  userInput.value = ''
  isLoading.value = true

  try {
    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer pat_GzQXspPzszxCYeD53P2YHlbtA9mtvQ04BnJtcWwsCTsxmsFBJ8ijVnytkXFEcQNm'
      },
      body: JSON.stringify({
        bot_id: '7475675281903779851',
        user_id: '123456789',
        stream: true,
        auto_save_history: true,
        additional_messages: [{
          role: 'user',
          content: userMessage,
          content_type: 'text'
        }]
      })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      // 将原始数据显示在界面上
      messages.value.push({
        role: 'assistant',
        content: `Raw data: ${chunk}`
      })
      scrollToBottom()
    }
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({ 
      role: 'assistant', 
      content: '抱歉，发生了一些错误，请稍后再试。' 
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.chat-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.messages-container {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: #f8f9fa;
}

.message {
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.user-message {
  background-color: #007bff;
  color: white;
  margin-left: auto;
}

.bot-message {
  background-color: #e9ecef;
  color: #2c3e50;
}

.input-container {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #0056b3;
}

.send-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>