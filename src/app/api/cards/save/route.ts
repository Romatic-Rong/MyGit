import { saveCard } from "@/lib/cards";

export async function POST(req: Request) {
  try {
    const card = await req.json();
    const saved = await saveCard(card);
    return Response.json(saved, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
