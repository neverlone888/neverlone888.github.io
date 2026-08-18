import { useEffect, useRef, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";

/** 音乐播放器：播放《Call of Silence》（泽野弘之） */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(() => loadFromStorage("musicVolume", 0.5));
  const [panelOpen, setPanelOpen] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    saveToStorage("musicVolume", volume);
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setMissing(true));
    }
  }

  return (
    <div className="music-player">
      <div className={"music-panel" + (panelOpen ? " open" : "")}>
        <span className="music-title">♪ Call of Silence</span>
        <span className="music-sub">泽野弘之 · Hiroyuki Sawano</span>
        {missing && (
          <span className="music-tip">
            未找到音乐文件：请把 MP3 放到 public/music/call-of-silence.mp3
          </span>
        )}
        <div className="music-volume-row">
          <span>音量</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button className="music-btn" onClick={togglePlay} title="播放 / 暂停音乐" aria-label="播放暂停">
          <span className={"music-disc" + (playing ? "" : " paused")} />
        </button>
        <button
          className="music-panel-btn"
          onClick={() => setPanelOpen(!panelOpen)}
          title="音量设置"
          aria-label="音量设置"
        >
          🔊
        </button>
      </div>

      <audio
        ref={audioRef}
        src="/music/call-of-silence.mp3"
        loop
        preload="auto"
        onError={() => setMissing(true)}
      />
    </div>
  );
}
