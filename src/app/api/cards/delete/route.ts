import { deleteCard } from "@/lib/cards";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    await deleteCard(id);
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
