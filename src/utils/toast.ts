/** 轻量 toast 消息系统：任何组件都能调用 toast() 弹出提示 */

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let listeners: ((t: ToastItem) => void)[] = [];
let nextId = 1;

export function toast(message: string, type: ToastType = "info") {
  const item: ToastItem = { id: nextId++, message, type };
  listeners.forEach((l) => l(item));
}

export function subscribeToast(fn: (t: ToastItem) => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
