import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { Lead } from "@/types/lead";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация данных (можно заменить на Zod или Yup при желании)
    const lead: Lead = {
      budget: body.budget || "",
      city: body.city || "",
      phone_number: body.phone_number || "",
      email: body.email || "",
      goal: body.goal || "",
      messenger: body.messenger || "",
      mortgage: body.mortgage || "",
      region: body.region || "",
      rooms: body.rooms || "",
    };

    const timestamp = new Date().toISOString();

    const docRef = await adminDb.collection("leads").add({
      ...lead,
      createdAt: timestamp,
    });

    return NextResponse.json({ id: docRef.id }, { status: 200 });
  } catch (err) {
    console.error("Ошибка при сохранении лида:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
