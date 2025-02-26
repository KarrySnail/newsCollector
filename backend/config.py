import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Config:
    # Flask配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    
    # 飞书应用配置
    FEISHU_APP_ID = os.getenv('FEISHU_APP_ID', 'cli_a734791287e9500c')
    FEISHU_APP_SECRET = os.getenv('FEISHU_APP_SECRET', 'rDrS4E8p64LuBiKbG4GDbbzkpznJ80TR')
    
    # 多维表格配置
    BASE_ID = os.getenv('BASE_ID', 'HRZZbVQUTaBSmxsTyyKcmNx6nic')
    TABLE_ID = os.getenv('TABLE_ID', 'tblyhvEjTorfJaIt')
    
    # 飞书API接口
    FEISHU_HOST = 'https://open.feishu.cn'
    FEISHU_AUTH_URI = f'{FEISHU_HOST}/open-apis/auth/v3/tenant_access_token/internal'
    FEISHU_BITABLE_URI = f'{FEISHU_HOST}/open-apis/bitable/v1'
    
    # 缓存配置
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300