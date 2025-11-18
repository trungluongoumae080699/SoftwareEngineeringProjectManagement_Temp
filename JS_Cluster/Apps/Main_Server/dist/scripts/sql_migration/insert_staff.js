import dotenv from "dotenv";
import { promises as fs } from "fs";
import mysql from "mysql2/promise";
dotenv.config({ path: ".env.admin" });
const script_name = "insert_staff";
const prerequisite_script = "database_modi_01";
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
/* -------------------------------------------------------------------------- */
/*                       BULK INSERT STAFF FROM JSON                           */
/* -------------------------------------------------------------------------- */
async function insertStaffFromJsonBulk() {
    console.log("📂 Reading staff from src/Assets/staff.json ...");
    const raw = await fs.readFile("src/Assets/staff.json", "utf8");
    const staffList = JSON.parse(raw);
    if (!Array.isArray(staffList) || staffList.length === 0) {
        console.log("⚠️ staff.json is empty or not an array, nothing to insert.");
        return;
    }
    console.log(`📦 Loaded ${staffList.length} staff entries from staff.json`);
    const placeholders = staffList.map(() => "(?, ?, ?, ?, ?)").join(", ");
    const sql = `
    INSERT INTO staff (
      id,
      full_name,
      email,
      password,
      created_at
    )
    VALUES ${placeholders}
  `;
    const values = [];
    for (const s of staffList) {
        values.push(s.id, s.full_name, s.email, s.password, new Date(s.created_at));
    }
    console.log("🚀 Executing bulk INSERT into 'staff' table...");
    try {
        await pool.query(sql, values);
        console.log("✅ Bulk inserted staff into 'staff' table.");
    }
    catch (err) {
        console.error("❌ Bulk insert failed:", err);
        throw err;
    }
}
/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */
async function main() {
    try {
        console.log("🔍 Checking if required migration has been applied...");
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
        if (!ok) {
            console.log(`⚠️ Migration '${prerequisite_script}' has NOT been executed.\n` +
                "   Please execute database_modi_01 before inserting staff.");
            return;
        }
        await insertStaffFromJsonBulk();
        await pool.query(`INSERT INTO migration (name) VALUES (?);`, [script_name]);
        console.log(`📜 Migration '${script_name}' recorded`);
        console.log("🎉 Done inserting staff (bulk).");
    }
    catch (err) {
        console.error("❌ insertStaffFromJsonBulk main() failed:", err);
    }
    finally {
        await pool.end();
        console.log("🔌 Closed MySQL pool.");
        process.exit();
    }
}
main();
