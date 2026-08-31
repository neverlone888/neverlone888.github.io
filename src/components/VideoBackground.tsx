import { useEffect, useRef } from "react";

/** 蓝天白云动态背景：图片背景 + CSS 云朵飘动（file:// 下 100% 可靠，无需视频播放） */
export default function VideoBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 云朵持续移动（CSS animation 已处理），这里仅保证低性能模式也能触发动画
    el.classList.add("clouds-anim");
  }, []);

  return (
    <>
      <div className="sky-bg" aria-hidden="true" />
      <div className="clouds" ref={ref} aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="video-bg-overlay" aria-hidden="true" />
    </>
  );
}