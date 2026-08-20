import { profile } from "../data/profile";
import Reveal from "./Reveal";

/** 个人特长板块 */
export default function Strengths() {
  return (
    <section id="strengths" className="section">
      <Reveal>
        <p className="section-label">{"$ ./strengths --list"}</p>
        <h2 className="section-title">个人特长</h2>
        <p className="section-sub">我的优势与特长</p>
      </Reveal>

      <div className="interest-grid">
        {profile.strengths.map((s, i) => (
          <Reveal key={i} className="card interest-card">
            <span className="interest-icon">{s.icon}</span>
            <h3 className="interest-name">{s.name}</h3>
            <p className="item-desc">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}