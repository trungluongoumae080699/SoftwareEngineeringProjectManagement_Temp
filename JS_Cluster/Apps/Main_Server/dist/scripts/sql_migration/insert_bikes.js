import { promises as fs } from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: ".env.admin" });
const script_name = "insert_bikes";
const prerequisite_script = "database_modi_01";
// ------------------- DB CONNECTION -------------------
const pool = mysql.createPool({
    host: process.env.DB_MYSQL_HOST,
    port: Number(process.env.DB_MYSQL_PORT) || 3306,
    user: process.env.DB_MYSQL_ADMIN_USER,
    password: process.env.DB_MYSQL_ADMIN_PASS,
    database: process.env.DB_MYSQL_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 1,
});
// ------------------- BULK INSERT SCRIPT -------------------
export async function insertBikesFromJsonBulk() {
    console.log("📂 Reading bikes from src/Assets/bikes.json ...");
    const raw = await fs.readFile("src/Assets/bikes.json", "utf8");
    const bikes = JSON.parse(raw);
    if (!Array.isArray(bikes) || bikes.length === 0) {
        console.error("⚠️ bikes.json is empty or invalid.");
        return;
    }
    console.log(`📦 Loaded ${bikes.length} bikes from bikes.json`);
    // Build multi-value placeholders
    const placeholders = bikes.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
    const sql = `
    INSERT INTO bikes (
      id,
      status,
      maximum_speed,
      maximum_functional_distance,
      purchase_date,
      last_service_date,
      current_hub,
      deleted
    )
    VALUES ${placeholders}
  `;
    const values = [];
    for (const bike of bikes) {
        values.push(bike.id, bike.status, bike.maximum_speed, bike.maximum_functional_distance, bike.purchase_date, bike.last_service_date, bike.current_hub ?? null, bike.deleted);
    }
    console.log("🚀 Executing bulk insert into 'bikes' table...");
    try {
        const [result] = await pool.query(sql, values);
        console.log("✅ Successfully inserted bikes into 'bikes' table.");
    }
    catch (err) {
        console.error("❌ Bulk insert failed:", err);
        throw err;
    }
}
/* -------------------------------------------------------------------------- */
/*                         CHECK MIGRATION HAS RUN                             */
/* -------------------------------------------------------------------------- */
async function findScriptByName(name) {
    const [rows] = await pool.query(`SELECT 1 FROM migration WHERE name = ? LIMIT 1`, [name]);
    const exists = Array.isArray(rows) && rows.length > 0;
    console.log(exists
        ? `📜 Migration '${name}' already recorded in 'migration' table.`
        : `📜 Migration '${name}' not found in 'migration' table.`);
    return exists;
}
// ------------------- MAIN EXECUTION -------------------
async function main() {
    try {
        const ok = await findScriptByName(prerequisite_script);
        const alreadyRun = await findScriptByName(script_name);
        if (!ok) {
            console.log(`⚠️ Must run migration '${prerequisite_script}' BEFORE inserting trips.`);
            return;
        }
        if (alreadyRun) {
            console.log(`Script has already been executed`);
            return;
        }
        await insertBikesFromJsonBulk();
        console.log("🎉 Done inserting bikes (bulk).");
        await pool.query(`INSERT INTO migration (name) VALUES (?);`, [script_name]);
        console.log(`📜 Migration '${script_name}' recorded`);
    }
    catch (err) {
        console.error("❌ insertBikesFromJsonBulk failed:", err);
    }
    finally {
        await pool.end();
        console.log("🔌 MySQL pool closed.");
        process.exit();
    }
}
main();
