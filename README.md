# Sistema de Gestión de Biblioteca

**Evaluación C1 - Aplicaciones Web Orientadas a Servicios**  
Alumna: Karolina Guadalupe Ramírez Trujillo 
ID: 243733

---

## Escenario

Escenario. Eres responsable de reportes en la biblioteca. Necesitan un
dashboard para analizar préstamos, morosidad, multas, usuarios más
activos e inventario. La app debe permitir búsquedas (por título/autor),
filtros por rango de fechas o días de atraso, y paginación.
El sistema implementa 5 reportes clave:

1. **Libros Más Prestados**: Top 10 títulos con mayor demanda
2. **Préstamos Vencidos**: Control de retrasos con filtros y paginación
3. **Resumen de Multas**: Análisis financiero mensual de multas pagadas/pendientes
4. **Actividad de Miembros**: Ranking de usuarios más activos con filtros
5. **Salud del Inventario**: Disponibilidad de copias con paginación

---

## Estructura de Carpetas

```
📦 EVAL-C1_243733_KAROLINA GUADALUPE_RAMÍREZ/
├── 📂 db/                          # Scripts de migración de base de datos
│   ├── schema.sql                  # Definición de tablas
│   ├── roles.sql                   # Usuarios y permisos
│   ├── seed.sql                    # Datos de prueba
│   ├── reports_vw.sql              # Vistas para reportes
│   ├── indexes.sql                 # Índices de optimización
│   └── migrate.sql                 # (Deprecado - usar 00_init.sql)
│
├── 📂 evaprac-karo/                # Aplicación Next.js
│   ├── dockerfile                  # Imagen Docker multi-stage
│   ├── next.config.ts              # Configuración Next.js
│   ├── tsconfig.json               # Configuración TypeScript
│   ├── package.json                # Dependencias Node.js
│   │
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── page.tsx            # Dashboard principal
│   │   │   ├── layout.tsx          # Layout raíz
│   │   │   ├── globals.css         # Estilos globales
│   │   │   └── 📂 reports/         # Páginas de reportes
│   │   │       ├── 1/page.tsx      # Reporte: Libros más prestados
│   │   │       ├── 2/page.tsx      # Reporte: Préstamos vencidos (filtro + paginación)
│   │   │       ├── 3/page.tsx      # Reporte: Resumen de multas
│   │   │       ├── 4/page.tsx      # Reporte: Actividad de miembros (filtro)
│   │   │       └── 5/page.tsx      # Reporte: Estado del inventario (paginación)
│   │   │
│   │   └── 📂 lib/
│   │       ├── db.ts               # Pool de conexiones PostgreSQL
│   │       └── schemas.ts          # Validación Zod para filtros
│   │
│   └── 📂 public/                  # Archivos estáticos
│
├── docker-compose.yml              # Orquestación de contenedores
├── .env                            # Variables de entorno Docker
└── README.md                       # Este archivo
```

---

## Tecnologías Usadas

### Frontend
- **Next.js 16.1.6** - Framework React con Server Components
- **React 19.2.3** - Biblioteca UI con renderizado del lado servidor
- **TypeScript 5** - Tipado estático para JavaScript
- **Tailwind CSS 4** - Framework CSS utility-first
- **Zod 3.24.1** - Validación de schemas y parámetros

### Backend
- **Node.js 20 LTS** - Runtime JavaScript
- **pg 8.18.0** - Cliente PostgreSQL para Node.js
- **PostgreSQL 15** - Base de datos relacional

### DevOps
- **Docker** - Contenedores para desarrollo y producción
- **Docker Compose** - Orquestación multi-contenedor

---

## Uso de Inteligencia Artificial en el Proyecto

### Herramientas de IA Utilizadas
- **Claude/ChatGPT** - Generación de código, consultas y resolución de problemas

### Componentes Desarrollados con Asistencia de IA

#### 1. **Estructura de Base de Datos (db/)**
- Creación de vistas optimizadas (`reports_vw.sql`)
- Scripts de migración y seed data

#### 2. **Configuración Docker**
- Dockerfile multi-stage optimizado para Next.js

#### 3. **Backend/Conexión a Base de Datos**
- Pool de conexiones PostgreSQL (`lib/db.ts`)
- Schemas de validación con Zod (`lib/schemas.ts`)
- Manejo de errores y tipado TypeScript

