import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import type { View } from "../App";
import Reveal from "./Reveal";
import Terminal from "./Terminal";

/** 打字机效果 */
function useTypewriter(text: string, speed = 85) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplay("");
    const timer = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return display;
}

export default function Hero({
  onOpen,
  onNavigate,
}: {
  onOpen: (v: View) => void;
  onNavigate: (id: string) => void;
}) {
  const typed = useTypewriter(profile.tagline);
  // 头像：依次尝试 avatar.png → avatar.jpg → 占位图 avatar.svg
  const AVATAR_LIST = ["/avatar.png", "/avatar.jpg", "/avatar.svg"];
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatar = AVATAR_LIST[avatarIndex];

  return (
    <section id="top" className="hero">
      <Reveal className="hero-inner">
        <p className="hero-terminal">{"$ " + "初始化个人档案 ... 完成"}</p>
        <div className="hero-name-row">
          <img className="hero-avatar" src={avatar} alt="头像" onError={() => setAvatarIndex((i) => Math.min(i + 1, AVATAR_LIST.length - 1))} />
          <h1 className="hero-name">{profile.name}</h1>
        </div>
        <p className="hero-title">{profile.title}</p>
        <p className="hero-tagline">
          {typed}
          <span className="cursor" aria-hidden="true" />
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">查看项目</a>
          <a className="btn btn-ghost" href="#about">关于我</a>
        </div>
        <Terminal onOpen={onOpen} onNavigate={onNavigate} />
      </Reveal>
    </section>
  );
}
