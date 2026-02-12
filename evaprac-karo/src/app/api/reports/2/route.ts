import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { paginationSchema, overdueFilterSchema } from "@/lib/schemas";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  
  const { min_days_atraso } = overdueFilterSchema.parse(params);
  const { page, limit } = paginationSchema.parse(params);
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT * FROM vw_overdue_loans 
     WHERE dias_atraso >= $1 
     ORDER BY dias_atraso DESC 
     LIMIT $2 OFFSET $3`,
    [min_days_atraso, limit, offset]
  );

  return NextResponse.json({ rows, page, limit, min_days_atraso });
}
