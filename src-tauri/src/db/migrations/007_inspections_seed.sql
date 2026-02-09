-- Seed inspection templates

INSERT INTO inspection_templates (name, description, category) VALUES
('Scaffold Inspection', 'Daily scaffold safety inspection', 'Equipment'),
('Ladder Inspection', 'Pre-use ladder safety check', 'Equipment'),
('PPE Compliance Check', 'Personal protective equipment compliance', 'Safety'),
('Forklift Inspection', 'Daily forklift pre-operation check', 'Equipment'),
('Excavation Safety Check', 'Trenching and excavation safety', 'Site'),
('Electrical Safety Audit', 'Electrical equipment and GFCI inspection', 'Electrical'),
('General Site Inspection', 'Overall site safety walkthrough', 'Site');

-- Scaffold inspection items
INSERT INTO inspection_checklist_items (template_id, item_number, item_description, is_critical) VALUES
(1, 1, 'Guardrails installed on all open sides', 1),
(1, 2, 'Planking secure with no gaps greater than 1 inch', 1),
(1, 3, 'Access ladder properly secured', 1),
(1, 4, 'Scaffold level and plumb', 1),
(1, 5, 'Mud sills in place on all base plates', 0),
(1, 6, 'Scaffold tagged with color-coded inspection tag', 1);
