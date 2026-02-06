import { pool } from "@/lib/db";
import { paginationSchema } from "@/lib/schemas";
import { z } from "zod";

const overdueFilterSchema = z.object({
  min_days_atraso: z.coerce.number().min(0).default(0),
});

export default async function Report2({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
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

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>Préstamos vencidos</h1>
      <p style={{ color: "#031631", marginBottom: "20px" }}>Total de préstamos vencidos: {rows.length}</p>

      {rows.length === 0 ? (
        <p style={{ color: "#031631" }}>No hay préstamos vencidos.</p>
      ) : (
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#041c3f" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Préstamo ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Miembro</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Libro</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Días atraso</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Multa sugerida</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any, idx: number) => (
              <tr key={r.loan_id} style={{ 
                backgroundColor: idx % 2 === 0 ? "#13406539" : "white",
                borderBottom: "1px solid #205682"
              }}>
                <td style={{ padding: "12px", color: "#0d47a1" }}>{r.loan_id}</td>
                <td style={{ padding: "12px", color: "#0d47a1" }}>{r.member_name}</td>
                <td style={{ padding: "12px", color: "#0d47a1" }}>{r.book_title}</td>
                <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.dias_atraso}</td>
                <td style={{ padding: "12px", textAlign: "right", color: "#0d47a1" }}>${r.multa_sugerida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}