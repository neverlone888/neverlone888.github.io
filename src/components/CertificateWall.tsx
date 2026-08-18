import { useState } from "react";
import { certificates, type CertificateItem } from "../data/certificates";
import Reveal from "./Reveal";

/** 每张证书的轻微倾斜角度，营造照片墙的感觉 */
const TILTS = [-2, 1.6, -1.2, 2.2];

function CertCard({ item, index }: { item: CertificateItem; index: number }) {
  const [imgOk, setImgOk] = useState(true);
  const tilt = TILTS[index % TILTS.length];
  return (
    <div className="cert-frame" style={{ transform: "rotate(" + tilt + "deg)" }}>
      {imgOk ? (
        <img src={item.image} alt={item.title} loading="lazy" onError={() => setImgOk(false)} />
      ) : (
        <div className="cert-fallback">
          <span>🖼️ 图片未找到</span>
          <span>{item.image}</span>
        </div>
      )}
      <p className="cert-name">{item.title}</p>
      <p className="cert-date">{item.date}</p>
    </div>
  );
}

/** 证书墙：照片墙风格，图片由用户上传到 public/certificates/ */
export default function CertificateWall() {
  return (
    <section id="certificates" className="section">
      <Reveal>
        <p className="section-label">{"$ ls certs/"}</p>
        <h2 className="section-title">证书墙</h2>
        <p className="section-sub">我的证书与荣誉（图片可自行替换）</p>
      </Reveal>

      <div className="cert-wall">
        {certificates.map((c, i) => (
          <Reveal key={i}>
            <CertCard item={c} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}