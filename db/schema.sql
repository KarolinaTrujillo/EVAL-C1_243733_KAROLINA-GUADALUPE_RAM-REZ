CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    member_type VARCHAR(20) NOT NULL,
    joined_at DATE NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE copies (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    copy_id INT NOT NULL,
    member_id INT NOT NULL,
    loaned_at DATE NOT NULL,
    due_at DATE NOT NULL,
    returned_at DATE,
    FOREIGN KEY (copy_id) REFERENCES copies(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    loan_id INT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    paid_at DATE,
    FOREIGN KEY (loan_id) REFERENCES loans(id)
);