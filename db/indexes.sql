CREATE INDEX idx_loans_copy_id
ON loans(copy_id);

CREATE INDEX idx_loans_due_at
ON loans(due_at);

CREATE INDEX idx_loans_member_id
ON loans(member_id);
