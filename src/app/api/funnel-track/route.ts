import { NextResponse } from "next/server";
import { sendFunnelEvent } from "@/lib/funnelServer";

type TrackBody = {
  event_type?: string;
  visitor_id?: string;
  email?: string;
  marketing_ref?: string | null;
  properties?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let body: TrackBody;
  try {
    body = (await request.json()) as TrackBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.event_type || typeof body.event_type !== "string") {
    return NextResponse.json({ error: "missing event_type" }, { status: 400 });
  }
  await sendFunnelEvent({
    eventType: body.event_type,
    visitorId: body.visitor_id ?? null,
    email: body.email ?? null,
    marketingRef: body.marketing_ref ?? null,
    properties: body.properties ?? null,
  });
  return new NextResponse(null, { status: 204 });
}
