import { profile } from "../data/profile";
import Reveal from "./Reveal";

/** 个人简历：基本信息 / 技能 / 教育 / 简介 */
export default function About() {
  return (
    <section id="about" className="section">
      <Reveal>
        <p className="section-label">{"$ cat about.md"}</p>
        <h2 className="section-title">个人简历</h2>
        <p className="section-sub">基本信息 · 专业技能 · 教育经历</p>
      </Reveal>

      <div className="resume-grid">
        <Reveal className="card">
          <h3 className="card-title">基本信息</h3>
          <ul className="info-list">
            <li><span>姓名</span>{profile.name}</li>
            <li><span>身份</span>{profile.title}</li>
            <li><span>城市</span>{profile.location}</li>
            <li><span>邮箱</span><a href={"mailto:" + profile.email}>{profile.email}</a></li>
          </ul>
        </Reveal>

        <Reveal className="card">
          <h3 className="card-title">专业技能</h3>
          <div className="skills">
            {profile.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
          </div>
        </Reveal>

        <Reveal className="card">
          <h3 className="card-title">教育经历</h3>
          {profile.education.map((e) => (
            <div key={e.school} className="edu-item">
              <p className="item-title">{e.school} <span className="period">{e.period}</span></p>
              <p className="item-sub">{e.degree}</p>
              <p className="item-desc">{e.desc}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="card">
          <h3 className="card-title">个人简介</h3>
          <p className="item-desc">{profile.intro}</p>
        </Reveal>
      </div>
    </section>
  );
}
