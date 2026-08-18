import { profile } from "../data/profile";
import { loadSolved } from "../data/flags";
import { useCountUp } from "../hooks/useCountUp";
import Reveal from "./Reveal";

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const { ref, value: n } = useCountUp(value);
  return (
    <div ref={ref} className="stat">
      <p className="stat-num">{n}{suffix}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

/** 成就数据条：仿 CTF 平台的数据展示 */
export default function Stats() {
  const visits = Number(localStorage.getItem("visits") || "0");

  return (
    <Reveal className="stats">
      <Stat label="技能数量" value={profile.skills.length} />
      <Stat label="可玩项目" value={2} />
      <Stat label="已解 Flag" value={loadSolved().length} />
      <Stat label="本机访问" value={visits} />
    </Reveal>
  );
}
