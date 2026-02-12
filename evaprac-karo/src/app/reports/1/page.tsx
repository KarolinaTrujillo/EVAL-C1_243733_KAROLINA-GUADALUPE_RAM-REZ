'use client';

import { useEffect, useState } from "react";

export default function Report1() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/1')
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>Cargando...</div>;

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Libros más prestados
      </h1>
      
      <p style={{ color: "#031631", marginBottom: "20px", fontSize: "14px" }}>
        Este reporte muestra el ranking de libros según la cantidad total de préstamos históricos.
      </p>

      <div style={{ 
        backgroundColor: "#041c3f", 
        color: "white",
        padding: "15px", 
        borderRadius: "5px",
        marginBottom: "20px"
      }}>
        <strong>Total de libros prestados: {rows.length}</strong>
      </div>
      
      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse", 
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.54)"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#041c3f"}}>
            <th style={{ padding: "12px", textAlign: "left" }}>Ranking</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Título</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Autor</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Total préstamos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any, idx: number) => (
            <tr key={r.book_id} style={{ 
              backgroundColor: idx % 2 === 0 ? "#13406539" : "white",
              borderBottom: "1px solid #205682"
            }}>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.ranking}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.title}</td>
              <td style={{ padding: "12px", color: "#0d47a1" }}>{r.author}</td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.total_prestamos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}