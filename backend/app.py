from flask import Flask, render_template, abort, request
from flask_caching import Cache
from flask_cors import CORS
import requests
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
cache = Cache(app)
CORS(app)

class FeishuAPI:
    def __init__(self):
        self.host = Config.FEISHU_HOST
        self.app_id = Config.FEISHU_APP_ID
        self.app_secret = Config.FEISHU_APP_SECRET
        self.base_id = Config.BASE_ID
        self.table_id = Config.TABLE_ID
    
    @cache.memoize(timeout=7200)
    def get_tenant_access_token(self):
        url = Config.FEISHU_AUTH_URI
        headers = {
            'Content-Type': 'application/json'
        }
        data = {
            'app_id': self.app_id,
            'app_secret': self.app_secret
        }
        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()['tenant_access_token']
        except requests.exceptions.RequestException as e:
            app.logger.error(f'获取tenant_access_token失败: {str(e)}\nResponse: {response.text if hasattr(response, "text") else "No response"}')
            raise

    def get_records(self):
        try:
            token = self.get_tenant_access_token()
            url = f'{Config.FEISHU_BITABLE_URI}/apps/{self.base_id}/tables/{self.table_id}/records'
            print('url', url)
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            app.logger.info(f'成功获取数据: {len(data.get("data", {}).get("items", []))} 条记录')
            return data['data']['items']
        except requests.exceptions.RequestException as e:
            app.logger.error(f'获取记录失败: {str(e)}\nResponse: {response.text if hasattr(response, "text") else "No response"}')
            raise

feishu_api = FeishuAPI()

@app.before_request
def log_request_info():
    app.logger.info(f'请求方法: {request.method}, 路径: {request.path}, 参数: {dict(request.args)}')

@app.after_request
def log_response_info(response):
    app.logger.info(f'响应状态码: {response.status_code}')
    return response

@app.route('/getList')
def index():
    try:
        records = feishu_api.get_records()
        print("records:", records)
        articles = [{
            'id': record['record_id'],
            'title': record['fields'].get('文章标题', ''),
            'quote': record['fields'].get('总结', ''),
            'content': record['fields'].get('内容获取', '')[:100] + '...'
        } for record in records]
        return {'articles': articles}
    except Exception as e:
        app.logger.error(f'Error fetching data: {str(e)}')
        abort(500)

@app.route('/article/<string:article_id>')
def article(article_id):
    try:
        records = feishu_api.get_records()
        article = next(
            ({
                'title': record['fields'].get('文章标题', ''),
                'quote': record['fields'].get('总结', ''),
                'comment': '',
                'content': record['fields'].get('内容获取', '')
            } for record in records if record['record_id'] == article_id),
            None
        )
        if not article:
            abort(404)
        return {'article': article}
    except Exception as e:
        app.logger.error(f'Error fetching article: {str(e)}')
        abort(500)

if __name__ == '__main__':
    app.run(debug=True)