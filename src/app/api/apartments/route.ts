import { NextResponse } from "next/server";
import cacheManager from "@/lib/cache/manager";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cacheKey = "apartments:{}";

    // 1. Попытка взять из кэша
    const cached = await cacheManager.get(cacheKey);

    if (cached) {
      return NextResponse.json({ from: "cache", data: cached });
    }

    // 2. Получение из Firebase
    const snapshot = await adminDb.collection("apartments").get();

    const apartments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3. Сохраняем в Redis на 24 часа
    await cacheManager.set(cacheKey, apartments, 60 * 60 * 24);

    return NextResponse.json({ from: "firebase", data: apartments });
  } catch (error) {
    if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
}
  }
}
