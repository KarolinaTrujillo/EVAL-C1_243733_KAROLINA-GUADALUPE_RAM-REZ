import { pool } from "@/lib/db";

export default async function Report1() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_most_borrowed_books ORDER BY ranking"
  );

  return (
    <main>
      <h1>Libros más prestados</h1>
      <p>Ranking de libros según la cantidad de préstamos.</p>

      <h3>KPI: Total de libros en ranking: {rows.length}</h3>

      <table>
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Total préstamos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.book_id}>
              <td>{r.ranking}</td>
              <td>{r.title}</td>
              <td>{r.author}</td>
              <td>{r.total_prestamos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
