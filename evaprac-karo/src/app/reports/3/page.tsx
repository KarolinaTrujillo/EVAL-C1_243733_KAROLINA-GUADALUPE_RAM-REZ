import { pool } from "@/lib/db";

export default async function Report3() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_fines_summary ORDER BY mes DESC"
  );

  const totalRecaudado = rows.reduce(
    (acc, r) => acc + Number(r.multas_pagadas),
    0
  );

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>Resumen mensual de multas</h1>
      <div style={{ 
        backgroundColor: "#07244da5", 
        color: "white",
        padding: "15px", 
        borderRadius: "5px",
        marginBottom: "20px"
      }}>
        <strong>Total recaudado: ${totalRecaudado}</strong>
      </div>

      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse", 
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#041c3f", color: "white" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>Mes</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Total multas</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Pagadas</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Pendientes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any, idx: number) => (
            <tr key={r.mes} style={{ 
              backgroundColor: idx % 2 === 0 ? "#13406539": "white",
              borderBottom: "1px solid #205682"
            }}>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{new Date(r.mes).toLocaleDateString()}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.total_multas}</td>
              <td style={{ padding: "12px", textAlign: "right", color: "#0d47a1" }}>${r.multas_pagadas}</td>
              <td style={{ padding: "12px", textAlign: "right", color: "#0d47a1" }}>${r.multas_pendientes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}