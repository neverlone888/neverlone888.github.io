import { useEffect, useState } from "react";

const LINES = [
  "Cyber Terminal v2.0.1",
  "> 正在加载系统模块 ...",
  "> 载入个人档案：周颖乐",
  "> 挂载服务：snake / crawler / music",
  "> 系统就绪。",
];

/** 开机终端动画（每个浏览器会话显示一次，点击任意处进入） */
export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [prompt, setPrompt] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setCount(i);
      if (i >= LINES.length) {
        clearInterval(timer);
        setPrompt(true);
      }
    }, 380);
    return () => clearInterval(timer);
  }, []);

  const enter = () => onDone();

  return (
    <div className="boot" onClick={enter} role="button" aria-label="点击进入">
      <div className="boot-box">
        {LINES.slice(0, count).map((l, i) => (
          <p key={i} className="boot-line">{l}</p>
        ))}
        {prompt && (
          <p className="boot-prompt">
            按任意键或点击进入 <span className="cursor" />
          </p>
        )}
      </div>
    </div>
  );
}
