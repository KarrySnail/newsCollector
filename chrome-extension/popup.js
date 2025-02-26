import { FEISHU_CONFIG } from './config.js';

// 获取DOM元素
const saveLinkButton = document.getElementById('saveLink');
const statusElement = document.getElementById('status');
const errorElement = document.getElementById('error');

// 点击保存按钮事件处理
saveLinkButton.addEventListener('click', async () => {
  try {
    // 禁用按钮，显示加载状态
    saveLinkButton.disabled = true;
    statusElement.textContent = '正在保存链接...';
    errorElement.textContent = '';

    // 获取当前标签页信息
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;
    const title = tab.title;

    // 发送消息给background script处理保存操作
    const response = await chrome.runtime.sendMessage({
      type: 'SAVE_LINK',
      data: { url, title }
    });

    if (response.success) {
      statusElement.textContent = '链接保存成功！';
      setTimeout(() => {
        window.close();
      }, 2000);
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    errorElement.textContent = `保存失败：${error.message}`;
    statusElement.textContent = '';
  } finally {
    saveLinkButton.disabled = false;
  }
}); 