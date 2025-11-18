import { pool } from "../../MySqlConfig.js";
export async function getMyTrips(customer_id, page) {
    const LIMIT = 10;
    const offset = (page - 1) * LIMIT;
    // 1. Count total trips
    const [countRows] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM trips
        WHERE customer_id = ?
          AND deleted = 0
        `, [customer_id]);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / LIMIT);
    // 2. Fetch page data (same query as before)
    const [rows] = await pool.query(`
        SELECT
            t.id,
            t.bike_id,
            t.hub_id,
            t.customer_id,
            t.trip_status,
            t.reservation_expiry,
            t.reservation_date,
            t.trip_start_date,
            t.trip_end_date,
            t.trip_end_long,
            t.trip_end_lat,
            t.trip_secret,
            t.isPaid,
            t.price,

            b.id AS bike_id2,
            b.name,
            b.maximum_speed,
            b.maximum_functional_distance,

            h.id AS hub_id,
            h.longitude,
            h.latitude,
            h.address

        FROM trips t
        JOIN bikes b ON t.bike_id = b.id
        JOIN hubs h ON t.hub_id = h.id

        WHERE t.customer_id = ?
          AND t.deleted = 0

        ORDER BY t.reservation_date DESC
        LIMIT ? OFFSET ?
        `, [customer_id, LIMIT, offset]);
    const trips = rows.map(r => ({
        trip: {
            id: r.id,
            bike_id: r.bike_id,
            hub_id: r.hub_id,
            customer_id: r.customer_id,
            trip_status: r.trip_status,
            reservation_date: Number(r.reservation_date),
            reservation_expiry: Number(r.reservation_expiry),
            trip_start_date: r.trip_start_date ? Number(r.trip_start_date) : undefined,
            trip_end_date: r.trip_end_date ? Number(r.trip_end_date) : undefined,
            trip_end_long: r.trip_end_long ?? undefined,
            trip_end_lat: r.trip_end_lat ?? undefined,
            trip_secret: r.trip_secret ?? undefined,
            isPaid: r.isPaid === 0 ? false : true,
            price: r.price ?? undefined
        },
        bike: {
            id: r.bike_id2,
            name: r.name,
            maximum_speed: r.maximum_speed,
            maximum_functional_distance: r.maximum_functional_distance,
        },
        hub: {
            id: r.hub_id,
            longitude: r.longitude,
            latitude: r.latitude,
            address: r.address
        },
    }));
    return {
        trips,
        total,
        page,
        pageSize: LIMIT,
        totalPages,
    };
}
export async function reserveBikeForCustomer(customerId, bikeId, reservation_expiry, trip_secret, hubLong, hubLat) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query("CALL CreateTripReservation(?, ?, ?, ?)", [customerId, bikeId, hubLong, hubLat]);
        console.log("✅ Trip reservation successful:", rows);
        return rows;
    }
    catch (err) {
        if (err.errno === 1644) {
            // SQLSTATE '45000' from SIGNAL in the procedure
            console.error("🚫 Customer already has a pending reservation");
        }
        else {
            console.error("❌ Error during trip reservation:", err);
        }
        throw err;
    }
    finally {
        conn.release();
    }
}
export async function getTrips(customerId) {
    const [rows] = await pool.query(`
    SELECT
      id,
      bike_id,
      customer_id,
      trip_status,
      UNIX_TIMESTAMP(reservation_expiry) * 1000 AS reservation_expiry,
      UNIX_TIMESTAMP(trip_start_date) * 1000 AS trip_start_date,
      UNIX_TIMESTAMP(trip_end_date) * 1000 AS trip_end_date,
      trip_start_long,
      trip_start_lat,
      trip_end_long,
      trip_end_lat
    FROM trips
    WHERE (? IS NULL OR customer_id = ?)
    ORDER BY trip_start_date DESC
    `, [customerId ?? null, customerId ?? null]);
    return rows;
}
/**
 * Fetch the pending trip for a given customer (if any).
 *
 * @param customerId - The customer's UUID
 * @returns The Trip record or null if none pending
 */
export async function getPendingTripByCustomerId(customerId) {
    const [rows] = await pool.query(`
    SELECT
      id,
      bike_id,
      customer_id,
      trip_status,
      UNIX_TIMESTAMP(reservation_expiry) * 1000 AS reservation_expiry,
      UNIX_TIMESTAMP(trip_start_date) * 1000 AS trip_start_date,
      UNIX_TIMESTAMP(trip_end_date) * 1000 AS trip_end_date,
      trip_start_long,
      trip_start_lat,
      trip_end_long,
      trip_end_lat,
      trip_secret
    FROM trips
    WHERE customer_id = ?
      AND trip_status = 'pending'
    LIMIT 1
    `, [customerId]);
    return rows.length > 0 ? rows[0] : null;
}
