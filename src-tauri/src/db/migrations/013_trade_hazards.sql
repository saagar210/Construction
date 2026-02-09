-- Trade-specific hazard libraries

CREATE TABLE trade_hazards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trade TEXT NOT NULL,
    hazard_name TEXT NOT NULL,
    hazard_description TEXT,
    osha_standard TEXT,
    recommended_controls TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_trade_hazards_trade ON trade_hazards(trade);
