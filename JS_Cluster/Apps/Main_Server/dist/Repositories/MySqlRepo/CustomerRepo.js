import { pool } from "../../MySqlConfig.js";
/**
 * Retrieves a customer by ID.
 * Returns `null` if no customer is found.
 */
export async function getCustomerById(id) {
    const [rows] = await pool.query(`
    SELECT id, full_name, phone_number, password, created_at
    FROM customers
    WHERE id = ?
    LIMIT 1
    `, [id]);
    if (rows.length === 0)
        return null;
    return rows[0];
}
/**
 * Retrieves a customer by phone number.
 * Returns `null` if no customer is found.
 */
export async function getCustomerByPhoneNumber(phoneNumber) {
    const [rows] = await pool.query(`
    SELECT id, full_name, phone_number, password, created_at
    FROM customers
    WHERE phone_number = ?
    LIMIT 1
    `, [phoneNumber]);
    if (rows.length === 0)
        return null;
    const row = rows[0];
    return row;
}
/**
 * Inserts a new customer record.
 * Returns the generated customer ID.
 */
export async function insertCustomer(id, fullName, phoneNumber, password) {
    const [result] = await pool.query(`
    INSERT INTO customers (id, full_name, phone_number, password)
    VALUES (?, ?, ?, ?)
    `, [id, fullName, phoneNumber, password]);
    if (result.affectedRows === 0) {
        throw new Error("Failed to insert new customer");
    }
    return id;
}
