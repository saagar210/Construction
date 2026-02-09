-- Safety inspection system

CREATE TABLE inspection_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE inspection_checklist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL REFERENCES inspection_templates(id) ON DELETE CASCADE,
    item_number INTEGER NOT NULL,
    item_description TEXT NOT NULL,
    is_critical INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL REFERENCES inspection_templates(id) ON DELETE CASCADE,
    establishment_id INTEGER NOT NULL REFERENCES establishments(id),
    location_id INTEGER REFERENCES locations(id),
    inspector_name TEXT NOT NULL,
    inspection_date TEXT NOT NULL,
    overall_status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE inspection_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_id INTEGER NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    checklist_item_id INTEGER NOT NULL REFERENCES inspection_checklist_items(id),
    status TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_inspections_date ON inspections(inspection_date);
CREATE INDEX idx_inspections_status ON inspections(overall_status);
