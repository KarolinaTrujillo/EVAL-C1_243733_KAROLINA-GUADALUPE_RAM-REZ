export const dynamic = 'force-dynamic';
import { pool } from "@/lib/db";
import { paginationSchema, overdueFilterSchema } from "@/lib/schemas";

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
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Préstamos vencidos
      </h1>

      <p style={{ color: "#031631", marginBottom: "20px", fontSize: "14px" }}>
        Identifica préstamos con atraso y la multa sugerida para cada uno.
      </p>

      <form method="GET" style={{ backgroundColor: "white", padding: "10px", marginBottom: "20px", borderRadius: "5px"}}>
         <input 
          type="number" 
          name="min_days_atraso" 
          defaultValue={min_days_atraso === 0 ? "" : min_days_atraso}
          placeholder="Días" 
          min="0"
          style={{ padding: "5px", marginRight: "5px", color: "#031631", borderColor: "#031631", borderWidth: "1px", borderStyle: "solid" }} 
        />
        <input 
          type="number" 
          name="limit" 
          defaultValue={limit}
          placeholder="Por página" 
          min="1"
          max="20"
          style={{ padding: "5px", marginRight: "5px", width: "110px", color: "#031631", borderColor: "#031631", borderWidth: "1px", borderStyle: "solid" }} 
        />
        <button type="submit" style={{ padding: "5px 10px", backgroundColor: "#041c3f", color: "white", border: "none", cursor: "pointer" }}>
          Filtrar
        </button>
      </form>

      <div style={{ 
        backgroundColor: "#041c3f", 
        color: "white",
        padding: "15px", 
        borderRadius: "5px",
        marginBottom: "20px"
      }}>
        <strong>Préstamos en esta página: {rows.length}</strong>
      </div>

      {rows.length === 0 ? (
        <p style={{ color: "#031631" }}>No hay préstamos con esos filtros.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.54)" }}>
            <thead>
              <tr style={{ backgroundColor: "#041c3f" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Miembro</th>
                <th style={{ padding: "12px" }}>Libro</th>
                <th style={{ padding: "12px" }}>Días</th>
                <th style={{ padding: "12px" }}>Multa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any, idx: number) => (
                <tr key={r.loan_id} style={{ backgroundColor: idx % 2 === 0 ? "#13406539" : "white", borderBottom: "1px solid #205682" }}>
                  <td style={{ padding: "12px", color: "#0d47a1" }}>{r.loan_id}</td>
                  <td style={{ padding: "12px", color: "#0d47a1" }}>{r.member_name}</td>
                  <td style={{ padding: "12px", color: "#0d47a1" }}>{r.book_title}</td>
                  <td style={{ padding: "12px", color: "#0d47a1" }}>{r.dias_atraso}</td>
                  <td style={{ padding: "12px", color: "#0d47a1" }}>${r.multa_sugerida}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            {page > 1 && <a href={`/reports/2?min_days_atraso=${min_days_atraso}&page=${page - 1}&limit=${limit}`} style={{ padding: "5px 10px", backgroundColor: "#041c3f", color: "white", textDecoration: "none", marginRight: "5px" }}>Anterior</a>}
            <span style={{ color: "#031631" }}>Página {page}</span>
            {rows.length === limit && <a href={`/reports/2?min_days_atraso=${min_days_atraso}&page=${page + 1}&limit=${limit}`} style={{ padding: "5px 10px", backgroundColor: "#041c3f", color: "white", textDecoration: "none", marginLeft: "5px" }}>Siguiente</a>}
          </div>
        </>
      )}
    </div>
  );
}