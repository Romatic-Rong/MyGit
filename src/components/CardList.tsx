"use client";

import type { Card } from "@/lib/cards";
import { useRouter } from "next/navigation";

export function CardList({ cards }: { cards: Card[] }) {
  const router = useRouter();

  async function handleDelete(id: number) {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/cards/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-colors space-y-3"
        >
          <div className="flex items-start justify-between">
            <h2 className="font-bold text-lg">{card.title}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {card.difficulty === "beginner" ? "入门" : card.difficulty === "intermediate" ? "中级" : "进阶"}
            </span>
          </div>

          <p className="text-text-muted text-sm line-clamp-3">{card.explanation}</p>

          {card.related && card.related.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.related.map((r, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-surface-2 text-xs text-text-muted border border-border">
                  {r}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleDelete(card.id!)}
              className="px-3 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              🗑️ 删除
            </button>
            <span className="text-xs text-text-muted ml-auto">
              {card.created_at ? new Date(card.created_at).toLocaleDateString("zh-CN") : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
