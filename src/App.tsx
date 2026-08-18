import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";
import SnakeGame from "./projects/SnakeGame";
import CrawlerDemo from "./projects/CrawlerDemo";
import "./App.css";

/** 页面视图：首页 / 贪吃蛇 / 爬虫 */
export type View = "home" | "snake" | "crawler";

function App() {
  const [view, setView] = useState<View>("home");

  return (
    <>
      <Navbar view={view} onNavigate={setView} />

      {view === "home" && (
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects onOpen={setView} />
          <Contact />
          <Footer />
        </main>
      )}

      {view === "snake" && <SnakeGame onBack={() => setView("home")} />}
      {view === "crawler" && <CrawlerDemo onBack={() => setView("home")} />}

      <MusicPlayer />
    </>
  );
}

export default App;
