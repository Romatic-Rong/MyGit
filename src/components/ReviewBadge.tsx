"use client";

import { useState, useEffect } from "react";

export function ReviewBadge() {
  const [due, setDue] = useState(0);
  const [notifyGranted, setNotifyGranted] = useState(false);

  useEffect(() => {
    // 注册 Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 检查通知权限
    if ("Notification" in window && Notification.permission === "granted") {
      setNotifyGranted(true);
    }

    // 查待复习数量
    fetch("/api/cards/list")
      .then((r) => r.json())
      .then((cards: any[]) => {
        const now = new Date().toISOString();
        const dueCount = cards.filter((c) => c.next_review && c.next_review <= now).length;
        setDue(dueCount);
      })
      .catch(() => {});
  }, []);

  async function enableNotify() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifyGranted(true);
      // 测试通知
      new Notification("AI Flashcards", {
        body: `你有 ${due} 张卡片待复习！打开复习吧。`,
        icon: "/icon.png",
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      {due > 0 && (
        <a
          href="/review"
          className="relative flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
        >
          📝 待复习
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent text-black text-xs font-bold">
            {due}
          </span>
        </a>
      )}
      {!notifyGranted && (
        <button
          onClick={enableNotify}
          className="px-2 py-1 rounded-full bg-surface-2 border border-border text-text-muted text-xs hover:text-text transition-colors"
          title="开启复习提醒"
        >
          🔔
        </button>
      )}
    </div>
  );
}
