-- Near miss reporting system

CREATE TABLE near_miss_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    establishment_id INTEGER NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    reporter_name TEXT,
    is_anonymous INTEGER NOT NULL DEFAULT 0,
    report_date TEXT NOT NULL,
    what_happened TEXT NOT NULL,
    what_could_have_happened TEXT NOT NULL,
    potential_severity TEXT NOT NULL DEFAULT 'medium',
    category TEXT,
    corrective_action_taken TEXT,
    status TEXT NOT NULL DEFAULT 'reported',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_near_miss_date ON near_miss_reports(report_date);
CREATE INDEX idx_near_miss_status ON near_miss_reports(status);
