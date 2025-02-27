<template>
  <div class="chat-container">
    <h1 class="chat-title">表情包生成器</h1>

    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'message',
          message.role === 'user' ? 'user-message' : 'bot-message',
        ]"
      >
        <img
          v-if="isImageUrl(message.content)"
          :src="message.content"
          class="message-image"
        />
        <span v-else>{{ message.content }}</span>
      </div>
      <div v-if="messages.length === 0" class="welcome-container">
        <div class="welcome-title">欢迎使用柴犬表情包生成器! 🐕</div>
        <div class="welcome-description">
          我是一个专门生成可爱柴犬表情包的AI助手。告诉我你想要什么样的表情包，
          比如「开心的柴犬」、「生气的柴犬」等，我就能为你生成独特的柴犬表情包！
        </div>
        <div class="example-prompts">
          <div class="example-title">💡 试试这些提示语：</div>
          <ul>
            <li @click="handleExampleClick('画一只戴着墨镜的柴犬')">「画一只戴着墨镜的柴犬」</li>
            <li @click="handleExampleClick('画一只在下雨天打伞的柴犬')">「画一只在下雨天打伞的柴犬」</li>
            <li @click="handleExampleClick('画一只抱着爱心的柴犬')">「画一只抱着爱心的柴犬」</li>
          </ul>
        </div>
      </div>
      <div v-if="isStreaming" class="bot-message message streaming">
        <span class="typing-indicator">AI正在思考中</span>
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
        {{ isLoading ? "发送中..." : "发送" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";

const userInput = ref("");
const messages = ref([]);
const isLoading = ref(false);
const isStreaming = ref(false);
const currentStreamMessage = ref("");
const messagesContainer = ref(null);

const isImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  // 检查是否为 coze.cn 的图片链接
  if (url.includes("coze.cn/t/")) return true;
  // 检查常规图片链接
  return (
    url.startsWith("https://") &&
    (url.includes(".png") ||
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".gif") ||
      url.includes(".webp"))
  );
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const userMessage = userInput.value;
  messages.value.push({ role: "user", content: userMessage });
  userInput.value = "";
  isLoading.value = true;
  isStreaming.value = true;
  currentStreamMessage.value = "";
  console.log("开始发送消息，状态：", {
    isLoading: isLoading.value,
    isStreaming: isStreaming.value,
  });

  try {
    const response = await fetch("https://api.coze.cn/v3/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer pat_GzQXspPzszxCYeD53P2YHlbtA9mtvQ04BnJtcWwsCTsxmsFBJ8ijVnytkXFEcQNm",
      },
      body: JSON.stringify({
        bot_id: "7475675281903779851",
        user_id: "123456789",
        stream: true,
        auto_save_history: true,
        additional_messages: [
          {
            role: "user",
            content: userMessage,
            content_type: "text",
          },
        ],
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      let currentEvent = "";
      let currentData = "";

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith("event:")) {
          currentEvent = line.substring(6).trim();
          continue;
        }

        if (line.startsWith("data:")) {
          currentData = line.substring(5).trim();

          if (currentEvent && currentData) {
            if (currentEvent === "conversation.message.delta") {
              try {
                const data = JSON.parse(currentData);
                if (data.content) {
                  currentStreamMessage.value += data.content;
                  // 只有当收到有效的图片URL时才隐藏加载提示
                  if (isImageUrl(data.content)) {
                    isStreaming.value = false;
                  }

                  // 更新最后一条消息或添加新消息
                  if (
                    messages.value.length > 0 &&
                    messages.value[messages.value.length - 1].role ===
                      "assistant"
                  ) {
                    messages.value[messages.value.length - 1].content =
                      currentStreamMessage.value;
                  } else {
                    messages.value.push({
                      role: "assistant",
                      content: currentStreamMessage.value,
                    });
                  }
                  scrollToBottom();
                }
              } catch (e) {}
            }

            currentEvent = "";
            currentData = "";
          }
        }
      }
    }
  } catch (error) {
    messages.value.push({
      role: "assistant",
      content: "抱歉，发生了一些错误，请稍后再试。",
    });
  } finally {
    isLoading.value = false;
    isStreaming.value = false;
    currentStreamMessage.value = "";
    scrollToBottom();
  }
};

onMounted(() => {
  scrollToBottom();
});

const handleExampleClick = async (prompt) => {
  userInput.value = prompt;
  await sendMessage();
};
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
  height: 65vh;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 10px;
  background: #f8f9fa;
}

.message {
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 500px;
  width: fit-content;
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

.streaming {
  opacity: 0.7;
}

.typing-indicator {
  display: inline-block;
  position: relative;
  padding-right: 20px;
}

.typing-indicator::after {
  content: ".";
  position: absolute;
  left: 100px;
  animation: typing 1.5s infinite;
}

@keyframes typing {
  0% {
    content: ".";
  }
  33% {
    content: "..";
  }
  66% {
    content: "...";
  }
  100% {
    content: ".";
  }
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

.message-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  display: block;
  margin: 5px auto;
  object-fit: contain;
}

.send-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
.welcome-container {
  text-align: center;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 600px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.welcome-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.example-prompts {
  text-align: left;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.example-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
}

.example-prompts ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.example-prompts li {
  color: #007bff;
  margin: 10px 0;
  cursor: pointer;
  transition: color 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: rgba(0, 123, 255, 0.1);
}

.example-prompts li:hover {
  color: #0056b3;
  background-color: rgba(0, 123, 255, 0.2);
}
</style>
