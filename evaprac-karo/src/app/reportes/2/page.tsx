import { pool } from "@/lib/db";
import { overdueFilterSchema, paginationSchema } from "@/lib/schemas";

export default async function Report2({ searchParams }: any) {
  const { min_days_atraso } = overdueFilterSchema.parse(searchParams);
  const { page, limit } = paginationSchema.parse(searchParams);

  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `
    SELECT *
    FROM vw_overdue_loans
    WHERE dias_atraso >= $1
    ORDER BY dias_atraso DESC
    LIMIT $2 OFFSET $3
    `,
    [min_days_atraso, limit, offset]
  );

  return (
    <main>
      <h1>Préstamos vencidos</h1>
      <p>Préstamos con atraso y multa sugerida.</p>

      <h3>KPI: Préstamos mostrados: {rows.length}</h3>

      <table>
        <thead>
          <tr>
            <th>Socio</th>
            <th>Libro</th>
            <th>Días atraso</th>
            <th>Multa</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.loan_id}>
              <td>{r.member_name}</td>
              <td>{r.book_title}</td>
              <td>{r.dias_atraso}</td>
              <td>${r.multa_sugerida}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
