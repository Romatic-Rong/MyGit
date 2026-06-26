import { listCards } from "@/lib/cards";
import { CardList } from "@/components/CardList";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  let cards: Awaited<ReturnType<typeof listCards>> = [];
  try {
    cards = await listCards();
  } catch {
    cards = [];
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📂 全部卡片</h1>
      {cards.length === 0 ? (
        <p className="text-text-muted">还没有卡片，去首页生成你的第一张！</p>
      ) : (
        <CardList cards={cards} />
      )}
    </div>
  );
}
