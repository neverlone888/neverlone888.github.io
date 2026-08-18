import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";

export default function Footer() {
  const [visits, setVisits] = useState(0);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return; // 防止开发模式重复计数
    counted.current = true;
    const n = Number(localStorage.getItem("visits") || "0") + 1;
    localStorage.setItem("visits", String(n));
    setVisits(n);
  }, []);

  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {profile.name} · 本机访问次数：{visits}</p>
      <p style={{ marginTop: "0.3rem" }}>主修医学 · 辅修 AI 编程 · Vite + React + TypeScript</p>
    </footer>
  );
}
