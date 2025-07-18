import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const timestamp = new Date().toISOString();

    const docRef = await adminDb.collection("Leads").add({
      ...data,
      createdAt: timestamp,
    });

    return NextResponse.json({ id: docRef.id }, { status: 200 });
  } catch (err) {
    console.error("Ошибка при сохранении лида:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
