import { pool } from "../../MySqlConfig.js";
export async function getStaffByEmail(email) {
    const [rows] = await pool.query(`
    SELECT id, full_name, email, password, created_at
    FROM staff
    WHERE email = ?
    LIMIT 1
    `, [email]);
    if (rows.length === 0)
        return null;
    const row = rows[0];
    return row;
}
