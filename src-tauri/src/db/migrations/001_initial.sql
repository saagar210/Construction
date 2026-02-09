-- Establishment/company info (supports multi-location)
CREATE TABLE IF NOT EXISTS establishments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    street_address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    industry_description TEXT,
    naics_code TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Jobsite locations linked to establishments
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    establishment_id INTEGER NOT NULL REFERENCES establishments(id),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Core incident records (maps to OSHA 300 Log rows + 301 detail)
CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_number INTEGER,
    establishment_id INTEGER NOT NULL REFERENCES establishments(id),
    location_id INTEGER REFERENCES locations(id),

    -- Employee info (301 Section A)
    employee_name TEXT NOT NULL,
    employee_job_title TEXT,
    employee_address TEXT,
    employee_city TEXT,
    employee_state TEXT,
    employee_zip TEXT,
    employee_dob TEXT,
    employee_hire_date TEXT,
    employee_gender TEXT,
    is_privacy_case INTEGER NOT NULL DEFAULT 0,

    -- Incident basics (300 Log columns D-F)
    incident_date TEXT NOT NULL,
    incident_time TEXT,
    work_start_time TEXT,
    where_occurred TEXT,
    description TEXT NOT NULL,

    -- 301 detailed descriptions (Section C fields 19-22)
    activity_before_incident TEXT,
    how_injury_occurred TEXT,
    injury_description TEXT,
    object_substance TEXT,

    -- Healthcare (301 Section B)
    physician_name TEXT,
    treatment_facility TEXT,
    facility_address TEXT,
    facility_city_state_zip TEXT,
    treated_in_er INTEGER,
    hospitalized_overnight INTEGER,

    -- Outcome severity (300 Log columns G-L)
    outcome_severity TEXT NOT NULL DEFAULT 'other_recordable',
    days_away_count INTEGER DEFAULT 0,
    days_restricted_count INTEGER DEFAULT 0,
    date_of_death TEXT,

    -- Injury/illness type (300 Log columns M1-M6)
    injury_illness_type TEXT NOT NULL DEFAULT 'injury',

    -- Tracking
    is_recordable INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'open',
    completed_by TEXT,
    completed_by_title TEXT,
    completed_by_phone TEXT,
    completed_date TEXT,

    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- File attachments (photos, audio, documents)
CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Root cause analysis sessions
CREATE TABLE IF NOT EXISTS rca_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'in_progress',
    root_cause_summary TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5 Whys steps
CREATE TABLE IF NOT EXISTS five_whys_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rca_session_id INTEGER NOT NULL REFERENCES rca_sessions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

-- Fishbone categories and causes
CREATE TABLE IF NOT EXISTS fishbone_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rca_session_id INTEGER NOT NULL REFERENCES rca_sessions(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS fishbone_causes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES fishbone_categories(id) ON DELETE CASCADE,
    cause_text TEXT NOT NULL,
    is_root_cause INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Corrective actions
CREATE TABLE IF NOT EXISTS corrective_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    rca_session_id INTEGER REFERENCES rca_sessions(id),
    description TEXT NOT NULL,
    assigned_to TEXT,
    due_date TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    completed_date TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Annual workforce data for 300A calculations
CREATE TABLE IF NOT EXISTS annual_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    establishment_id INTEGER NOT NULL REFERENCES establishments(id),
    year INTEGER NOT NULL,
    avg_employees INTEGER NOT NULL,
    total_hours_worked INTEGER NOT NULL,
    certifier_name TEXT,
    certifier_title TEXT,
    certifier_phone TEXT,
    certification_date TEXT,
    UNIQUE(establishment_id, year)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_incidents_establishment ON incidents(establishment_id);
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents(location_id);
CREATE INDEX IF NOT EXISTS idx_incidents_date ON incidents(incident_date);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(outcome_severity);
CREATE INDEX IF NOT EXISTS idx_incidents_recordable ON incidents(is_recordable);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(injury_illness_type);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_status ON corrective_actions(status);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_due ON corrective_actions(due_date);
