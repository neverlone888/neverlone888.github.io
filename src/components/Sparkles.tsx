import { useMemo } from "react";

/** 漂浮星光特效（参考 motionsite 风格） */
export default function Sparkles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 10 + Math.random() * 14,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="sparkles" aria-hidden="true">
      {dots.map((d, i) => (
        <i
          key={i}
          style={{
            left: d.left + "%",
            animationDelay: d.delay + "s",
            animationDuration: d.duration + "s",
            width: d.size + "px",
            height: d.size + "px",
          }}
        />
      ))}
    </div>
  );
}