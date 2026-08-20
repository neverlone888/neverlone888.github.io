import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import type { View } from "../App";

const links = [
  { id: "about", label: "关于我" },
  { id: "certificates", label: "证书" },
  { id: "experience", label: "经历" },
  { id: "hobbies", label: "爱好" },
  { id: "strengths", label: "特长" },
  { id: "projects", label: "项目" },
  { id: "contact", label: "联系" },
];

export default function Navbar({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** 点击导航：如果不在首页，先回首页再平滑滚动到对应板块 */
  const go = (id: string) => {
    setMenuOpen(false);
    if (view !== "home") {
      onNavigate("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={"navbar" + (scrolled ? " scrolled" : "")}>
      <a
        className="brand"
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          setMenuOpen(false);
          if (view !== "home") onNavigate("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {profile.name}@cyber
      </a>

      <nav className={"nav-links" + (menuOpen ? " open" : "")}>
        {links.map((l) => (
          <a key={l.id} href={"#" + l.id} onClick={(e) => { e.preventDefault(); go(l.id); }}>
            {l.label}
          </a>
        ))}
      </nav>

      <button className={"menu-btn" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen(!menuOpen)} aria-label="菜单">
        <span></span><span></span><span></span>
      </button>
    </header>
  );
}