import { lifePhotos } from "../data/life";
import Reveal from "./Reveal";

/** 生活板块：照片墙 */
export default function Life() {
  return (
    <section id="life" className="section">
      <Reveal>
        <p className="section-label">{"$ ls life/"}</p>
        <h2 className="section-title">生活碎片</h2>
        <p className="section-sub">记录日常 · 分享热爱</p>
      </Reveal>

      <div className="life-wall">
        {lifePhotos.map((p, i) => (
          <Reveal key={i} className="life-card">
            <img src={p.image} alt={p.title} loading="lazy" />
            <div className="life-info">
              <span className="life-title">{p.title}</span>
              <span className="life-date">{p.date}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}