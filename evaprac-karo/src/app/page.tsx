import Link from "next/link";

export default function Dashboard() {
  const reportes = [
    { id: 1, titulo: "Libros más prestados" },
    { id: 2, titulo: "Préstamos vencidos" },
    { id: 3, titulo: "Resumen mensual de multas" },
    { id: 4, titulo: "Actividad de socios" },
    { id: 5, titulo: "Salud del inventario" },
  ];

  return (
    <div style={{ 
      padding: "30px", 
      backgroundColor: "#b0c2d6", 
      minHeight: "100vh" 
    }}>
      <h1 style={{ color: "#031631", marginBottom: "10px", fontWeight: "bold", fontSize: "24px" }}>
        Dashboard de Reportes
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {reportes.map((reporte) => (
          <Link 
            key={reporte.id}
            href={`/reports/${reporte.id}`}
            style={{
              textDecoration: "none",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.54)",
              color: "#0d47a1",
              fontSize: "18px"
            }}
          >
            {reporte.id}. {reporte.titulo}
          </Link>
        ))}
      </div>
    </div>
  );
}