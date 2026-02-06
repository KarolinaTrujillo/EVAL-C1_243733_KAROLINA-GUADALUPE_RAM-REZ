import { pool } from "@/lib/db";
import { z } from "zod";

const filterSchema = z.object({
  min_loans: z.coerce.number().min(0).default(0),
});

export default async function Report4({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const { min_loans } = filterSchema.parse(params);

  const { rows } = await pool.query(
    `SELECT * FROM vw_member_activity 
     WHERE total_prestamos >= $1 
     ORDER BY total_prestamos DESC`,
    [min_loans]
  );

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>Actividad de socios</h1>
      <p style={{ color: "#031631", marginBottom: "20px" }}>Total de miembros activos: {rows.length}</p>

      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse", 
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#041c3f"}}>
            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Nombre</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Total préstamos</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Préstamos atrasados</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Tasa atraso</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any, idx: number) => (
            <tr key={r.member_id} style={{ 
              backgroundColor: idx % 2 === 0 ? "#13406539" : "white",
              borderBottom: "1px solid #205682"
            }}>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.member_id}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.name}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.total_prestamos}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.prestamos_atrasados}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.tasa_atraso}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}