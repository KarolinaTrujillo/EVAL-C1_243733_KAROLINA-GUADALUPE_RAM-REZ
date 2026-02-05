INSERT INTO members (name, email, member_type, joined_at) VALUES
('Ana López', 'ana.lopez@mail.com', 'estudiante', '2023-01-10'),
('Luis Pérez', 'luis.perez@mail.com', 'docente', '2022-08-15'),
('María Ruiz', 'maria.ruiz@mail.com', 'estudiante', '2024-02-01'),
('Carlos Gómez', 'carlos.gomez@mail.com', 'administrativo', '2021-06-20'),
('Sofía Torres', 'sofia.torres@mail.com', 'estudiante', '2023-09-05');

INSERT INTO books (title, author, category, isbn) VALUES
('Bases de Datos', 'Carlos Mendoza', 'Tecnología', 'ISBN-001'),
('Programación Web', 'Laura Díaz', 'Tecnología', 'ISBN-002'),
('Historia de México', 'Juan Torres', 'Historia', 'ISBN-003'),
('Álgebra Lineal', 'Pedro Ramírez', 'Matemáticas', 'ISBN-004'),
('Redes de Computadoras', 'Ana Fernández', 'Tecnología', 'ISBN-005');

INSERT INTO copies (book_id, barcode, status) VALUES
(1, 'BC-001', 'prestado'),
(1, 'BC-002', 'disponible'),
(2, 'BC-003', 'prestado'),
(3, 'BC-004', 'perdido'),
(4, 'BC-005', 'disponible'),
(5, 'BC-006', 'prestado');

INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(1, 1, '2024-01-01', '2024-01-10', NULL),  
(3, 2, '2024-01-05', '2024-01-12', '2024-01-11'),
(6, 3, '2024-01-08', '2024-01-15', NULL),
(2, 4, '2024-02-01', '2024-02-10', '2024-02-12'),
(5, 5, '2024-02-05', '2024-02-15', '2024-02-14');

INSERT INTO fines (loan_id, amount, paid_at) VALUES
(1, 50.00, NULL),
(3, 30.00, NULL),
(4, 20.00, '2024-02-20'),
(2, 10.00, '2024-01-15'),
(5, 0.00, NULL);
