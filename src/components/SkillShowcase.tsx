import { useState } from "react";
import { skillShowcase, type SkillShowcaseItem } from "../data/skills";
import Reveal from "./Reveal";

function SkillCard({ item }: { item: SkillShowcaseItem }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="card skill-show-card">
      {imgOk ? (
        <img
          src={item.image}
          alt={item.title}
          className="skill-show-img"
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="skill-img-fallback">
          <span>🖼️ 图片未找到</span>
          <span>{item.image}</span>
        </div>
      )}
      <div className="skill-show-body">
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
    </div>
  );
}

/** 技能说明区块：图片由用户自己上传到 public/skills/ */
export default function SkillShowcase() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <p className="section-label">{"$ cat skills/"}</p>
        <h2 className="section-title">技能说明</h2>
        <p className="section-sub">我的技能与说明（图片可自行替换）</p>
      </Reveal>

      <div className="skills-showcase-grid">
        {skillShowcase.map((s, i) => (
          <Reveal key={i}>
            <SkillCard item={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}