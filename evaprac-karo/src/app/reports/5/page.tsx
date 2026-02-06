export const dynamic = 'force-dynamic';
import { pool } from "@/lib/db";
import { paginationSchema } from "@/lib/schemas";

export default async function Report5({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const { page, limit } = paginationSchema.parse(params);
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT * FROM vw_inventory_health 
     ORDER BY category 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Salud del inventario
      </h1>

      <p style={{ color: "#031631", marginBottom: "20px", fontSize: "14px" }}>
        Monitorea el estado de las copias por categoría: disponibles, prestadas y perdidas.
      </p>

      <form method="GET" style={{ backgroundColor: "white", padding: "10px", marginBottom: "20px", borderRadius: "5px" }}>
        <input 
          type="number" 
          name="limit" 
          defaultValue={limit === 5 ? "" : limit}
          placeholder="Por página" 
          style={{ padding: "5px", marginRight: "5px", width: "100px", color: "#031631", borderColor: "#031631", borderWidth: "1px", borderStyle: "solid" }} 
        />
        <button type="submit" style={{ padding: "5px 10px", backgroundColor: "#041c3f", color: "white", border: "none", cursor: "pointer" }}>Aplicar</button>
      </form>

      <div style={{ 
        backgroundColor: "#041c3f", 
        color: "white",
        padding: "15px", 
        borderRadius: "5px",
        marginBottom: "20px"
      }}>
        <strong>Categorías en esta página: {rows.length}</strong>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.54)" }}>
        <thead>
          <tr style={{ backgroundColor: "#041c3f"}}>
            <th style={{ padding: "12px" }}>Categoría</th>
            <th style={{ padding: "12px" }}>Copias</th>
            <th style={{ padding: "12px" }}>Disponibles</th>
            <th style={{ padding: "12px" }}>Prestados</th>
            <th style={{ padding: "12px" }}>Perdidos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any, idx: number) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#13406539" : "white", borderBottom: "1px solid #205682" }}>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.category}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.total_copias}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.disponibles}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.prestados}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.perdidos}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        {page > 1 && <a href={`/reports/5?page=${page - 1}&limit=${limit}`} style={{ padding: "5px 10px", backgroundColor: "#041c3f", color: "white", textDecoration: "none", marginRight: "5px" }}>Anterior</a>}
        <span style={{ color: "#031631" }}>Página {page}</span>
        {rows.length === limit && <a href={`/reports/5?page=${page + 1}&limit=${limit}`} style={{ padding: "5px 10px", backgroundColor: "#041c3f", color: "white", textDecoration: "none", marginLeft: "5px" }}>Siguiente</a>}
      </div>
    </div>
  );
}