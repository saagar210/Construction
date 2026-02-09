-- Seed training courses

INSERT INTO training_courses (name, description, duration_hours, certification_valid_months, certifying_body, is_required) VALUES
('OSHA 10-Hour Construction', 'Basic safety training covering fall protection, electrical, PPE', 10.0, NULL, 'OSHA', 1),
('OSHA 30-Hour Construction', 'Advanced safety training for supervisors', 30.0, NULL, 'OSHA', 0),
('First Aid/CPR', 'Basic first aid and cardiopulmonary resuscitation', 4.0, 24, 'Red Cross', 1),
('Forklift Certification', 'Powered industrial truck operator training', 8.0, 36, 'OSHA', 0),
('Scaffold Competent Person', 'Scaffold erection and safety', 16.0, 60, 'OSHA', 0),
('Fall Protection', 'Fall arrest systems and rescue', 4.0, 12, 'OSHA', 1),
('Confined Space Entry', 'Permit-required confined space training', 8.0, 12, 'OSHA', 0),
('Hazard Communication', 'GHS labeling and SDS', 2.0, 12, 'OSHA', 1),
('Silica Awareness', 'Respirable crystalline silica control', 2.0, 12, 'OSHA', 1),
('Trenching and Excavation', 'Soil classification and cave-in prevention', 8.0, 24, 'OSHA', 0);
