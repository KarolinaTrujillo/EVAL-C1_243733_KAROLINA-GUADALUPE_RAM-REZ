import Link from "next/link";

export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard de Reportes</h1>
      <ul>
        <li><Link href="/reports/1">Libros más prestados</Link></li>
        <li><Link href="/reports/2">Préstamos vencidos</Link></li>
        <li><Link href="/reports/3">Resumen de multas</Link></li>
        <li><Link href="/reports/4">Actividad de socios</Link></li>
        <li><Link href="/reports/5">Salud del inventario</Link></li>
      </ul>
    </main>
  );
}
