"use client";

import { useState } from "react";
import type { Card } from "@/lib/cards";
import { useRouter } from "next/navigation";

export function ReviewClient({ cards }: { cards: Card[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const router = useRouter();

  const card = cards[index];
  if (!card && !done) {
    return <p className="text-text-muted text-center py-20">没有更多卡片了</p>;
  }

  if (done) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-4xl">✅</p>
        <p className="text-text-muted text-lg">
          本轮复习完成！
          {cards.length > 0 && " 下一轮将在明天到来。"}
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <a href="/cards" className="px-5 py-3 rounded-xl bg-surface border border-border text-text-muted hover:text-text">
            查看卡片
          </a>
          <a href="/review" className="px-5 py-3 rounded-xl bg-primary text-white font-medium">
            再来一轮
          </a>
        </div>
      </div>
    );
  }

  async function handleRate(r: number) {
    setRating(r);
    await fetch("/api/cards/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: card.id,
        rating: r,
        interval_days: card.interval_days || 0,
        ease_factor: card.ease_factor || 2.5,
        repetitions: card.repetitions || 0,
        review_count: card.review_count || 0,
      }),
    });

    // 短暂延迟后切换下一张
    setTimeout(() => {
      setFlipped(false);
      setRating(null);
      if (index + 1 >= cards.length) {
        setDone(true);
      } else {
        setIndex(index + 1);
      }
    }, 600);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* 进度 */}
      <div className="flex items-center gap-3 text-sm text-text-muted">
        <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
        <span>
          {index + 1} / {cards.length}
        </span>
      </div>

      {/* 卡片 */}
      <div
        className="relative rounded-2xl bg-surface border border-border p-8 min-h-[300px] cursor-pointer select-none transition-all hover:border-primary/30"
        onClick={() => !rating && setFlipped(!flipped)}
      >
        {!flipped ? (
          /* 正面：标题 */
          <div className="flex flex-col items-center justify-center h-full space-y-6 pt-8">
            <p className="text-text-muted text-sm uppercase tracking-wider">
              点击翻看答案
            </p>
            <h2 className="text-2xl font-bold text-center">{card.title}</h2>
            <div className="flex flex-wrap gap-1 justify-center">
              {(card.tags || []).map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-surface-2 text-xs text-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-text-muted text-xs">主题：{card.topic}</p>
          </div>
        ) : (
          /* 反面：解释+记忆口诀 */
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">📖 解释</p>
              <p className="text-text leading-relaxed">{card.explanation}</p>
            </div>
            {card.mnemonic && (
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">💡 记忆口诀</p>
                <p className="text-accent font-medium">{card.mnemonic}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 评分按钮 — 翻面后出现 */}
      {flipped && !rating && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleRate(0)}
            className="px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium"
          >
            😵<br /><span className="text-xs">完全忘了</span>
          </button>
          <button
            onClick={() => handleRate(3)}
            className="px-5 py-3 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors font-medium"
          >
            🤔<br /><span className="text-xs">有点困难</span>
          </button>
          <button
            onClick={() => handleRate(5)}
            className="px-5 py-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors font-medium"
          >
            😎<br /><span className="text-xs">轻松回忆</span>
          </button>
        </div>
      )}

      {rating !== null && (
        <p className="text-center text-sm text-text-muted animate-pulse">
          {rating >= 5 ? "太棒了！" : rating >= 3 ? "加油！" : "没关系，下次记住它！"}
        </p>
      )}
    </div>
  );
}
