import { pool } from "@/lib/db";
import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(10).default(5),
});

export default async function Report5({ searchParams }: any) {
  const { page, limit } = paginationSchema.parse(searchParams);
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `
    SELECT *
    FROM vw_inventory_health
    ORDER BY category
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return (
    <main>
      <h1>Salud del inventario</h1>
      <p>
        Este reporte muestra el estado de las copias por categoría.
      </p>

      <h3>KPI: Categorías mostradas {rows.length}</h3>

      <table>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Total copias</th>
            <th>Disponibles</th>
            <th>Prestadas</th>
            <th>Perdidas</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.category}>
              <td>{r.category}</td>
              <td>{r.total_copias}</td>
              <td>{r.disponibles}</td>
              <td>{r.prestados}</td>
              <td>{r.perdidos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