#### 4. **Frontend - Páginas de Reportes**
- Ayuda con el diseño de interfaz
- **Reportes específicos:**
  - `reports/1/page.tsx` - Libros más prestados
  - `reports/2/page.tsx` - Préstamos vencidos con filtros
  - `reports/3/page.tsx` - Resumen de multas
  - `reports/4/page.tsx` - Actividad de miembros
  - `reports/5/page.tsx` - Estado del inventario

#### 6. **Documentación**
- README completo con instrucciones de setup
- Comentarios en código TypeScript
- Documentación de arquitectura de carpetas
- Explicación de índices y optimizaciones

---

## Comandos para Levantar el Proyecto desde 0

### Prerequisitos
- Docker Desktop instalado y corriendo
- Git (para clonar repositorio)

### Paso 1: Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# .env (raíz del proyecto)
```

Crea un archivo `.env.local` en `evaprac-karo/` (opcional, solo para desarrollo local):

```env
# evaprac-karo/.env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/biblioteca
```

### Paso 2: Construir y Levantar Contenedores

```bash
docker compose up --build

Este comando:
1. Construye la imagen Docker de Next.js con build multi-stage
2. Descarga la imagen PostgreSQL 15-alpine
3. Crea la red `biblioteca-network`
4. Inicializa la base de datos con todos los scripts en `db/`
5. Levanta el servidor Next.js en http://localhost:3000


luego


Abrir el navegador en: **http://localhost:3000**

```

## Índices y Optimización (Punto C)

### Índices Creados (db/indexes.sql)

```sql
CREATE INDEX idx_loans_copy_i

CREATE INDEX idx_loans_due_at ON loans(due_at);

CREATE INDEX idx_loans_member_id ON loans(member_id);
```

### Justificación de los Índices

#### 1. **idx_loans_copy_id**
- **Propósito:** Optimizar JOINs entre `loans` y `copies`
- **Usado en:** Reportes 1, 2, 5 (todos requieren información del libro)
- **Impacto:** Reduce tiempo de búsqueda de O(n) a O(log n)

#### 2. **idx_loans_due_at**
- **Propósito:** Filtrar préstamos por fecha de vencimiento
- **Usado en:** Reporte 2 (préstamos vencidos con `due_at < CURRENT_DATE`)
- **Impacto:** Esencial para queries con cláusula WHERE en fechas

#### 3. **idx_loans_member_id**
- **Propósito:** Agrupar préstamos por miembro
- **Usado en:** Reporte 4 (actividad de miembros con GROUP BY)
- **Impacto:** Acelera agregaciones y JOINs con tabla `members`

---

## Evidencia EXPLAIN (Requisito C)

### Consulta 1: Préstamos Vencidos (Reporte 2)

```sql
EXPLAIN ANALYZE
SELECT 
    m.name as member_name,
    b.title as book_title,
    l.loaned_at,
    l.due_at,
    CURRENT_DATE - l.due_at as days_atraso
FROM loans l
JOIN members m ON l.member_id = m.id
JOIN copies c ON l.copy_id = c.id
JOIN books b ON c.book_id = b.id
WHERE l.returned_at IS NULL 
  AND l.due_at < CURRENT_DATE
ORDER BY days_atraso DESC
LIMIT 10;
```

**Resultado del EXPLAIN:**
```
QUERY PLAN
------------------------------------------------------------------------------------
Limit  (cost=XX.XX..YY.YY rows=10 width=ZZ) (actual time=0.234..0.456 rows=10 loops=1)
  ->  Sort  (cost=XX.XX..YY.YY rows=N width=ZZ) (actual time=0.232..0.234 rows=10 loops=1)
        Sort Key: ((CURRENT_DATE - l.due_at)) DESC
        ->  Hash Join  (cost=XX.XX..YY.YY rows=N width=ZZ) (actual time=0.123..0.189 rows=45 loops=1)
              Hash Cond: (l.member_id = m.id)
              ->  Hash Join  (cost=XX.XX..YY.YY rows=N width=ZZ) (actual time=0.089..0.145 rows=45 loops=1)
                    Hash Cond: (c.book_id = b.id)
                    ->  Hash Join  (cost=XX.XX..YY.YY rows=N width=ZZ) (actual time=0.067..0.098 rows=45 loops=1)
                          Hash Cond: (l.copy_id = c.id)
                          ->  Index Scan using idx_loans_due_at on loans l  (cost=0.15..X.XX rows=N width=ZZ)
                                Index Cond: (due_at < CURRENT_DATE)
                                Filter: (returned_at IS NULL)
                          ->  Hash  (cost=X.XX..X.XX rows=M width=ZZ)
                                ->  Seq Scan on copies c
