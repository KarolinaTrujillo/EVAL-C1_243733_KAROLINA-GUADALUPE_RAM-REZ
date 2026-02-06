export const dynamic = 'force-dynamic';
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
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Actividad de socios
      </h1>

      <p style={{ color: "#031631", marginBottom: "20px", fontSize: "14px" }}>
        Analiza el comportamiento de los miembros según sus préstamos y tasa de atraso.
      </p>

      <form method="GET" style={{ backgroundColor: "white", padding: "10px", marginBottom: "20px", borderRadius: "5px" }}>
        <input 
          type="number" 
          name="min_loans" 
          defaultValue={min_loans === 0 ? "" : min_loans}
          placeholder="Préstamos mínimos" 
          style={{ padding: "5px", marginRight: "5px", color: "#031631", borderColor: "#031631", borderWidth: "1px", borderStyle: "solid" }} 
        />
        <button type="submit" style={{ padding: "5px 10px", backgroundColor: "#041c3f", color: "white", border: "none", cursor: "pointer" }}>Filtrar</button>
      </form>

      <div style={{ 
        backgroundColor: "#041c3f", 
        color: "white",
        padding: "15px", 
        borderRadius: "5px",
        marginBottom: "20px"
      }}>
        <strong>Total de miembros activos: {rows.length}</strong>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.54)" }}>
        <thead>
          <tr style={{ backgroundColor: "#041c3f"}}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Nombre</th>
            <th style={{ padding: "12px" }}>Préstamos</th>
            <th style={{ padding: "12px" }}>Atrasados</th>
            <th style={{ padding: "12px" }}>Tasa %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any, idx: number) => (
            <tr key={r.member_id} style={{ backgroundColor: idx % 2 === 0 ? "#13406539" : "white", borderBottom: "1px solid #205682" }}>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.member_id}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.name}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.total_prestamos}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.prestamos_atrasados}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.tasa_atraso}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}