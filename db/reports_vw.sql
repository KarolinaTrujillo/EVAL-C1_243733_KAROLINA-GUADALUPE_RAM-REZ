-- VIEW: vw_most_borrowed_books
-- Devuelve el ranking de los libros más prestados.
-- Grain: un registro por libro.
-- Métricas: total_prestamos, ranking.
-- VERIFY:
-- SELECT * FROM vw_most_borrowed_books;
-- SELECT * FROM vw_most_borrowed_books WHERE title ILIKE '%Datos%';

CREATE VIEW vw_most_borrowed_books AS
SELECT
    b.id AS book_id,
    b.title,
    b.author,
    COUNT(l.id) AS total_prestamos,
    RANK() OVER (ORDER BY COUNT(l.id) DESC) AS ranking
FROM books b
JOIN copies c ON b.id = c.book_id
JOIN loans l ON c.id = l.copy_id
GROUP BY b.id, b.title, b.author;

-- VIEW: vw_overdue_loans
-- Devuelve los préstamos vencidos con días de atraso y monto sugerido de multa.
-- Grain: un registro por préstamo vencido.
-- Métricas: dias_atraso, multa_sugerida.
-- Permite filtro por dias_atraso y paginación desde la consulta.
-- VERIFY:
-- SELECT * FROM vw_overdue_loans;
-- SELECT * FROM vw_overdue_loans WHERE dias_atraso >= 5 ORDER BY dias_atraso DESC;

CREATE VIEW vw_overdue_loans AS
WITH overdue AS (
    SELECT
        l.id AS loan_id,
        m.name AS member_name,
        b.title AS book_title,
        CURRENT_DATE - l.due_at AS dias_atraso
    FROM loans l
    JOIN members m ON l.member_id = m.id
    JOIN copies c ON l.copy_id = c.id
    JOIN books b ON c.book_id = b.id
    WHERE l.returned_at IS NULL
      AND l.due_at < CURRENT_DATE
)
SELECT
    loan_id,
    member_name,
    book_title,
    dias_atraso,
    CASE
        WHEN dias_atraso > 0 THEN dias_atraso * 5
        ELSE 0
    END AS multa_sugerida
FROM overdue
GROUP BY loan_id, member_name, book_title, dias_atraso;


-- VIEW: vw_fines_summary
-- Resumen mensual de multas pagadas y pendientes.
-- Grain: un registro por mes.
-- Métricas: total_multas, multas_pagadas, multas_pendientes.
-- VERIFY:
-- SELECT * FROM vw_fines_summary;

CREATE VIEW vw_fines_summary AS
SELECT
    DATE_TRUNC('month', l.loaned_at) AS mes,
    COUNT(f.id) AS total_multas,
    SUM(CASE WHEN f.paid_at IS NOT NULL THEN f.amount ELSE 0 END) AS multas_pagadas,
    SUM(CASE WHEN f.paid_at IS NULL THEN f.amount ELSE 0 END) AS multas_pendientes
FROM fines f
JOIN loans l ON f.loan_id = l.id
GROUP BY DATE_TRUNC('month', l.loaned_at)
HAVING COUNT(f.id) > 0;

-- VIEW: vw_member_activity
-- Muestra la actividad de los socios y su tasa de atraso.
-- Grain: un registro por socio.
-- Métricas: total_prestamos, prestamos_atrasados, tasa_atraso.
-- VERIFY:
-- SELECT * FROM vw_member_activity;

CREATE VIEW vw_member_activity AS
SELECT
    m.id AS member_id,
    m.name,
    COUNT(l.id) AS total_prestamos,
    SUM(
        CASE
            WHEN l.returned_at IS NULL AND l.due_at < CURRENT_DATE THEN 1
            ELSE 0
        END
    ) AS prestamos_atrasados,
    COALESCE(
        ROUND(
            (SUM(
                CASE
                    WHEN l.returned_at IS NULL AND l.due_at < CURRENT_DATE THEN 1
                    ELSE 0
                END
            )::DECIMAL / COUNT(l.id)) * 100,
            2
        ),
        0
    ) AS tasa_atraso
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.name
HAVING COUNT(l.id) > 0;

-- VIEW: vw_inventory_health
-- Muestra la salud del inventario por categoría.
-- Grain: un registro por categoría.
-- Métricas: total_copias, disponibles, prestados, perdidos.
-- VERIFY:
-- SELECT * FROM vw_inventory_health;

CREATE VIEW vw_inventory_health AS
SELECT
    b.category,
    COUNT(c.id) AS total_copias,
    SUM(CASE WHEN c.status = 'disponible' THEN 1 ELSE 0 END) AS disponibles,
    SUM(CASE WHEN c.status = 'prestado' THEN 1 ELSE 0 END) AS prestados,
    SUM(CASE WHEN c.status = 'perdido' THEN 1 ELSE 0 END) AS perdidos
FROM books b
JOIN copies c ON b.id = c.book_id
GROUP BY b.category;
