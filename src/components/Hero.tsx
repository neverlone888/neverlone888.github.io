import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import Reveal from "./Reveal";

/** 打字机效果：逐字显示一句话 */
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

export default function Hero() {
  const typed = useTypewriter(profile.tagline);

  return (
    <section id="top" className="hero">
      <Reveal className="hero-inner">
        <p className="hero-terminal">{"$ " + "初始化个人档案 ... 完成"}</p>
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-title">{profile.title}</p>
        <p className="hero-tagline">
          {typed}
          <span className="cursor" aria-hidden="true" />
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">查看项目</a>
          <a className="btn btn-ghost" href="#about">关于我</a>
        </div>
      </Reveal>
    </section>
  );
}
