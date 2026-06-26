import { supabase } from "./supabase";

export interface Card {
  id?: number;
  created_at?: string;
  user_id?: string;
  topic: string;
  title: string;
  explanation: string;
  mnemonic?: string;
  related?: string[];
  difficulty?: string;
  tags?: string[];
  favorite?: boolean;
  review_count?: number;
  next_review?: string;
  interval_days?: number;
  ease_factor?: number;
  repetitions?: number;
}

// 保存卡片
export async function saveCard(card: Card) {
  const { data, error } = await supabase
    .from("cards")
    .insert({
      topic: card.topic,
      title: card.title,
      explanation: card.explanation,
      mnemonic: card.mnemonic || "",
      related: card.related || [],
      difficulty: card.difficulty || "beginner",
      tags: card.tags || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 获取所有卡片
export async function listCards() {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Card[];
}

// 获取今日待复习的卡片
export async function getDueCards() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .lte("next_review", now)
    .order("next_review", { ascending: true });

  if (error) throw error;
  return data as Card[];
}

// SM-2 间隔重复算法
export function calcNextReview(
  rating: number, // 0-5 (0=完全忘记, 3=困难, 5=轻松)
  prevInterval: number,
  prevEase: number,
  prevReps: number
) {
  let interval: number;
  let ease = prevEase;
  let reps = prevReps;

  if (rating >= 3) {
    // 记住了
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(prevInterval * ease);

    reps += 1;
  } else {
    // 忘了
    reps = 0;
    interval = 1;
  }

  // 调整 ease factor
  ease = ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  ease = Math.max(1.3, ease);

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    next_review: nextDate.toISOString(),
    interval_days: interval,
    ease_factor: Number(ease.toFixed(2)),
    repetitions: reps,
  };
}

// 更新复习进度
export async function updateReview(
  id: number,
  rating: number,
  prevInterval: number,
  prevEase: number,
  prevReps: number,
  prevReviewCount: number
) {
  const review = calcNextReview(rating, prevInterval, prevEase, prevReps);

  const { error } = await supabase
    .from("cards")
    .update({
      ...review,
      review_count: prevReviewCount + 1,
    })
    .eq("id", id);

  if (error) throw error;
  return review;
}

// 获取复习统计
export async function getReviewStats() {
  const now = new Date().toISOString();
  const { data: all, error: e1 } = await supabase.from("cards").select("id");
  const { data: due, error: e2 } = await supabase
    .from("cards")
    .select("id")
    .lte("next_review", now);

  if (e1 || e2) return { total: 0, due: 0 };
  return { total: all.length, due: due.length };
}

// 删除卡片
export async function deleteCard(id: number) {
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) throw error;
}
