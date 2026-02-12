import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { paginationSchema } from "@/lib/schemas";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  
  const { page, limit } = paginationSchema.parse(params);
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT * FROM vw_inventory_health 
     ORDER BY category 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return NextResponse.json({ rows, page, limit });
}
