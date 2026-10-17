import { NextResponse } from "next/server";
import { apiClient, API_URL } from "@/services/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let upstreamOk = false;
  let upstreamStatus = "unreachable";

  try {
    const res = await apiClient.get("/health", { timeout: 3000 });
    if (res.status === 200) {
      upstreamOk = true;
      upstreamStatus = "connected";
    }
  } catch {
    upstreamStatus = "error";
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    upstream: {
      url: API_URL || "not_configured",
      status: upstreamStatus,
      reachable: upstreamOk,
    },
    latencyMs: Date.now() - startTime,
  });
}
