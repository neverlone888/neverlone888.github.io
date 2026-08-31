import { useEffect, useRef } from "react";

/** 视频背景（和参考站一致）：封面图兜底 + 强制播放 + 开机动画结束后自动显示 */
export default function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => {
      const p = v.play();
      if (p) p.catch(() => {});
    };
    tryPlay();
    const onInteract = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);
    window.addEventListener("touchstart", onInteract);
    v.addEventListener("canplay", tryPlay);
    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        className="video-bg"
        src="bg/video-bg.mp4"
        poster="bg/poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="video-bg-overlay" aria-hidden="true" />
    </>
  );
}