// ── Establishments & Locations ──

export interface Establishment {
  id: number;
  name: string;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  industry_description: string | null;
  naics_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEstablishment {
  name: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  industry_description?: string;
  naics_code?: string;
}

export interface UpdateEstablishment {
  name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  industry_description?: string;
  naics_code?: string;
}

export interface Location {
  id: number;
  establishment_id: number;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLocation {
  establishment_id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface UpdateLocation {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  is_active?: boolean;
}

// ── Incidents ──

export type OutcomeSeverity = 'death' | 'days_away' | 'job_transfer_restriction' | 'other_recordable';
export type InjuryIllnessType = 'injury' | 'skin_disorder' | 'respiratory' | 'poisoning' | 'hearing_loss' | 'other_illness';
export type IncidentStatus = 'open' | 'in_review' | 'closed';

export interface Incident {
  id: number;
  case_number: number | null;
  establishment_id: number;
  location_id: number | null;
  employee_name: string;
  employee_job_title: string | null;
  employee_address: string | null;
  employee_city: string | null;
  employee_state: string | null;
  employee_zip: string | null;
  employee_dob: string | null;
  employee_hire_date: string | null;
  employee_gender: string | null;
  is_privacy_case: boolean;
  incident_date: string;
  incident_time: string | null;
  work_start_time: string | null;
  where_occurred: string | null;
  description: string;
  activity_before_incident: string | null;
  how_injury_occurred: string | null;
  injury_description: string | null;
  object_substance: string | null;
  physician_name: string | null;
  treatment_facility: string | null;
  facility_address: string | null;
  facility_city_state_zip: string | null;
  treated_in_er: boolean | null;
  hospitalized_overnight: boolean | null;
  outcome_severity: OutcomeSeverity;
  days_away_count: number;
  days_restricted_count: number;
  date_of_death: string | null;
  injury_illness_type: InjuryIllnessType;
  is_recordable: boolean;
  status: IncidentStatus;
  completed_by: string | null;
  completed_by_title: string | null;
  completed_by_phone: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateIncident {
  establishment_id: number;
  location_id?: number;
  employee_name: string;
  employee_job_title?: string;
  employee_address?: string;
  employee_city?: string;
  employee_state?: string;
  employee_zip?: string;
  employee_dob?: string;
  employee_hire_date?: string;
  employee_gender?: string;
  is_privacy_case?: boolean;
  incident_date: string;
  incident_time?: string;
  work_start_time?: string;
  where_occurred?: string;
  description: string;
  activity_before_incident?: string;
  how_injury_occurred?: string;
  injury_description?: string;
  object_substance?: string;
  physician_name?: string;
  treatment_facility?: string;
  facility_address?: string;
  facility_city_state_zip?: string;
  treated_in_er?: boolean;
  hospitalized_overnight?: boolean;
  outcome_severity?: OutcomeSeverity;
  days_away_count?: number;
  days_restricted_count?: number;
  date_of_death?: string;
  injury_illness_type?: InjuryIllnessType;
  is_recordable?: boolean;
}

export interface UpdateIncident {
  location_id?: number;
  employee_name?: string;
  employee_job_title?: string;
  employee_address?: string;
  employee_city?: string;
  employee_state?: string;
  employee_zip?: string;
  employee_dob?: string;
  employee_hire_date?: string;
  employee_gender?: string;
  is_privacy_case?: boolean;
  incident_date?: string;
  incident_time?: string;
  work_start_time?: string;
  where_occurred?: string;
  description?: string;
  activity_before_incident?: string;
  how_injury_occurred?: string;
  injury_description?: string;
  object_substance?: string;
  physician_name?: string;
  treatment_facility?: string;
  facility_address?: string;
  facility_city_state_zip?: string;
  treated_in_er?: boolean;
  hospitalized_overnight?: boolean;
  outcome_severity?: OutcomeSeverity;
  days_away_count?: number;
  days_restricted_count?: number;
  date_of_death?: string;
  injury_illness_type?: InjuryIllnessType;
  is_recordable?: boolean;
  status?: IncidentStatus;
  completed_by?: string;
  completed_by_title?: string;
  completed_by_phone?: string;
  completed_date?: string;
}

export interface IncidentFilter {
  establishment_id: number;
  location_id?: number;
  status?: IncidentStatus;
  outcome_severity?: OutcomeSeverity;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// ── Attachments ──

export interface Attachment {
  id: number;
  incident_id: number;
  file_name: string;
  file_path: string;
  file_type: 'photo' | 'audio' | 'document';
  file_size: number | null;
  created_at: string;
}

// ── RCA ──

export interface RcaSession {
  id: number;
  incident_id: number;
  method: 'five_whys' | 'fishbone';
  status: 'in_progress' | 'completed';
  root_cause_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface FiveWhysStep {
  id: number;
  rca_session_id: number;
  step_number: number;
  question: string;
  answer: string;
}

export interface FishboneCategory {
  id: number;
  rca_session_id: number;
  category: string;
  sort_order: number;
  causes: FishboneCause[];
}

export interface FishboneCause {
  id: number;
  category_id: number;
  cause_text: string;
  is_root_cause: boolean;
  sort_order: number;
}

export interface CorrectiveAction {
  id: number;
  incident_id: number;
  rca_session_id: number | null;
  description: string;
  assigned_to: string | null;
  due_date: string | null;
  status: 'open' | 'in_progress' | 'completed' | 'overdue';
  completed_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── OSHA ──

export interface Osha300Row {
  case_number: number;
  employee_name: string;
  job_title: string;
  incident_date: string;
  where_occurred: string;
  description: string;
  outcome_death: boolean;
  outcome_days_away: boolean;
  outcome_job_transfer: boolean;
  outcome_other_recordable: boolean;
  days_away_count: number;
  days_restricted_count: number;
  type_injury: boolean;
  type_skin_disorder: boolean;
  type_respiratory: boolean;
  type_poisoning: boolean;
  type_hearing_loss: boolean;
  type_other_illness: boolean;
}

export interface Osha300ASummary {
  year: number;
  establishment_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  industry_description: string;
  naics_code: string;
  total_deaths: number;
  total_days_away_cases: number;
  total_transfer_restriction_cases: number;
  total_other_recordable_cases: number;
  total_days_away: number;
  total_days_restricted: number;
  total_injuries: number;
  total_skin_disorders: number;
  total_respiratory: number;
  total_poisonings: number;
  total_hearing_loss: number;
  total_other_illnesses: number;
  avg_employees: number | null;
  total_hours_worked: number | null;
  certifier_name: string | null;
  certifier_title: string | null;
  certifier_phone: string | null;
  certification_date: string | null;
}

export interface Osha301Report {
  case_number: number;
  employee_name: string;
  employee_address: string;
  employee_city: string;
  employee_state: string;
  employee_zip: string;
  employee_dob: string;
  employee_hire_date: string;
  employee_gender: string;
  physician_name: string;
  treatment_facility: string;
  facility_address: string;
  facility_city_state_zip: string;
  treated_in_er: boolean;
  hospitalized_overnight: boolean;
  incident_date: string;
  incident_time: string;
  work_start_time: string;
  where_occurred: string;
  activity_before_incident: string;
  how_injury_occurred: string;
  injury_description: string;
  object_substance: string;
  date_of_death: string;
  completed_by: string;
  completed_by_title: string;
  completed_by_phone: string;
  completed_date: string;
}

export interface AnnualStats {
  id: number;
  establishment_id: number;
  year: number;
  avg_employees: number;
  total_hours_worked: number;
  certifier_name: string | null;
  certifier_title: string | null;
  certifier_phone: string | null;
  certification_date: string | null;
}

export interface UpsertAnnualStats {
  establishment_id: number;
  year: number;
  avg_employees: number;
  total_hours_worked: number;
  certifier_name?: string;
  certifier_title?: string;
  certifier_phone?: string;
  certification_date?: string;
}

// ── Dashboard ──

export interface DashboardSummary {
  total_incidents: number;
  open_incidents: number;
  total_recordable: number;
  days_since_last_incident: number | null;
  trir: number | null;
}

export interface IncidentsByMonth {
  month: string;
  count: number;
}

export interface IncidentsBySeverity {
  severity: string;
  count: number;
}

export interface IncidentsByLocation {
  location_name: string;
  count: number;
}

export interface IncidentsByType {
  injury_type: string;
  count: number;
}

export interface CorrectiveActionSummary {
  open: number;
  in_progress: number;
  completed: number;
  overdue: number;
}

// ── Import ──

export interface CsvPreview {
  headers: string[];
  sample_rows: string[][];
  total_rows: number;
}

export interface ColumnMapping {
  employee_name?: string;
  employee_job_title?: string;
  incident_date?: string;
  description?: string;
  where_occurred?: string;
  outcome_severity?: string;
  days_away_count?: string;
  days_restricted_count?: string;
  injury_illness_type?: string;
  employee_gender?: string;
}

export interface ImportResult {
  imported: number;
  errors: string[];
}
