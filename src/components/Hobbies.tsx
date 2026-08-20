import { profile } from "../data/profile";
import Reveal from "./Reveal";

/** 兴趣爱好板块 */
export default function Hobbies() {
  return (
    <section id="hobbies" className="section">
      <Reveal>
        <p className="section-label">{"$ ls hobbies/"}</p>
        <h2 className="section-title">兴趣爱好</h2>
        <p className="section-sub">工作学习之余，我喜欢这些</p>
      </Reveal>

      <div className="interest-grid">
        {profile.hobbies.map((h, i) => (
          <Reveal key={i} className="card interest-card">
            <span className="interest-icon">{h.icon}</span>
            <h3 className="interest-name">{h.name}</h3>
            <p className="item-desc">{h.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}