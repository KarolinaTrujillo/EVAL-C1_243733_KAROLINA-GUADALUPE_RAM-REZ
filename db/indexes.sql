
CREATE INDEX idx_loans_copy_id ON loans(copy_id);


CREATE INDEX idx_loans_due_at ON loans(due_at);


CREATE INDEX idx_loans_member_id ON loans(member_id);


CREATE INDEX idx_fines_loan_id ON fines(loan_id);


CREATE INDEX idx_copies_book_id ON copies(book_id);