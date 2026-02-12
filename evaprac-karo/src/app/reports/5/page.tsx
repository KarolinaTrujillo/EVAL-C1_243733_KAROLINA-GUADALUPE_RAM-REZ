'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function Report5Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    if (pageParam) setPage(Number(pageParam));
    if (limitParam) setLimit(Number(limitParam));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports/5?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setRows(data.rows);
        setLoading(false);
      });
  }, [page, limit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLimit = Number(formData.get('limit')) || 5;
    router.push(`/reports/5?page=1&limit=${newLimit}`);
  };

  if (loading) return <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>Cargando...</div>;

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Salud del inventario
      </h1>

      <p style={{ color: "#031631", marginBottom: "20px", fontSize: "14px" }}>
        Monitorea el estado de las copias por categoría: disponibles, prestadas y perdidas.
      </p>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "10px", marginBottom: "20px", borderRadius: "5px" }}>
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

export default function Report5() {
  return (
    <Suspense fallback={<div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>Cargando...</div>}>
      <Report5Content />
    </Suspense>
  );
}