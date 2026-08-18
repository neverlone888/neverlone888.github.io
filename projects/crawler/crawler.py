# -*- coding: utf-8 -*-
"""
网络爬虫示例（Python 完整版）
================================================
运行前先安装依赖：
    pip install requests beautifulsoup4

用法：
    python crawler.py

注意：爬取网页前请先查看目标网站的 robots.txt，
并且遵守法律法规，只爬取允许公开访问的数据。
"""

import requests
from bs4 import BeautifulSoup


def crawl(url: str, max_links: int = 10) -> None:
    """抓取一个网页，打印页面标题和前 max_links 个链接。"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    print(f"[*] 正在抓取: {url}")

    # 1. 请求网页
    resp = requests.get(url, headers=headers, timeout=10)
    resp.raise_for_status()          # 状态码不是 2xx 就抛出异常
    resp.encoding = resp.apparent_encoding

    # 2. 解析 HTML
    soup = BeautifulSoup(resp.text, "html.parser")

    # 3. 提取信息
    title = soup.title.string.strip() if soup.title and soup.title.string else "未知"
    print(f"[+] 页面标题: {title}")

    links = soup.find_all("a", href=True)
    print(f"[+] 共发现 {len(links)} 个链接，打印前 {max_links} 个：")
    for a in links[:max_links]:
        text = a.get_text(strip=True)
        if text:
            print(f"    - {text[:40]}  ->  {a['href']}")


if __name__ == "__main__":
    # 把这里换成你想抓取的网址（务必确认允许抓取）
    crawl("https://example.com")
