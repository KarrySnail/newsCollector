import { FEISHU_CONFIG } from './config.js';

// 获取飞书访问令牌
async function getFeishuAccessToken() {
  console.log('开始获取访问令牌...');
  try {
    const response = await fetch(FEISHU_CONFIG.AUTH_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: FEISHU_CONFIG.APP_ID,
        app_secret: FEISHU_CONFIG.APP_SECRET
      })
    });

    console.log('Token响应:', response);
    const data = await response.json();
    console.log('Token数据:', data);

    if (data.code !== 0) {
      throw new Error(data.msg || '获取访问令牌失败');
    }
    return data.tenant_access_token;
  } catch (error) {
    console.error('获取令牌错误:', error);
    throw new Error('获取飞书访问令牌失败：' + error.message);
  }
}

// 获取多维表格字段信息
async function getTableFields() {
  console.log('开始获取字段信息...');
  try {
    const token = await getFeishuAccessToken();
    console.log('获取到token:', token);

    const url = `${FEISHU_CONFIG.BITABLE_URI}/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/fields`;
    console.log('请求URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('字段响应:', response);
    const data = await response.json();
    console.log('字段数据:', data);
    return data;
  } catch (error) {
    console.error('获取字段错误:', error);
    throw error;
  }
}

// 保存链接到飞书多维表格
async function saveLinkToFeishu(url, title) {
  console.log('开始保存链接...', { url, title });
  try {
    // 获取访问令牌
    const token = await getFeishuAccessToken();
    console.log('获取到token:', token);

    // 发送请求到飞书API
    const apiUrl = `${FEISHU_CONFIG.BITABLE_URI}/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records`;
    console.log('保存链接URL:', apiUrl);

    const fieldData = {
      '文章链接': {
        link: url  // 使用link字段
      }
    };

    console.log('发送的字段数据:', fieldData);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: fieldData
      })
    });

    console.log('保存响应:', response);
    const data = await response.json();
    console.log('保存数据:', data);

    if (data.code !== 0) {
      throw new Error(data.msg || '保存失败');
    }
    return true;
  } catch (error) {
    console.error('保存错误:', error);
    throw new Error('保存链接失败：' + error.message);
  }
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message);
  if (message.type === 'SAVE_LINK') {
    saveLinkToFeishu(message.data.url, message.data.title)
      .then(() => {
        console.log('保存成功');
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('保存失败:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 保持消息通道开启
  }
});

// 输出配置信息
console.log('扩展已加载，配置信息:', FEISHU_CONFIG); 