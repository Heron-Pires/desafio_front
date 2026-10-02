import { NextResponse } from "next/server";
import { API_URL } from "@/services/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let upstreamOk = false;
  let upstreamStatus = "unreachable";

  try {
    const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const cleanUrl = rawBaseUrl.replace(/\/+$/, "");

    const res = await fetch(`${cleanUrl}/courses`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    }).catch(() => null);

    if (res && (res.ok || res.status < 500)) {
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
