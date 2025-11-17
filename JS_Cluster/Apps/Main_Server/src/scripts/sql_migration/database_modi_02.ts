import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: ".env.admin" });

const prerequisite_script = "database_modi_01"
const script_name = "database_modi_02";

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
/*                         CHECK IF SCRIPT ALREADY RUN                         */
/* -------------------------------------------------------------------------- */

async function findScriptByName(name: string): Promise<boolean> {
    const [rows] = await pool.query(
        `SELECT 1 FROM migration WHERE name = ? LIMIT 1`,
        [name]
    );

    return Array.isArray(rows) && rows.length > 0;
}



/* -------------------------------------------------------------------------- */
/*                               MODIFY TRIP TABLE                             */
/* -------------------------------------------------------------------------- */

async function modifyTableTrips() {
    await pool.query(`
    ALTER TABLE trips
      MODIFY reservation_expiry BIGINT NOT NULL;
  `);

    console.log("✅ Modified 'trips' table: added columns");
}



/* -------------------------------------------------------------------------- */
/*                           RECORD SCRIPT EXECUTION                           */
/* -------------------------------------------------------------------------- */

async function addScriptHistory() {
    await pool.query(
        `INSERT INTO migration (name) VALUES (?);`,
        [script_name]
    );
    console.log(`📜 Migration '${script_name}' recorded`);
}

/* -------------------------------------------------------------------------- */
/*                                   MAIN                                     */
/* -------------------------------------------------------------------------- */

async function main() {
    const conn = await pool.getConnection();

    try {
        const alreadyExecuted = await findScriptByName(script_name);
        const prerequisiteExecuted = await findScriptByName(prerequisite_script)
        if (!prerequisiteExecuted) {
            console.log("❌ Prerequisite script has not been executed")
        }
        if (alreadyExecuted) {
            console.log("❌ Script has already been executed")
        }

        console.log("🚀 Applying migration: database_modi_01 (17 Nov 2025)");

        try {
            await modifyTableTrips();
        } catch (err) {
            console.error("❌ Failed to modify 'trips' table:", err);
        }
        try {
            await addScriptHistory();
            console.log("📜 Migration history recorded.");
        } catch (err) {
            console.error("❌ Failed to record migration history:", err);
        }

        console.log("🎉 Migration completed (with possible warnings).");

    } catch (err) {
        console.error("❌ Migration runner crashed:", err);
    } finally {
        conn.release();
        process.exit(0)
    }
}

main();