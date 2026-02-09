-- Equipment safety tracking

CREATE TABLE equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_type TEXT NOT NULL,
    equipment_number TEXT NOT NULL UNIQUE,
    manufacturer TEXT,
    model TEXT,
    serial_number TEXT,
    purchase_date TEXT,
    location_id INTEGER REFERENCES locations(id),
    status TEXT NOT NULL DEFAULT 'active',
    last_inspection_date TEXT,
    next_inspection_due TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE equipment_inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    inspection_date TEXT NOT NULL,
    inspector_name TEXT NOT NULL,
    inspection_type TEXT NOT NULL,
    result TEXT NOT NULL,
    deficiencies TEXT,
    corrective_actions TEXT,
    next_inspection_due TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE equipment_maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date TEXT NOT NULL,
    maintenance_type TEXT NOT NULL,
    description TEXT NOT NULL,
    performed_by TEXT,
    parts_replaced TEXT,
    cost REAL,
    next_maintenance_due TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_equipment_type ON equipment(equipment_type);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_next_inspection ON equipment(next_inspection_due);
CREATE INDEX idx_equipment_inspections_date ON equipment_inspections(inspection_date);
