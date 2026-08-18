/**
 * 技能说明数据 —— 图片和文字都在这里配置！
 *
 * 图片放法：把图片文件放到 public/skills/ 文件夹，
 * 然后在这里把 image 改成你的图片文件名（例如 "/skills/我的证书.png"）。
 *
 * 也可以不改文件名：把 public/skills/skill-1.svg 等占位图
 * 替换成你自己的图片并保持同名即可。
 */

export interface SkillShowcaseItem {
  title: string;   // 技能名称
  desc: string;    // 技能说明
  image: string;   // 图片路径（放在 public/skills/ 下）
}

export const skillShowcase: SkillShowcaseItem[] = [
  {
    title: "医学基础",
    desc: "主修法医学，系统学习医学基础与临床知识。",
    image: "/skills/skill-1.svg",
  },
  {
    title: "AI 编程",
    desc: "辅修人工智能，学习 Python、机器学习与数据分析。",
    image: "/skills/skill-2.svg",
  },
  {
    title: "前端开发",
    desc: "使用 React + TypeScript 构建网页应用。",
    image: "/skills/skill-3.svg",
  },
  {
    title: "网络爬虫",
    desc: "使用 Python 编写爬虫抓取公开数据。",
    image: "/skills/skill-4.svg",
  },
];