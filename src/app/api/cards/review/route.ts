import { updateReview } from "@/lib/cards";

export async function POST(req: Request) {
  try {
    const { id, rating, interval_days, ease_factor, repetitions, review_count } =
      await req.json();
    const result = await updateReview(
      id,
      rating,
      interval_days || 0,
      ease_factor || 2.5,
      repetitions || 0,
      review_count || 0
    );
    return Response.json(result);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
