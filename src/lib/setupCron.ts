import { Client } from "@upstash/qstash";

export async function setupCron() {
  const client = new Client({ token: process.env.QSTASH_TOKEN! });
  await client.schedules.create({
    destination: `${process.env.NEXT_PUBLIC_APP_URL}/api/cron-refresh`,
    cron: "0 1 * * *", // по UTC — 01:00, что соответствует 04:00 UTC+3
    scheduleId: "refresh-apartments-cache",
  });
}