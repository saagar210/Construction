-- Seed JSA templates (steps/hazards/controls added when creating instances)

INSERT INTO jsa_templates (name, description, trade) VALUES
('Excavation Work', 'Trenching and excavation operations including utility location, shoring, and atmospheric monitoring', 'general'),
('Hot Work Operations', 'Welding, cutting, and brazing with fire prevention measures', 'welding'),
('Roofing Installation', 'Installing roofing materials at heights with fall protection', 'roofing'),
('Confined Space Entry', 'Entry into permit-required confined spaces with atmospheric testing', 'general'),
('Electrical Panel Installation', 'Installing and wiring electrical panels with lockout/tagout', 'electrical');
