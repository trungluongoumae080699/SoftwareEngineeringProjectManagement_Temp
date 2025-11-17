import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: ".env.admin" });

const script_name = "database_modi_01";

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

async function findScriptByName(): Promise<boolean> {
    const [rows] = await pool.query(
        `SELECT 1 FROM migration WHERE name = ? LIMIT 1`,
        [script_name]
    );

    return Array.isArray(rows) && rows.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                               MODIFY HUB TABLE                              */
/* -------------------------------------------------------------------------- */

async function modifyTableHubs() {
    await pool.query(`
    ALTER TABLE hubs 
      ADD COLUMN address VARCHAR(255),
      ADD COLUMN last_modification_date BIGINT NOT NULL,
      ADD COLUMN deleted BOOLEAN DEFAULT 0;
  `);

    console.log("✅ Modified 'hubs' table: added address, last_modification_date, deleted");
}

/* -------------------------------------------------------------------------- */
/*                               MODIFY BIKE TABLE                             */
/* -------------------------------------------------------------------------- */

async function modifyTableBikes() {
    await pool.query(`
    ALTER TABLE bikes 
      ADD COLUMN name VARCHAR(255),
      ADD COLUMN deleted BOOLEAN DEFAULT 0,
      MODIFY COLUMN status ENUM('Idle', 'Reserved', 'Inuse') DEFAULT 'Idle',
      MODIFY COLUMN purchase_date BIGINT,
      MODIFY COLUMN last_service_date BIGINT;
  `);

    console.log("✅ Modified 'bikes' table: added name, deleted, changed date types");
}

/* -------------------------------------------------------------------------- */
/*                               MODIFY TRIP TABLE                             */
/* -------------------------------------------------------------------------- */

async function modifyTableTrips() {
    await pool.query(`
    ALTER TABLE trips
      ADD COLUMN hub_id CHAR(36) NOT NULL,
      ADD COLUMN reservation_date BIGINT NOT NULL,
      ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT 0,
      ADD COLUMN price INT,
      ADD COLUMN isPaid BOOLEAN NOT NULL DEFAULT 0,
      DROP COLUMN trip_start_long,
      DROP COLUMN trip_start_lat,
      MODIFY COLUMN trip_status ENUM('Cancelled', 'Pending', 'Complete', 'In Progress') DEFAULT 'Pending',
      MODIFY COLUMN trip_start_date BIGINT NULL,
      MODIFY COLUMN trip_end_date BIGINT NULL;
  `);

    // FK must be added in a separate ALTER in MySQL
    await pool.query(`
      ALTER TABLE trips
        ADD CONSTRAINT fk_trips_hub
        FOREIGN KEY (hub_id) REFERENCES hubs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
  `);

    console.log("✅ Modified 'trips' table: added columns & foreign key");
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
        const alreadyExecuted = await findScriptByName();

        if (!alreadyExecuted) {
            console.log("🚀 Applying migration: database_modi_01 (17 Nov 2025)");

            try {
                await modifyTableBikes();
            } catch (err) {
                console.error("❌ Failed to modify 'bikes' table:", err);
            }

            try {
                await modifyTableHubs();
            } catch (err) {
                console.error("❌ Failed to modify 'hubs' table:", err);
            }

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
        } else {
            console.log(`⚠️ Migration '${script_name}' already executed — skipping.`);
        }

    } catch (err) {
        console.error("❌ Migration runner crashed:", err);
    } finally {
        conn.release();
        process.exit(0)
    }
}

main();