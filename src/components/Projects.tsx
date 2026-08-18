import type { View } from "../App";
import Reveal from "./Reveal";

const projects: {
  key: View;
  icon: string;
  name: string;
  desc: string;
  tags: string[];
}[] = [
  {
    key: "snake",
    icon: "🐍",
    name: "贪吃蛇游戏",
    desc: "用 Canvas 实现的经典贪吃蛇，支持键盘和屏幕按钮操作，最高分保存在浏览器本地（localStorage）。",
    tags: ["React", "Canvas", "TypeScript"],
  },
  {
    key: "crawler",
    icon: "🕷️",
    name: "爬虫项目",
    desc: "网络爬虫项目：网页演示版可实时抓取公开数据；完整 Python 爬虫代码在 projects/crawler/ 目录中。",
    tags: ["Python", "爬虫", "公开 API"],
  },
];

export default function Projects({ onOpen }: { onOpen: (v: View) => void }) {
  return (
    <section id="projects" className="section">
      <Reveal>
        <p className="section-label">{"$ ls projects/"}</p>
        <h2 className="section-title">项目作品</h2>
        <p className="section-sub">点击"打开项目"即可体验（可运行）</p>
      </Reveal>

      <div className="projects-grid">
        {projects.map((p) => (
          <Reveal key={p.key} className="card project-card">
            <h3 className="project-name">{p.icon} {p.name}</h3>
            <p className="item-desc">{p.desc}</p>
            <div className="project-tags">
              {p.tags.map((t) => <span key={t} className="skill-tag">{t}</span>)}
            </div>
            <button className="open-btn" onClick={() => onOpen(p.key)}>
              ▶ 打开项目
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