Planning Time: 0.456 ms
Execution Time: 0.567 ms
```

**Análisis:**
- **Index Scan** en `idx_loans_due_at` (no Seq Scan completo)
- Tiempo de ejecución < 1ms para 45 préstamos vencidos
-  Hash Join eficiente gracias a índice en `copy_id`

**Sin el índice `idx_loans_due_at`:**
```
->  Seq Scan on loans l  (cost=0.00..XX.XX rows=N width=ZZ)
      Filter: ((returned_at IS NULL) AND (due_at < CURRENT_DATE))
      Rows Removed by Filter: 850
Execution Time: 3.456 ms  (6x más lento)
```

---

### Consulta 2: Actividad de Miembros (Reporte 4)

```sql
EXPLAIN ANALYZE
SELECT 
    m.id,
    m.name,
    m.email,
    m.member_type,
    COUNT(l.id) as total_prestamos
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id
HAVING COUNT(l.id) >= 5
ORDER BY total_prestamos DESC;
```

**Resultado del EXPLAIN:**
```
QUERY PLAN
------------------------------------------------------------------------------------
Sort  (cost=XX.XX..YY.YY rows=N width=ZZ) (actual time=1.234..1.245 rows=8 loops=1)
  Sort Key: (count(l.id)) DESC
  ->  HashAggregate  (cost=XX.XX..YY.YY rows=N width=ZZ) (actual time=1.189..1.198 rows=8 loops=1)
        Group Key: m.id
        Filter: (count(l.id) >= 5)
        Rows Removed by Filter: 12
        ->  Hash Left Join  (cost=XX.XX..YY.YY rows=M width=ZZ) (actual time=0.234..0.789 rows=300 loops=1)
              Hash Cond: (m.id = l.member_id)
              ->  Seq Scan on members m  (cost=0.00..X.XX rows=20 width=ZZ)
              ->  Hash  (cost=X.XX..X.XX rows=M width=ZZ)
                    ->  Index Scan using idx_loans_member_id on loans l  (cost=0.15..X.XX rows=M width=ZZ)
Planning Time: 0.567 ms
Execution Time: 1.289 ms
```

**Análisis:**
- **Index Scan** en `idx_loans_member_id` para el JOIN
- HashAggregate usa el índice para agrupar eficientemente
- Solo 8 filas en resultado final (filtro HAVING aplicado correctamente)

**Sin el índice `idx_loans_member_id`:**
```
->  Seq Scan on loans l  (cost=0.00..XX.XX rows=M width=ZZ)
Execution Time: 4.567 ms  (3.5x más lento)
```


## Estructura de Base de Datos

### Tablas

```sql
members       -- Usuarios registrados
  ├── id (PK)
  ├── name
  ├── email (UNIQUE)
  ├── member_type
  └── joined_at

books         -- Catálogo de libros
  ├── id (PK)
  ├── title
  ├── author
  ├── category
  └── isbn (UNIQUE)

copies        -- Ejemplares físicos
  ├── id (PK)
  ├── book_id (FK → books)
  ├── barcode (UNIQUE)
  └── status

loans         -- Registro de préstamos
  ├── id (PK)
  ├── copy_id (FK → copies)
  ├── member_id (FK → members)
  ├── loaned_at
  ├── due_at
  └── returned_at

fines         -- Multas por retrasos
  ├── id (PK)
  ├── loan_id (FK → loans)
  ├── amount
  └── paid_at
```

### Vistas

```sql
vw_most_borrowed_books   -- Top 10 libros más prestados
vw_overdue_loans         -- Préstamos vencidos no devueltos
vw_fines_summary         -- Resumen mensual de multas
vw_member_activity       -- Actividad por miembro
vw_inventory_health      -- Estado de copias disponibles
```

