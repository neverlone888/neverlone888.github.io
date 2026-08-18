import { useEffect, useRef, useState } from "react";
import type { View } from "../App";
import { profile } from "../data/profile";

interface HistoryItem {
  text: string;
  kind: "cmd" | "out" | "ok" | "err";
}

const HELP = [
  "可用命令：",
  "  help            显示帮助",
  "  whoami          我是谁",
  "  about           个人简历",
  "  certificates    证书墙",
  "  experience      个人经历",
  "  projects        项目作品",
  "  contact         联系我",
  "  snake           打开贪吃蛇",
  "  crawler         打开爬虫项目",
  "  vision          打开人脸识别项目",
  "  music           播放/暂停音乐",
  "  flag            查看 flag 提示",
  "  clear           清空终端",
];

/** 交互式终端：仿 CTF 平台的命令行交互 */
export default function Terminal({
  onOpen,
  onNavigate,
}: {
  onOpen: (v: View) => void;
  onNavigate: (id: string) => void;
}) {
  const [history, setHistory] = useState<HistoryItem[]>([
    { text: "Cyber Terminal 交互终端", kind: "out" },
    { text: "输入 help 查看可用命令", kind: "out" },
  ]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const items: HistoryItem[] = [{ text: "$ " + raw, kind: "cmd" }];
    const push = (text: string, kind: HistoryItem["kind"] = "out") => items.push({ text, kind });

    if (!cmd) {
      /* 空命令 */
    } else if (cmd === "help") {
      HELP.forEach((l) => push(l));
    } else if (cmd === "whoami") {
      push(profile.name + " · " + profile.title, "ok");
    } else if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (cmd === "about") {
      push("正在跳转到 个人简历 ...", "ok");
      onNavigate("about");
    } else if (cmd === "certificates" || cmd === "cert") {
      push("正在跳转到 证书墙 ...", "ok");
      onNavigate("certificates");
    } else if (cmd === "experience") {
      push("正在跳转到 个人经历 ...", "ok");
      onNavigate("experience");
    } else if (cmd === "projects") {
      push("正在跳转到 项目作品 ...", "ok");
      onNavigate("projects");
    } else if (cmd === "contact") {
      push("正在跳转到 联系我 ...", "ok");
      onNavigate("contact");
    } else if (cmd === "snake") {
      push("正在启动 贪吃蛇 ...", "ok");
      setTimeout(() => onOpen("snake"), 350);
    } else if (cmd === "crawler") {
      push("正在启动 爬虫项目 ...", "ok");
      setTimeout(() => onOpen("crawler"), 350);
    } else if (cmd === "vision") {
      push("正在启动 人脸识别项目 ...", "ok");
      setTimeout(() => onOpen("vision"), 350);
    } else if (cmd === "music") {
      window.dispatchEvent(new CustomEvent("toggle-music"));
      push("♪ 已切换音乐（Call of Silence）", "ok");
    } else if (cmd === "flag") {
      push("在项目卡片底部输入 flag 提交，即可解锁成就！", "out");
    } else {
      push("command not found: " + cmd + "（输入 help 查看命令）", "err");
    }

    setHistory((h) => [...h, ...items]);
    setInput("");
  };

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="dot dot-r"></span>
        <span className="dot dot-y"></span>
        <span className="dot dot-g"></span>
        <span className="terminal-title">cyber@resume: ~</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {history.map((h, i) => (
          <p key={i} className={"terminal-line " + h.kind}>{h.text}</p>
        ))}
      </div>
      <form
        className="terminal-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
      >
        <span className="terminal-prompt">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="终端命令输入"
        />
      </form>
    </div>
  );
}