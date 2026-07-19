import { NextResponse } from "next/server";
import { STATIONS } from "@/data/stations";
import { isValidLatLng } from "@/lib/geo";
import { planDelivery } from "@/lib/planner";
import { getGrade } from "@/lib/concrete";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { client, truck, gradeId, volume, stationId } = (body ?? {}) as {
    client?: unknown;
    truck?: unknown;
    gradeId?: unknown;
    volume?: unknown;
    stationId?: unknown;
  };

  if (!isValidLatLng(client)) {
    return NextResponse.json(
      { error: "`client` must be { lat, lng }" },
      { status: 400 },
    );
  }
  if (truck !== undefined && !isValidLatLng(truck)) {
    return NextResponse.json(
      { error: "`truck` must be { lat, lng } when provided" },
      { status: 400 },
    );
  }

  // Grade is optional — no grade selected means concrete cost = 0.
  const grade =
    typeof gradeId === "string" && gradeId ? getGrade(gradeId) ?? null : null;
  const vol = typeof volume === "number" && volume > 0 ? volume : 0;

  // Opaque station index the customer picked. Anything malformed is dropped and
  // the planner falls back to the nearest plant (see planDelivery).
  const preferred = typeof stationId === "string" && stationId ? stationId : undefined;

  try {
    const plan = await planDelivery(client, STATIONS, grade, vol, truck, preferred);
    return NextResponse.json(plan);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Routing failed";
    // OSRM unreachable or no route — surface a clear, actionable error.
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
