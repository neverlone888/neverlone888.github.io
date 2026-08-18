import { useState } from "react";
import type { View } from "../App";
import { flags, loadSolved, addSolved } from "../data/flags";
import { toast } from "../utils/toast";
import Reveal from "./Reveal";

const projects: {
  key: View;
  icon: string;
  name: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  desc: string;
  tags: string[];
  hint: string;
}[] = [
  {
    key: "snake",
    icon: "🐍",
    name: "贪吃蛇游戏",
    category: "GAME",
    difficulty: "easy",
    points: 100,
    desc: "用 Canvas 实现的经典贪吃蛇，支持键盘和屏幕按钮操作，最高分保存在浏览器本地（localStorage）。",
    tags: ["React", "Canvas", "TypeScript"],
    hint: "在游戏中得分 ≥ 10 可发现 flag",
  },
  {
    key: "crawler",
    icon: "🕷️",
    name: "爬虫项目",
    category: "WEB",
    difficulty: "medium",
    points: 200,
    desc: "网络爬虫项目：网页演示版可实时抓取公开数据；完整 Python 爬虫代码在 projects/crawler/ 目录中。",
    tags: ["Python", "爬虫", "公开 API"],
    hint: "成功抓取一次数据后可发现 flag",
  },
  {
    key: "vision",
    icon: "👁️",
    name: "人脸识别·动作捕捉·手势识别",
    category: "AI",
    difficulty: "hard",
    points: 300,
    desc: "使用 OpenCV.js 实时进行人脸识别、动作捕捉与手势识别，需要摄像头；完整 Python 代码在 projects/opencv/ 目录中。",
    tags: ["OpenCV", "人脸识别", "手势识别", "动作捕捉"],
    hint: "打开项目并启动摄像头，检测到人脸即可发现 flag",
  },
];

const DIFF_DOTS: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

/** 项目作品：仿 CTF 平台的"挑战"卡片，含 flag 提交 */
export default function Projects({ onOpen }: { onOpen: (v: View) => void }) {
  const [solved, setSolved] = useState<string[]>(() => loadSolved());
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const submitFlag = (key: string) => {
    const val = (inputs[key] || "").trim();
    if (!val) {
      toast("请输入 flag", "error");
      return;
    }
    if (val === flags[key]) {
      const list = addSolved(key);
      setSolved(list);
      toast("🎉 正确！flag 已解锁，成就 +1", "success");
    } else {
      toast("❌ flag 错误，再试试", "error");
    }
  };

  return (
    <section id="projects" className="section">
      <Reveal>
        <p className="section-label">{"$ ls challenges/"}</p>
        <h2 className="section-title">项目作品</h2>
        <p className="section-sub">像 CTF 挑战一样：打开项目、发现 flag、提交解锁成就</p>
      </Reveal>

      <div className="projects-grid">
        {projects.map((p) => {
          const isSolved = solved.includes(p.key);
          return (
            <Reveal key={p.key} className="card project-card">
              <div className="challenge-head">
                <span className="challenge-cat">{p.category}</span>
                <span className="challenge-points">+{p.points}</span>
              </div>

              <h3 className="project-name">{p.icon} {p.name}</h3>

              <div className="challenge-diff">
                <span>难度</span>
                {[1, 2, 3].map((i) => (
                  <span key={i} className={"diff-dot" + (i <= DIFF_DOTS[p.difficulty] ? " on" : "")} />
                ))}
                <span className="diff-label">{p.difficulty}</span>
              </div>

              <p className="item-desc">{p.desc}</p>

              <div className="project-tags">
                {p.tags.map((t) => <span key={t} className="skill-tag">{t}</span>)}
              </div>

              <p className="challenge-hint">💡 {p.hint}</p>

              <button className="open-btn" onClick={() => onOpen(p.key)}>▶ 打开项目</button>

              <div className="flag-row">
                <input
                  value={inputs[p.key] || ""}
                  onChange={(e) => setInputs({ ...inputs, [p.key]: e.target.value })}
                  placeholder="flag{...}"
                  disabled={isSolved}
                  aria-label={"提交 " + p.name + " 的 flag"}
                />
                <button
                  className="btn btn-ghost flag-btn"
                  onClick={() => submitFlag(p.key)}
                  disabled={isSolved}
                >
                  {isSolved ? "✅ 已解决" : "提交"}
                </button>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}