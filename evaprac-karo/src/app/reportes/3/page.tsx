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
    <main>
      <h1>Resumen mensual de multas</h1>
      <p>
        Este reporte muestra las multas generadas por mes y su estado de pago.
      </p>

      <h3>KPI: Total recaudado ${totalRecaudado}</h3>

      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Total multas</th>
            <th>Pagadas</th>
            <th>Pendientes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.mes}>
              <td>{new Date(r.mes).toLocaleDateString()}</td>
              <td>{r.total_multas}</td>
              <td>${r.multas_pagadas}</td>
              <td>${r.multas_pendientes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
