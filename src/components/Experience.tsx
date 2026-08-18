import { profile } from "../data/profile";
import Reveal from "./Reveal";

/** 个人经历：时间线 */
export default function Experience() {
  return (
    <section id="experience" className="section">
      <Reveal>
        <p className="section-label">{"$ ls experience/"}</p>
        <h2 className="section-title">个人经历</h2>
        <p className="section-sub">学习与实践经历</p>
      </Reveal>

      <div className="timeline">
        {profile.experience.map((item, i) => (
          <Reveal key={i} className="timeline-item">
            <div className="timeline-dot" aria-hidden="true"></div>
            <div className="card">
              <p className="item-title">{item.company} <span className="period">{item.period}</span></p>
              <p className="item-sub">{item.role}</p>
              <p className="item-desc">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
