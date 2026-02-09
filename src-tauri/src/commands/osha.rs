use crate::db::osha::{
    self, AnnualStats, Osha300ASummary, Osha300Row, Osha301Report, UpsertAnnualStats,
};
use crate::errors::AppError;
use rusqlite::Connection;
use std::sync::Mutex;
use tauri::State;

type DbState = Mutex<Connection>;

#[tauri::command]
pub fn get_osha_300_log(
    db: State<'_, DbState>,
    establishment_id: i64,
    year: i64,
) -> Result<Vec<Osha300Row>, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    osha::get_osha_300_log(&conn, establishment_id, year)
        .map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn get_osha_300a_summary(
    db: State<'_, DbState>,
    establishment_id: i64,
    year: i64,
) -> Result<Osha300ASummary, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    osha::get_osha_300a_summary(&conn, establishment_id, year)
        .map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn get_osha_301_report(
    db: State<'_, DbState>,
    incident_id: i64,
) -> Result<Osha301Report, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    osha::get_osha_301_report(&conn, incident_id)
        .map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn export_osha_300_csv(
    db: State<'_, DbState>,
    establishment_id: i64,
    year: i64,
    establishment_name: String,
) -> Result<String, AppError> {
    use crate::validation;

    // Validate year
    validation::validate_year(year)?;

    // Create safe export path using sanitized establishment name
    let file_base = format!("OSHA_300_{}_{}", establishment_name, year);
    let safe_path = validation::safe_export_path(&file_base, "csv")?;

    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    let rows = osha::get_osha_300_log(&conn, establishment_id, year)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let mut wtr = csv::Writer::from_path(&safe_path)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    wtr.write_record([
        "Case No.", "Employee Name", "Job Title", "Date of Injury/Illness",
        "Where Event Occurred", "Description of Injury/Illness",
        "Death", "Days Away From Work", "Job Transfer or Restriction",
        "Other Recordable Cases", "Days Away From Work (Count)",
        "Days of Restricted Work (Count)",
        "Injury", "Skin Disorder", "Respiratory Condition", "Poisoning",
        "Hearing Loss", "All Other Illnesses",
    ]).map_err(|e| AppError::Internal(e.to_string()))?;

    for row in &rows {
        wtr.write_record([
            &row.case_number.to_string(),
            &row.employee_name,
            &row.job_title,
            &row.incident_date,
            &row.where_occurred,
            &row.description,
            &bool_to_x(row.outcome_death),
            &bool_to_x(row.outcome_days_away),
            &bool_to_x(row.outcome_job_transfer),
            &bool_to_x(row.outcome_other_recordable),
            &row.days_away_count.to_string(),
            &row.days_restricted_count.to_string(),
            &bool_to_x(row.type_injury),
            &bool_to_x(row.type_skin_disorder),
            &bool_to_x(row.type_respiratory),
            &bool_to_x(row.type_poisoning),
            &bool_to_x(row.type_hearing_loss),
            &bool_to_x(row.type_other_illness),
        ]).map_err(|e| AppError::Internal(e.to_string()))?;
    }

    wtr.flush().map_err(|e| AppError::Internal(e.to_string()))?;
    Ok(safe_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn upsert_annual_stats(
    db: State<'_, DbState>,
    data: UpsertAnnualStats,
) -> Result<AnnualStats, AppError> {
    use crate::validation;

    // Validate year
    validation::validate_year(data.year)?;

    // Validate employee count and hours
    validation::validate_employee_count(data.avg_employees)?;
    validation::validate_hours_worked(data.total_hours_worked)?;

    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    osha::upsert_annual_stats(&conn, data).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn get_annual_stats(
    db: State<'_, DbState>,
    establishment_id: i64,
    year: i64,
) -> Result<Option<AnnualStats>, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    osha::get_annual_stats(&conn, establishment_id, year)
        .map_err(|e| AppError::Internal(e.to_string()))
}

fn bool_to_x(v: bool) -> String {
    if v { "X".to_string() } else { String::new() }
}
