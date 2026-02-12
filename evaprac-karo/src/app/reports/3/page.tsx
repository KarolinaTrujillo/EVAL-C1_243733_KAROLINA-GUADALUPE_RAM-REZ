'use client';

import { useEffect, useState } from "react";

export default function Report3() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/3')
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      });
  }, []);

  const totalRecaudado = rows.reduce((sum: number, r: any) => sum + parseFloat(r.multas_pagadas || 0), 0);
  const totalPendiente = rows.reduce((sum: number, r: any) => sum + parseFloat(r.multas_pendientes || 0), 0);

  if (loading) return <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>Cargando...</div>;

  return (
    <div style={{ padding: "30px", backgroundColor: "#b0c2d6", minHeight: "100vh" }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Resumen mensual de multas
      </h1>

      <p style={{ color: "#031631", marginBottom: "20px", fontSize: "14px" }}>
        Seguimiento mensual de multas generadas, pagadas y pendientes por cobrar.
      </p>

      <div style={{ 
        backgroundColor: "#041c3f", 
        color: "white",
        padding: "15px", 
        borderRadius: "5px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-around"
      }}>
        <div>
          <strong>Total recaudado: ${totalRecaudado.toFixed(2)}</strong>
        </div>
        <div>
          <strong>Total pendiente: ${totalPendiente.toFixed(2)}</strong>
        </div>
      </div>

      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse", 
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.54)"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#041c3f"}}>
            <th style={{ padding: "12px", textAlign: "left" }}>Mes</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Total multas</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Pagado</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Pendiente</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any, idx: number) => (
            <tr key={idx} style={{ 
              backgroundColor: idx % 2 === 0 ? "#13406539" : "white",
              borderBottom: "1px solid #205682"
            }}>
              <td style={{ padding: "12px", color: "#0d47a1" }}>
                {new Date(r.mes).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' })}
              </td>
              <td style={{ padding: "12px", textAlign: "center", color: "#0d47a1" }}>{r.total_multas || 0}</td>
              <td style={{ padding: "12px", textAlign: "right", color: "#0d47a1" }}>
                ${parseFloat(r.multas_pagadas || 0).toFixed(2)}
              </td>
              <td style={{ padding: "12px", textAlign: "right", color: "#0d47a1" }}>
                ${parseFloat(r.multas_pendientes || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}