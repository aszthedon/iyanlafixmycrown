import { NextResponse } from "next/server";
import { readConfig, writeConfig } from "@/lib/config";

function isAuthed(req: Request) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const header = req.headers.get("x-admin-password");
  return header === pass;
}

export async function GET() {
  try {
    const cfg = await readConfig();
    return NextResponse.json({ config: cfg });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to read config.json", detail: error?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    await writeConfig(body);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to save config.json", detail: error?.message ?? "Unknown error" }, { status: 500 });
  }
}
