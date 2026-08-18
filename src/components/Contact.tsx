import { profile } from "../data/profile";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal>
        <p className="section-label">{"$ ./contact.sh"}</p>
        <h2 className="section-title">联系我</h2>
        <p className="section-sub">欢迎交流与合作</p>
      </Reveal>

      <Reveal className="card contact-card">
        <p className="item-title">邮箱：<a href={"mailto:" + profile.email}>{profile.email}</a></p>
        <p className="item-title">GitHub：<a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></p>
        <p className="item-title">所在地：{profile.location}</p>
      </Reveal>
    </section>
  );
}
