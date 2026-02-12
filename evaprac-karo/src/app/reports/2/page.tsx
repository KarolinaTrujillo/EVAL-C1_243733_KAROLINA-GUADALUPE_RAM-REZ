'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function Report2Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [min_days_atraso, setMinDaysAtraso] = useState(0);

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const minDaysParam = searchParams.get('min_days_atraso');
    
    if (pageParam) setPage(Number(pageParam));
    if (limitParam) setLimit(Number(limitParam));
    if (minDaysParam) setMinDaysAtraso(Number(minDaysParam));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports/2?page=${page}&limit=${limit}&min_days_atraso=${min_days_atraso}`)
      .then(res => res.json())
      .then(data => {
        setRows(data.rows);
        setLoading(false);
      });
  }, [page, limit, min_days_atraso]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMinDays = Number(formData.get('min_days_atraso')) || 0;
    const newLimit = Number(formData.get('limit')) || 5;
    router.push(`/reports/2?min_days_atraso=${newMinDays}&page=1&limit=${newLimit}`);
  };

  if (loading) return <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>Cargando...</div>;

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Préstamos vencidos
      </h1>

      <p style={{ color: "#031631", marginBottom: "20px", fontSize: "14px" }}>
        Identifica préstamos con atraso y la multa sugerida para cada uno.
      </p>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "10px", marginBottom: "20px", borderRadius: "5px"}}>
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

export default function Report2() {
  return (
    <Suspense fallback={<div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>Cargando...</div>}>
      <Report2Content />
    </Suspense>
  );
}