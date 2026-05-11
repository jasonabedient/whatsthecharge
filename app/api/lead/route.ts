import { NextRequest, NextResponse } from "next/server"

// POST /api/lead
// Captures an email + calculator context to the Notion "EV Calculator Leads" DB.
// Env vars required:
//   NOTION_TOKEN              - Notion integration token (secret_xxx)
//   NOTION_LEADS_DATA_SOURCE  - data source UUID (e.g. d06ec7ee-070b-4d18-9f24-f396f6b031a5)
//
// MailerLite sync is intentionally deferred — leads land in Notion now,
// and we'll add a Notion -> MailerLite sync job once MailerLite is fully set up.

interface LeadPayload {
  email: string
  vehicle?: string
  batteryKwh?: number | null
  state?: string
  ratePlan?: string
  electricityRate?: number | null
  estCost?: number | null
  kwhNeeded?: number | null
  hours?: number | null
}

function isEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function POST(req: NextRequest) {
  const token = process.env.NOTION_TOKEN
  const dataSourceId = process.env.NOTION_LEADS_DATA_SOURCE

  if (!token || !dataSourceId) {
    console.error("[api/lead] Missing NOTION_TOKEN or NOTION_LEADS_DATA_SOURCE env var")
    return NextResponse.json(
      { ok: false, error: "Server not configured" },
      { status: 500 },
    )
  }

  let body: LeadPayload
  try {
    body = (await req.json()) as LeadPayload
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  if (!isEmail(body.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 })
  }

  const sourceDomain = req.headers.get("host") ?? ""
  const userAgent = req.headers.get("user-agent") ?? ""

  const properties: Record<string, unknown> = {
    Email: { title: [{ text: { content: body.email } }] },
  }
  if (body.vehicle)
    properties.Vehicle = { rich_text: [{ text: { content: body.vehicle } }] }
  if (body.batteryKwh != null)
    properties["Battery kWh"] = { number: body.batteryKwh }
  if (body.state)
    properties.State = { rich_text: [{ text: { content: body.state } }] }
  if (body.ratePlan)
    properties["Rate Plan"] = { select: { name: body.ratePlan } }
  if (body.electricityRate != null)
    properties["Electricity Rate"] = { number: body.electricityRate }
  if (body.estCost != null)
    properties["Est. Cost"] = { number: body.estCost }
  if (body.kwhNeeded != null)
    properties["kWh Needed"] = { number: body.kwhNeeded }
  if (body.hours != null) properties.Hours = { number: body.hours }
  if (sourceDomain)
    properties["Source Domain"] = {
      rich_text: [{ text: { content: sourceDomain } }],
    }
  if (userAgent)
    properties["User Agent"] = {
      rich_text: [{ text: { content: userAgent.slice(0, 1900) } }],
    }

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2025-09-03",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { type: "data_source_id", data_source_id: dataSourceId },
        properties,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("[api/lead] Notion error", res.status, errText)
      return NextResponse.json(
        { ok: false, error: "Failed to save lead" },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[api/lead] Unexpected error", err)
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 },
    )
  }
}
