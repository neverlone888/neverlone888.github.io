import { useEffect, useRef } from "react";

/** 视频背景 + 云动画兜底：视频可播则播视频；被拦截则显示蓝天+云朵动画（两个版本观感一致） */
export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // 视频没播放时隐藏视频层，露出底下的蓝天+云动画
    const update = () => {
      v.style.opacity = v.paused ? "0" : "1";
    };
    update();
    v.addEventListener("play", update);
    v.addEventListener("pause", update);
    v.addEventListener("playing", update);

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
      v.removeEventListener("play", update);
      v.removeEventListener("pause", update);
      v.removeEventListener("playing", update);
    };
  }, []);

  return (
    <>
      <div className="sky-bg" aria-hidden="true" />
      <div className="clouds" aria-hidden="true">
        <span /><span /><span />
      </div>
      <video
        ref={videoRef}
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