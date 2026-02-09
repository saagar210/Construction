-- JSA/JHA (Job Safety Analysis) system

-- JSA templates (reusable job task templates)
CREATE TABLE jsa_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    trade TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- JSA instances (specific job instances)
CREATE TABLE jsa_instances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER REFERENCES jsa_templates(id),
    establishment_id INTEGER NOT NULL REFERENCES establishments(id),
    location_id INTEGER REFERENCES locations(id),
    job_name TEXT NOT NULL,
    job_date TEXT NOT NULL,
    prepared_by TEXT NOT NULL,
    reviewed_by TEXT,
    approved_by TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- JSA steps (individual work steps)
CREATE TABLE jsa_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jsa_instance_id INTEGER NOT NULL REFERENCES jsa_instances(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    task_description TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Hazards per step
CREATE TABLE jsa_hazards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jsa_step_id INTEGER NOT NULL REFERENCES jsa_steps(id) ON DELETE CASCADE,
    hazard_description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Control measures per hazard (hierarchy of controls)
CREATE TABLE jsa_controls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jsa_hazard_id INTEGER NOT NULL REFERENCES jsa_hazards(id) ON DELETE CASCADE,
    control_type TEXT NOT NULL,
    control_description TEXT NOT NULL,
    is_implemented INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_jsa_instances_status ON jsa_instances(status);
CREATE INDEX idx_jsa_instances_date ON jsa_instances(job_date);
CREATE INDEX idx_jsa_steps_instance ON jsa_steps(jsa_instance_id);
CREATE INDEX idx_jsa_hazards_step ON jsa_hazards(jsa_step_id);
CREATE INDEX idx_jsa_controls_hazard ON jsa_controls(jsa_hazard_id);
