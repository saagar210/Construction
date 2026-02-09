-- Seed trade-specific hazards

-- Electrical hazards
INSERT INTO trade_hazards (trade, hazard_name, hazard_description, osha_standard, recommended_controls) VALUES
('electrical', 'Arc Flash', 'High-energy electrical discharge', '1926.416', '["Use arc-rated PPE", "De-energize before work", "Maintain safe approach distances"]'),
('electrical', 'Electrocution', 'Contact with energized conductors', '1926.404', '["Lockout/tagout", "Insulated tools", "Ground-fault protection"]'),
('electrical', 'Overhead Power Lines', 'Contact with overhead lines', '1926.416', '["Maintain 10-foot clearance", "Use spotter", "De-energize lines"]');

-- Plumbing hazards
INSERT INTO trade_hazards (trade, hazard_name, hazard_description, osha_standard, recommended_controls) VALUES
('plumbing', 'Trench Collapse', 'Cave-in during excavation', '1926.652', '["Shoring/shielding", "Sloping", "Competent person on-site"]'),
('plumbing', 'Confined Space', 'Permit-required confined space entry', '1926.1203', '["Air monitoring", "Ventilation", "Rescue plan"]'),
('plumbing', 'Hot Work (Soldering)', 'Fire hazard from torches', '1926.352', '["Fire watch", "Clear combustibles", "Fire extinguisher"]');

-- HVAC hazards
INSERT INTO trade_hazards (trade, hazard_name, hazard_description, osha_standard, recommended_controls) VALUES
('hvac', 'Refrigerant Exposure', 'Chemical exposure to refrigerants', '1926.55', '["Ventilation", "Respirator", "Leak detection"]'),
('hvac', 'Working at Heights (Roof)', 'Fall from roof during install', '1926.501', '["Guardrails", "Personal fall arrest", "Safety monitors"]'),
('hvac', 'Lifting Heavy Equipment', 'Musculoskeletal injuries', '1926.1053', '["Mechanical lifts", "Team lifts", "Proper technique"]');

-- Concrete hazards
INSERT INTO trade_hazards (trade, hazard_name, hazard_description, osha_standard, recommended_controls) VALUES
('concrete', 'Cement Chemical Burns', 'Skin contact with wet concrete', '1926.55', '["Waterproof gloves", "Boots", "Wash immediately"]'),
('concrete', 'Formwork Collapse', 'Failure of concrete forms', '1926.703', '["Engineered shoring", "Inspect before pour", "Rated capacity"]'),
('concrete', 'Silica Dust', 'Respirable crystalline silica', '1926.1153', '["Wet methods", "Vacuum dust collection", "Respirators"]');

-- Carpentry hazards
INSERT INTO trade_hazards (trade, hazard_name, hazard_description, osha_standard, recommended_controls) VALUES
('carpentry', 'Saw Blade Contact', 'Cuts from circular saws', '1926.304', '["Blade guards", "PPE", "Push sticks"]'),
('carpentry', 'Nail Gun Injuries', 'Accidental discharge', '1926.302', '["Sequential trigger", "Training", "Never bypass safety"]'),
('carpentry', 'Fall from Height', 'Falls during framing', '1926.501', '["Fall protection at 6 feet", "Guardrails", "Safety nets"]');
