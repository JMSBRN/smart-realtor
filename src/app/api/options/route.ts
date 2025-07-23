import { NextResponse } from "next/server";
import cacheManager from "@/lib/cache/manager";
import { adminDb } from "@/lib/firebase/admin";
import { generateSteps } from "@/lib/steps";
import { Apartment } from "@/types/apartment";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const optionsCacheKey = "chatbot:options";
    const apartmentsCacheKey = "apartments:all";

    // Try to get cached options first
    const cachedOptions = await cacheManager.get(optionsCacheKey);
    if (cachedOptions) {
      return NextResponse.json({ from: "cache", data: cachedOptions });
    }

    let apartments: Apartment[] = [];
    const cachedApartments = await cacheManager.get(apartmentsCacheKey);

    if (Array.isArray(cachedApartments) && cachedApartments.length > 0) {
      apartments = cachedApartments as Apartment[];
    } else {
      const snapshot = await adminDb.collection("apartments").get();
      apartments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Apartment[];

      if (apartments.length > 0) {
        // Cache apartments for future use
        await cacheManager.set(apartmentsCacheKey, apartments, 60 * 60 * 24);
      }
    }
    
    // Generate steps (which include options)
    const steps = generateSteps(apartments);

    // Extract options from steps for caching
    const optionsMap: Record<string, string[] | null> = {};
    steps.forEach(step => {
      optionsMap[step.id] = step.options;
    });

    // Cache the generated options
    await cacheManager.set(optionsCacheKey, optionsMap, 60 * 60 * 24);

    return NextResponse.json({ from: "generated", data: optionsMap });
  } catch (error) {
    console.error("API Options: Error generating/caching options:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
