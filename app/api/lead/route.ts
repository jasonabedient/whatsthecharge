import { NextRequest, NextResponse } from "next/server"

// POST /api/lead
// Captures an email + calculator context to:
//   1. Notion "EV Calculator Leads" DB (durable record / CMS)
//   2. MailerLite "EV Calculator" group (email automation)
//
// Env vars required:
//   NOTION_TOKEN              - Notion integration token (secret_xxx)
//   NOTION_LEADS_DATA_SOURCE  - data source UUID
//   MAILERLITE_API_KEY        - MailerLite API token (JWT)
//   MAILERLITE_GROUP_ID       - Numeric ID of the EV Calculator group
//
// Both sinks run in parallel. Notion is the primary; if it fails we return 502.
// MailerLite failures are logged but do NOT fail the request — Notion still has
// the lead and we can backfill MailerLite later from the Notion record
// (the "Synced to MailerLite" checkbox in Notion tracks sync state).

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

async function writeToNotion(
  token: string,
  dataSourceId: string,
  body: LeadPayload,
  sourceDomain: string,
  userAgent: string,
): Promise<{ ok: boolean; error?: string }> {
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
  if (body.estCost != null) properties["Est. Cost"] = { number: body.estCost }
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
    return { ok: false, error: `Notion ${res.status}` }
  }
  return { ok: true }
}

async function writeToMailerLite(
  token: string,
  groupId: string,
  body: LeadPayload,
  sourceDomain: string,
): Promise<{ ok: boolean; error?: string }> {
  // MailerLite custom fields (created via API on 2026-05-11):
  //   vehicle, battery_kwh, state, rate_plan,
  //   electricity_rate, est_cost, kwh_needed, hours, source_domain
  const fields: Record<string, unknown> = {}
  if (body.vehicle) fields.vehicle = body.vehicle
  if (body.batteryKwh != null) fields.battery_kwh = body.batteryKwh
  if (body.state) fields.state = body.state
  if (body.ratePlan) fields.rate_plan = body.ratePlan
  if (body.electricityRate != null) fields.electricity_rate = body.electricityRate
  if (body.estCost != null) fields.est_cost = body.estCost
  if (body.kwhNeeded != null) fields.kwh_needed = body.kwhNeeded
  if (body.hours != null) fields.hours = body.hours
  if (sourceDomain) fields.source_domain = sourceDomain

  // POST /api/subscribers is an upsert (create or update by email).
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      fields,
      groups: [groupId],
      status: "active",
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("[api/lead] MailerLite error", res.status, errText)
    return { ok: false, error: `MailerLite ${res.status}` }
  }
  return { ok: true }
}

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN
  const notionDataSource = process.env.NOTION_LEADS_DATA_SOURCE
  const mlToken = process.env.MAILERLITE_API_KEY
  const mlGroup = process.env.MAILERLITE_GROUP_ID

  if (!notionToken || !notionDataSource) {
    console.error(
      "[api/lead] Missing NOTION_TOKEN or NOTION_LEADS_DATA_SOURCE env var",
    )
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

  try {
    // Run both writes in parallel. Notion is the primary record; if it fails
    // we surface an error to the client. MailerLite failures are logged but
    // do not fail the request — Notion holds the lead and a backfill job
    // can sync to MailerLite later.
    const [notionResult, mlResult] = await Promise.all([
      writeToNotion(notionToken, notionDataSource, body, sourceDomain, userAgent),
      mlToken && mlGroup
        ? writeToMailerLite(mlToken, mlGroup, body, sourceDomain)
        : Promise.resolve({ ok: false, error: "MailerLite not configured" }),
    ])

    if (!notionResult.ok) {
      return NextResponse.json(
        { ok: false, error: "Failed to save lead" },
        { status: 502 },
      )
    }

    return NextResponse.json({
      ok: true,
      notion: notionResult.ok,
      mailerlite: mlResult.ok,
    })
  } catch (err) {
    console.error("[api/lead] Unexpected error", err)
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 },
    )
  }
}
