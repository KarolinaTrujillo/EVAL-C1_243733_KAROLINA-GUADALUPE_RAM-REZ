import { pool } from "@/lib/db";
import { z } from "zod";

const filterSchema = z.object({
  min_loans: z.coerce.number().min(1).default(1),
});

export default async function Report4({ searchParams }: any) {
  const { min_loans } = filterSchema.parse(searchParams);

  const { rows } = await pool.query(
    `
    SELECT *
    FROM vw_member_activity
    WHERE total_prestamos >= $1
    ORDER BY tasa_atraso DESC
    `,
    [min_loans]
  );

  return (
    <main>
      <h1>Actividad de socios</h1>
      <p>
        Muestra los socios activos y su porcentaje de atraso en préstamos.
      </p>

      <h3>KPI: Socios analizados {rows.length}</h3>

      <table>
        <thead>
          <tr>
            <th>Socio</th>
            <th>Total préstamos</th>
            <th>Préstamos atrasados</th>
            <th>Tasa de atraso (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.member_id}>
              <td>{r.name}</td>
              <td>{r.total_prestamos}</td>
              <td>{r.prestamos_atrasados}</td>
              <td>{r.tasa_atraso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
