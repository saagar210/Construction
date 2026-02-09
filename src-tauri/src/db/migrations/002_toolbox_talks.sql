-- Toolbox talk topics library (reusable templates)
CREATE TABLE toolbox_talk_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category TEXT,
    duration_minutes INTEGER DEFAULT 15,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Toolbox talk instances (scheduled or completed)
CREATE TABLE toolbox_talks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER REFERENCES toolbox_talk_topics(id),
    establishment_id INTEGER NOT NULL REFERENCES establishments(id),
    location_id INTEGER REFERENCES locations(id),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    conducted_by TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Toolbox talk attendees with digital signatures
CREATE TABLE toolbox_talk_attendees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    talk_id INTEGER NOT NULL REFERENCES toolbox_talks(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    employee_id TEXT,
    signature_data TEXT,
    signed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_toolbox_talks_date ON toolbox_talks(date);
CREATE INDEX idx_toolbox_talks_status ON toolbox_talks(status);
CREATE INDEX idx_toolbox_talk_attendees_talk ON toolbox_talk_attendees(talk_id);
