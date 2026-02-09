-- Training records management

CREATE TABLE training_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    duration_hours REAL,
    certification_valid_months INTEGER,
    certifying_body TEXT,
    is_required INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE training_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL REFERENCES training_courses(id),
    employee_name TEXT NOT NULL,
    employee_id TEXT,
    completion_date TEXT NOT NULL,
    expiration_date TEXT,
    instructor_name TEXT,
    certification_number TEXT,
    score REAL,
    status TEXT NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_training_records_employee ON training_records(employee_name);
CREATE INDEX idx_training_records_expiration ON training_records(expiration_date);
CREATE INDEX idx_training_records_status ON training_records(status);
