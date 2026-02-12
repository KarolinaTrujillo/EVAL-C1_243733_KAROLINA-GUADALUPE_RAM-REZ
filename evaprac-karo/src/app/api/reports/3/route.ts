import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_fines_summary ORDER BY mes DESC"
  );

  return NextResponse.json(rows);
}
