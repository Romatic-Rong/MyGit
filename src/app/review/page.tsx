import { getDueCards, getReviewStats } from "@/lib/cards";
import { ReviewClient } from "@/components/ReviewClient";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  let cards: Awaited<ReturnType<typeof getDueCards>> = [];
  let stats = { total: 0, due: 0 };
  try {
    cards = await getDueCards();
    stats = await getReviewStats();
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📝 今日复习</h1>
        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
            待复习 {stats.due} 张
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-2 text-text-muted">
            共 {stats.total} 张
          </span>
        </div>
      </div>
      {cards.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-4xl">🎉</p>
          <p className="text-text-muted text-lg">今天没有待复习的卡片</p>
          <p className="text-text-muted text-sm">去首页生成新卡片，或等明天再来复习</p>
          <a href="/" className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary text-white font-medium">
            生成新卡片
          </a>
        </div>
      ) : (
        <ReviewClient cards={cards} />
      )}
    </div>
  );
}
