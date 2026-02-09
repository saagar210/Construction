use anyhow::{Context, Result};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

use crate::errors::AppError;

// ── Establishment ──

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Establishment {
    pub id: i64,
    pub name: String,
    pub street_address: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub zip_code: Option<String>,
    pub industry_description: Option<String>,
    pub naics_code: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateEstablishment {
    pub name: String,
    pub street_address: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub zip_code: Option<String>,
    pub industry_description: Option<String>,
    pub naics_code: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateEstablishment {
    pub name: Option<String>,
    pub street_address: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub zip_code: Option<String>,
    pub industry_description: Option<String>,
    pub naics_code: Option<String>,
}

pub fn create_establishment(conn: &Connection, data: CreateEstablishment) -> Result<Establishment> {
    conn.execute(
        "INSERT INTO establishments (name, street_address, city, state, zip_code, industry_description, naics_code)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            data.name,
            data.street_address,
            data.city,
            data.state,
            data.zip_code,
            data.industry_description,
            data.naics_code,
        ],
    )
    .context("Failed to create establishment")?;

    let id = conn.last_insert_rowid();
    get_establishment(conn, id)
}

pub fn get_establishment(conn: &Connection, id: i64) -> Result<Establishment> {
    conn.query_row(
        "SELECT id, name, street_address, city, state, zip_code, industry_description, naics_code, created_at, updated_at
         FROM establishments WHERE id = ?1",
        [id],
        |row| {
            Ok(Establishment {
                id: row.get(0)?,
                name: row.get(1)?,
                street_address: row.get(2)?,
                city: row.get(3)?,
                state: row.get(4)?,
                zip_code: row.get(5)?,
                industry_description: row.get(6)?,
                naics_code: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        },
    )
    .map_err(|e| match e {
        rusqlite::Error::QueryReturnedNoRows => {
            AppError::NotFound(format!("Establishment {id} not found")).into()
        }
        _ => anyhow::Error::new(e),
    })
}

pub fn list_establishments(conn: &Connection) -> Result<Vec<Establishment>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, street_address, city, state, zip_code, industry_description, naics_code, created_at, updated_at
         FROM establishments ORDER BY name",
    )?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Establishment {
                id: row.get(0)?,
                name: row.get(1)?,
                street_address: row.get(2)?,
                city: row.get(3)?,
                state: row.get(4)?,
                zip_code: row.get(5)?,
                industry_description: row.get(6)?,
                naics_code: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(rows)
}

pub fn update_establishment(
    conn: &Connection,
    id: i64,
    data: UpdateEstablishment,
) -> Result<Establishment> {
    // Verify exists
    let _existing = get_establishment(conn, id)?;

    let mut sets = Vec::new();
    let mut values: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();

    if let Some(ref name) = data.name {
        sets.push("name = ?");
        values.push(Box::new(name.clone()));
    }
    if let Some(ref v) = data.street_address {
        sets.push("street_address = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(ref v) = data.city {
        sets.push("city = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(ref v) = data.state {
        sets.push("state = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(ref v) = data.zip_code {
        sets.push("zip_code = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(ref v) = data.industry_description {
        sets.push("industry_description = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(ref v) = data.naics_code {
        sets.push("naics_code = ?");
        values.push(Box::new(v.clone()));
    }

    if !sets.is_empty() {
        sets.push("updated_at = datetime('now')");
        let sql = format!("UPDATE establishments SET {} WHERE id = ?", sets.join(", "));
        values.push(Box::new(id));
        let params: Vec<&dyn rusqlite::types::ToSql> = values.iter().map(|v| v.as_ref()).collect();
        conn.execute(&sql, params.as_slice())
            .context("Failed to update establishment")?;
    }

    get_establishment(conn, id)
}

pub fn delete_establishment(conn: &Connection, id: i64) -> Result<()> {
    let changes = conn
        .execute("DELETE FROM establishments WHERE id = ?1", [id])
        .context("Failed to delete establishment")?;

    if changes == 0 {
        return Err(AppError::NotFound(format!("Establishment {id} not found")).into());
    }
    Ok(())
}

// ── Location ──

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Location {
    pub id: i64,
    pub establishment_id: i64,
    pub name: String,
    pub address: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub is_active: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateLocation {
    pub establishment_id: i64,
    pub name: String,
    pub address: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateLocation {
    pub name: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub is_active: Option<bool>,
}

pub fn create_location(conn: &Connection, data: CreateLocation) -> Result<Location> {
    conn.execute(
        "INSERT INTO locations (establishment_id, name, address, city, state)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            data.establishment_id,
            data.name,
            data.address,
            data.city,
            data.state,
        ],
    )
    .context("Failed to create location")?;

    let id = conn.last_insert_rowid();
    get_location(conn, id)
}

pub fn get_location(conn: &Connection, id: i64) -> Result<Location> {
    conn.query_row(
        "SELECT id, establishment_id, name, address, city, state, is_active, created_at, updated_at
         FROM locations WHERE id = ?1",
        [id],
        |row| {
            Ok(Location {
                id: row.get(0)?,
                establishment_id: row.get(1)?,
                name: row.get(2)?,
                address: row.get(3)?,
                city: row.get(4)?,
                state: row.get(5)?,
                is_active: row.get::<_, i32>(6)? != 0,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            })
        },
    )
    .map_err(|e| match e {
        rusqlite::Error::QueryReturnedNoRows => {
            AppError::NotFound(format!("Location {id} not found")).into()
        }
        _ => anyhow::Error::new(e),
    })
}

pub fn list_locations(conn: &Connection, establishment_id: i64) -> Result<Vec<Location>> {
    let mut stmt = conn.prepare(
        "SELECT id, establishment_id, name, address, city, state, is_active, created_at, updated_at
         FROM locations WHERE establishment_id = ?1 ORDER BY name",
    )?;

    let rows = stmt
        .query_map([establishment_id], |row| {
            Ok(Location {
                id: row.get(0)?,
                establishment_id: row.get(1)?,
                name: row.get(2)?,
                address: row.get(3)?,
                city: row.get(4)?,
                state: row.get(5)?,
                is_active: row.get::<_, i32>(6)? != 0,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(rows)
}

pub fn update_location(conn: &Connection, id: i64, data: UpdateLocation) -> Result<Location> {
    let _existing = get_location(conn, id)?;

    let mut sets = Vec::new();
    let mut values: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();

    if let Some(ref name) = data.name {
        sets.push("name = ?");
        values.push(Box::new(name.clone()));
    }
    if let Some(ref v) = data.address {
        sets.push("address = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(ref v) = data.city {
        sets.push("city = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(ref v) = data.state {
        sets.push("state = ?");
        values.push(Box::new(v.clone()));
    }
    if let Some(active) = data.is_active {
        sets.push("is_active = ?");
        values.push(Box::new(active as i32));
    }

    if !sets.is_empty() {
        sets.push("updated_at = datetime('now')");
        let sql = format!("UPDATE locations SET {} WHERE id = ?", sets.join(", "));
        values.push(Box::new(id));
        let params: Vec<&dyn rusqlite::types::ToSql> = values.iter().map(|v| v.as_ref()).collect();
        conn.execute(&sql, params.as_slice())
            .context("Failed to update location")?;
    }

    get_location(conn, id)
}

pub fn delete_location(conn: &Connection, id: i64) -> Result<()> {
    let changes = conn
        .execute("DELETE FROM locations WHERE id = ?1", [id])
        .context("Failed to delete location")?;

    if changes == 0 {
        return Err(AppError::NotFound(format!("Location {id} not found")).into());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::open_test_db;

    fn create_test_establishment(conn: &Connection) -> Establishment {
        create_establishment(
            conn,
            CreateEstablishment {
                name: "Test Construction Co".into(),
                street_address: Some("123 Main St".into()),
                city: Some("Springfield".into()),
                state: Some("IL".into()),
                zip_code: Some("62701".into()),
                industry_description: Some("General Construction".into()),
                naics_code: Some("236220".into()),
            },
        )
        .expect("create establishment")
    }

    #[test]
    fn test_establishment_crud() {
        let conn = open_test_db();
        let est = create_test_establishment(&conn);
        assert_eq!(est.name, "Test Construction Co");

        let fetched = get_establishment(&conn, est.id).unwrap();
        assert_eq!(fetched.city.as_deref(), Some("Springfield"));

        let updated = update_establishment(
            &conn,
            est.id,
            UpdateEstablishment {
                name: Some("Updated Co".into()),
                street_address: None,
                city: None,
                state: None,
                zip_code: None,
                industry_description: None,
                naics_code: None,
            },
        )
        .unwrap();
        assert_eq!(updated.name, "Updated Co");

        let all = list_establishments(&conn).unwrap();
        assert_eq!(all.len(), 1);

        delete_establishment(&conn, est.id).unwrap();
        assert!(get_establishment(&conn, est.id).is_err());
    }

    #[test]
    fn test_location_crud() {
        let conn = open_test_db();
        let est = create_test_establishment(&conn);

        let loc = create_location(
            &conn,
            CreateLocation {
                establishment_id: est.id,
                name: "Main Office".into(),
                address: Some("456 Oak Ave".into()),
                city: Some("Springfield".into()),
                state: Some("IL".into()),
            },
        )
        .unwrap();
        assert_eq!(loc.name, "Main Office");
        assert!(loc.is_active);

        let updated = update_location(
            &conn,
            loc.id,
            UpdateLocation {
                name: None,
                address: None,
                city: None,
                state: None,
                is_active: Some(false),
            },
        )
        .unwrap();
        assert!(!updated.is_active);

        let locs = list_locations(&conn, est.id).unwrap();
        assert_eq!(locs.len(), 1);

        delete_location(&conn, loc.id).unwrap();
        assert!(get_location(&conn, loc.id).is_err());
    }
}
