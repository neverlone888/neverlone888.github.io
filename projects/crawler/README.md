# 爬虫项目

## 网页演示版（在网站里直接体验）
在个人网站的「项目作品」→「爬虫项目」中打开，输入关键词即可演示抓取流程。
演示版通过公开 API（Open Library 图书馆）实现，不需要后端。

## Python 完整版（本目录）
- `crawler.py` —— 一个简单的 Python 爬虫示例（requests + BeautifulSoup）

### 运行方法
1. 安装 Python（python.org 官网）
2. 安装依赖：
   ```bash
   pip install requests beautifulsoup4
   ```
3. 运行：
   ```bash
   python crawler.py
   ```

### 注意
- 爬取网页前请先查看目标网站的 `robots.txt`
- 遵守法律法规，只爬取允许公开访问的数据
