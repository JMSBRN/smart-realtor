import { Apartment } from "@/types/apartment";
import React from "react";

export default function ApartmentCard({ data }: { data: Apartment }) {
  return (
    <div className="rounded-2xl shadow-md p-4 border border-gray-200 bg-white">
      <h2 className="text-lg font-semibold mb-1">
        {data.roomsCount}-комнатная, {data.totalArea} м²
      </h2>
      <p className="text-sm text-gray-600">
        {data.region}, {data.settlement}, {data.street || "-"}
      </p>
      <p className="text-md font-bold mt-2">
        {data.price} {data.currency}
      </p>
      <p className="text-sm text-gray-500">
        Этаж: {data.floor} из {data.floorsTotal} • Тип: {data.buildingType || "—"}
      </p>
    </div>
  );
}
