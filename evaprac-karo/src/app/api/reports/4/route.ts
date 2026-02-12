import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const filterSchema = z.object({
  min_loans: z.coerce.number().min(0).default(0),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  
  const { min_loans } = filterSchema.parse(params);

  const { rows } = await pool.query(
    `SELECT * FROM vw_member_activity 
     WHERE total_prestamos >= $1 
     ORDER BY total_prestamos DESC`,
    [min_loans]
  );

  return NextResponse.json({ rows, min_loans });
}
