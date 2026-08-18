import { useState } from "react";
import { flags } from "../data/flags";

interface Book {
  title: string;
  author: string[];
  year: number | null;
}

interface ApiDoc {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
}

/** 爬虫项目：浏览器演示版（通过公开 API 演示抓取流程，成功后可发现 flag） */
export default function CrawlerDemo({ onBack }: { onBack: () => void }) {
  const [keyword, setKeyword] = useState("医学");
  const [log, setLog] = useState<string[]>(["> 爬虫演示已就绪。输入关键词，点击“开始抓取”。"]);
  const [results, setResults] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    const kw = keyword.trim();
    if (!kw || loading) return;
    setLoading(true);
    setResults(null);

    const lines: string[] = [];
    lines.push("> 正在连接 openlibrary.org ...");
    setLog([...lines]);

    try {
      const url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(kw) + "&limit=8";
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      lines.push("> 连接成功，开始抓取数据 ...");
      lines.push("> 共找到 " + (data.numFound ?? 0) + " 条记录，解析前 8 条 ...");
      lines.push("> 完成！");
      lines.push("🎯 flag：" + flags.crawler + " —— 回首页项目卡片提交解锁成就！");
      setLog([...lines]);

      const books: Book[] = ((data.docs as ApiDoc[]) || []).map((d) => ({
        title: d.title || "无标题",
        author: d.author_name || [],
        year: d.first_publish_year ?? null,
      }));
      setResults(books);
    } catch (err) {
      lines.push("> 抓取失败：" + (err instanceof Error ? err.message : String(err)));
      lines.push("> 提示：浏览器演示版只能访问允许跨域的公开 API；完整爬虫见 projects/crawler/crawler.py");
      setLog([...lines]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">爬虫项目（浏览器演示版）</h1>
        <button className="back-btn" onClick={onBack}>← 返回首页</button>
      </div>

      <div className="crawler-wrap">
        <div className="crawler-input-row">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入要抓取的关键词，例如：医学 / AI / Python"
            onKeyDown={(e) => e.key === "Enter" && run()}
          />
          <button className="btn btn-primary" onClick={run} disabled={loading}>
            {loading ? "抓取中..." : "▶ 开始抓取"}
          </button>
        </div>

        <div className="crawler-log">{log.join("\n")}</div>

        <div className="note-box">
          💡 说明：这是<b>浏览器演示版</b>，通过公开 API（Open Library 图书馆）演示"输入关键词 → 抓取 → 解析 → 展示"的爬虫流程。
          完整的 Python 爬虫代码在 <b>projects/crawler/crawler.py</b>（需要 Python 环境运行）。
        </div>

        {results && results.length > 0 && (
          <div className="result-list">
            {results.map((b, i) => (
              <div key={i} className="result-item">
                <h4>{b.title}</h4>
                <p>作者：{b.author.join("、") || "未知"}</p>
                <p>出版年份：{b.year ?? "未知"}</p>
              </div>
            ))}
          </div>
        )}
        {results && results.length === 0 && <p className="item-desc">没有抓取到数据，换个关键词试试。</p>}
      </div>
    </div>
  );
}