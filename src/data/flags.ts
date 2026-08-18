/** 项目 flag（挑战口令）：在项目卡片底部提交正确的 flag 即可解锁"已解决"成就 */

export const flags: Record<string, string> = {
  snake: "flag{snake_2026}",
  crawler: "flag{crawler_2026}",
  vision: "flag{vision_2026}",
};

/** 读取已解决的 flag 列表（存 localStorage） */
export function loadSolved(): string[] {
  try {
    const raw = localStorage.getItem("solvedFlags");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** 标记一个 flag 为已解决 */
export function addSolved(key: string): string[] {
  const list = loadSolved();
  if (!list.includes(key)) {
    list.push(key);
    localStorage.setItem("solvedFlags", JSON.stringify(list));
  }
  return list;
}