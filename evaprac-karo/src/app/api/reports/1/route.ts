import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_most_borrowed_books ORDER BY ranking"
  );
  
  return NextResponse.json(rows);
}
