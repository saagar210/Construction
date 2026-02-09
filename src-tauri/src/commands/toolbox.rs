use crate::db::toolbox::{
    self, AddAttendee, CreateToolboxTalk, SignAttendee, ToolboxTalk, ToolboxTalkAttendee,
    ToolboxTalkTopic,
};
use crate::errors::AppError;
use rusqlite::Connection;
use std::sync::Mutex;
use tauri::State;

type DbState = Mutex<Connection>;

// Topics
#[tauri::command]
pub fn list_toolbox_topics(
    db: State<'_, DbState>,
    include_inactive: bool,
) -> Result<Vec<ToolboxTalkTopic>, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::list_topics(&conn, include_inactive).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn get_toolbox_topic(db: State<'_, DbState>, id: i64) -> Result<ToolboxTalkTopic, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::get_topic(&conn, id).map_err(|e| AppError::Internal(e.to_string()))
}

// Talks
#[tauri::command]
pub fn create_toolbox_talk(
    db: State<'_, DbState>,
    data: CreateToolboxTalk,
) -> Result<ToolboxTalk, AppError> {
    use crate::validation;

    validation::validate_not_empty(&data.title, "Title")?;
    validation::validate_not_empty(&data.conducted_by, "Conducted by")?;
    validation::validate_date_format(&data.date, "Date")?;

    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::create_talk(&conn, data).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn get_toolbox_talk(db: State<'_, DbState>, id: i64) -> Result<ToolboxTalk, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::get_talk(&conn, id).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn list_toolbox_talks(
    db: State<'_, DbState>,
    establishment_id: i64,
) -> Result<Vec<ToolboxTalk>, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::list_talks(&conn, establishment_id).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn complete_toolbox_talk(db: State<'_, DbState>, talk_id: i64) -> Result<ToolboxTalk, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::complete_talk(&conn, talk_id).map_err(|e| AppError::Internal(e.to_string()))
}

// Attendees
#[tauri::command]
pub fn add_toolbox_attendee(
    db: State<'_, DbState>,
    data: AddAttendee,
) -> Result<ToolboxTalkAttendee, AppError> {
    use crate::validation;

    validation::validate_not_empty(&data.employee_name, "Employee name")?;

    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::add_attendee(&conn, data).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn list_toolbox_attendees(
    db: State<'_, DbState>,
    talk_id: i64,
) -> Result<Vec<ToolboxTalkAttendee>, AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::list_attendees(&conn, talk_id).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn sign_toolbox_attendee(
    db: State<'_, DbState>,
    data: SignAttendee,
) -> Result<ToolboxTalkAttendee, AppError> {
    use crate::validation;

    validation::validate_not_empty(&data.signature_data, "Signature data")?;

    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::sign_attendee(&conn, data).map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn delete_toolbox_attendee(db: State<'_, DbState>, id: i64) -> Result<(), AppError> {
    let conn = db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    toolbox::delete_attendee(&conn, id).map_err(|e| AppError::Internal(e.to_string()))
}
