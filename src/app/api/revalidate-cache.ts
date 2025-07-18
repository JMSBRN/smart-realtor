import { NextApiRequest, NextApiResponse } from "next";
import { fetchApartments } from "@/lib/fetchAppartments";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await  fetchApartments();
  res.status(200).json({ ok: true });
}