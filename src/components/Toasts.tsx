import { useEffect, useState } from "react";
import { subscribeToast, type ToastItem } from "../utils/toast";

/** 右上角 toast 消息列表 */
export default function Toasts() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToast((t) => {
      setItems((arr) => [...arr, t]);
      setTimeout(() => setItems((arr) => arr.filter((x) => x.id !== t.id)), 3400);
    });
  }, []);

  return (
    <div className="toasts">
      {items.map((t) => (
        <div key={t.id} className={"toast toast-" + t.type}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
