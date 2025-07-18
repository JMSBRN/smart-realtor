// app/results/page.tsx
import { getCachedApartments } from "@/lib/cacheServer";
import Card from "@/components/Card";
import { Apartment } from "@/types/apartment";

export default async function ResultsPage() {
  const appartments = await  getCachedApartments();

  // (позже сюда можно передавать фильтры из Firestore)
  const filtered = appartments.slice(0, 10); // пока просто первые 10

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Подходящие квартиры</h1>
      {filtered.map((apt: Apartment) => (
        <Card key={apt["objectCode"]} data={apt} />
      ))}
    </div>
  );
}
