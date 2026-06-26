import { listCards } from "@/lib/cards";

export async function GET() {
  try {
    const cards = await listCards();
    return Response.json(cards);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
