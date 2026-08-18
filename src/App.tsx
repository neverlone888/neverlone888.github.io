import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Stats from "./components/Stats";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";
import BootScreen from "./components/BootScreen";
import Toasts from "./components/Toasts";
import SnakeGame from "./projects/SnakeGame";
import CrawlerDemo from "./projects/CrawlerDemo";
import "./App.css";

/** 页面视图：首页 / 贪吃蛇 / 爬虫 */
export type View = "home" | "snake" | "crawler";

function App() {
  const [view, setView] = useState<View>("home");
  // 开机动画：每个浏览器会话只显示一次
  const [showBoot, setShowBoot] = useState(() => sessionStorage.getItem("booted") !== "1");

  /** 跳转到首页某个板块 */
  const goSection = (id: string) => {
    if (view !== "home") {
      setView("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 90);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {showBoot && <BootScreen onDone={() => setShowBoot(false)} />}

      <Navbar view={view} onNavigate={setView} />

      {view === "home" && (
        <main>
          <Hero onOpen={setView} onNavigate={goSection} />
          <About />
          <Stats />
          <Experience />
          <Projects onOpen={setView} />
          <Contact />
          <Footer />
        </main>
      )}

      {view === "snake" && <SnakeGame onBack={() => setView("home")} />}
      {view === "crawler" && <CrawlerDemo onBack={() => setView("home")} />}

      <MusicPlayer />
      <Toasts />
    </>
  );
}

export default App;
