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
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>Salud del inventario</h1>
      <p style={{ color: "#031631", marginBottom: "20px" }}>Total de categorías: {rows.length}</p>

      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse", 
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#041c3f"}}>
            <th style={{ padding: "12px", textAlign: "left" }}>Categoría</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Total copias</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Disponibles</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Prestados</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Perdidos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any, idx: number) => (
            <tr key={idx} style={{ 
              backgroundColor: idx % 2 === 0 ? "#13406539" : "white",
              borderBottom: "1px solid #205682"
            }}>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.category}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.total_copias}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.disponibles}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.prestados}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.perdidos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}