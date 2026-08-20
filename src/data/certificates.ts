/**
 * 证书墙数据 —— 证书图片和文字都在这里配置！
 *
 * 图片放法：把证书图片放到 public/certificates/ 文件夹，
 * 然后在这里把 image 改成你的图片文件名。
 *
 * 也可以不改文件名：把 public/certificates/cert-1.svg 等占位图
 * 替换成你自己的图片并保持同名即可。
 */

export interface CertificateItem {
  title: string;   // 证书名称
  date: string;    // 获得时间
  image: string;   // 图片路径（放在 public/certificates/ 下）
}

export const certificates: CertificateItem[] = [
  { title: "证书 1", date: "2026", image: "/certificates/cert-1.jpg" },
  { title: "证书 2", date: "20XX", image: "/certificates/cert-2.jpg" },
  { title: "证书 3", date: "20XX", image: "/certificates/cert-3.jpg" },
];