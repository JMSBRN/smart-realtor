import { NextResponse } from "next/server";
import cacheManager from "@/lib/cache/manager";
import { fetchApartments } from "@/lib/fetchApartments";

export async function GET() {
  try {
    await cacheManager.del("apartments:{}");
    const { count } = await fetchApartments(); // повторная загрузка

    return NextResponse.json({
      success: true,
      message: `Кэш успешно обновлен. Загружено ${count} квартир.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}