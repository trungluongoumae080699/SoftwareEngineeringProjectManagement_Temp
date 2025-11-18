import { promises as fs } from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
const OUTPUT_DIR = "src/Assets";
const TRIP_COUNT = 15000;
/* -------------------------------------------------------------------------- */
/*                            Local Trip Status Type                           */
/* -------------------------------------------------------------------------- */
const TripStatusConst = {
    CANCELLED: "cancelled",
    PENDING: "pending",
    COMPLETE: "complete",
    IN_PROGRESS: "in progress",
};
/* -------------------------------------------------------------------------- */
/*                                Helper utils                                 */
/* -------------------------------------------------------------------------- */
async function readJson(filePath) {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
}
// Generate TRI-******** (12 chars)
function generateTripId(existing) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (true) {
        let suffix = "";
        for (let i = 0; i < 8; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }
        const id = `TRI-${suffix}`;
        if (!existing.has(id)) {
            existing.add(id);
            return id;
        }
    }
}
/* -------------------------------------------------------------------------- */
/*                              Main generator                                 */
/* -------------------------------------------------------------------------- */
export async function generateTripsJson() {
    console.log("📂 Reading source data for trips...");
    const idlingBikeIdsPath = path.join(OUTPUT_DIR, "idlingBikeIds.json");
    const inUseBikeIdsPath = path.join(OUTPUT_DIR, "inUseBikeIds.json");
    const hubIdsPath = path.join(OUTPUT_DIR, "hubIds.json");
    const hubsFullPath = path.join(OUTPUT_DIR, "hubs.json");
    const customerIdsPath = path.join(OUTPUT_DIR, "customerIds.json");
    const [idlingBikeIds, inUseBikeIds, hubIds, hubsFull, customerIds,] = await Promise.all([
        readJson(idlingBikeIdsPath),
        readJson(inUseBikeIdsPath),
        readJson(hubIdsPath),
        readJson(hubsFullPath),
        readJson(customerIdsPath),
    ]);
    const allBikeIds = [...idlingBikeIds, ...inUseBikeIds];
    if (!Array.isArray(allBikeIds) || allBikeIds.length === 0) {
        throw new Error("No bike IDs found in idlingBikeIds.json + inUseBikeIds.json");
    }
    if (!Array.isArray(customerIds) || customerIds.length === 0) {
        throw new Error("No customer IDs found in customerIds.json");
    }
    if (!Array.isArray(hubIds) || hubIds.length === 0) {
        throw new Error("No hub IDs found in hubIds.json");
    }
    if (!Array.isArray(hubsFull) || hubsFull.length === 0) {
        throw new Error("No hub data found in hubs.json");
    }
    // Build hub map: hub_id -> { lng, lat }
    const hubMap = new Map();
    for (const hub of hubsFull) {
        if (hub &&
            typeof hub.id === "string" &&
            typeof hub.longitude === "number" &&
            typeof hub.latitude === "number") {
            hubMap.set(hub.id, { lng: hub.longitude, lat: hub.latitude });
        }
    }
    if (hubMap.size === 0) {
        throw new Error("No valid hubs with coordinates in hubs.json (expect objects with id, longitude, latitude)");
    }
    console.log(`✅ Loaded ${allBikeIds.length} bikes, ${customerIds.length} customers, ${hubIds.length} hub IDs (${hubMap.size} with coordinates)`);
    const trips = [];
    const usedTripIds = new Set();
    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    for (let i = 0; i < TRIP_COUNT; i++) {
        const id = generateTripId(usedTripIds);
        const bike_id = faker.helpers.arrayElement(allBikeIds);
        const customer_id = faker.helpers.arrayElement(customerIds);
        const hub_id = faker.helpers.arrayElement(hubIds);
        const hubGeo = hubMap.get(hub_id);
        if (!hubGeo) {
            // hub ID exists in hubIds.json but not in hubs.json → skip this trip
            i--;
            continue;
        }
        // Generate a realistic timeline within last 30 days
        const tripEnd = now - faker.number.int({ min: 0, max: THIRTY_DAYS_MS });
        const tripDurationMs = faker.number.int({
            min: 5 * 60 * 1000, // 5 minutes
            max: 60 * 60 * 1000, // 60 minutes
        });
        const tripStart = tripEnd - tripDurationMs;
        const reservationLeadMs = faker.number.int({
            min: 5 * 60 * 1000, // 5 minutes
            max: 30 * 60 * 1000, // 30 minutes
        });
        const reservation_date = tripStart - reservationLeadMs;
        const reservation_expiry = reservation_date + 15 * 60 * 1000; // 15 minutes after reservation
        // End coordinates: hub location + small random offset
        const offsetLng = faker.number.float({ min: -0.002, max: 0.002 });
        const offsetLat = faker.number.float({ min: -0.002, max: 0.002 });
        const trip_end_long = hubGeo.lng + offsetLng;
        const trip_end_lat = hubGeo.lat + offsetLat;
        const trip = {
            id,
            bike_id,
            customer_id,
            hub_id,
            trip_status: TripStatusConst.COMPLETE, // all complete
            reservation_date,
            reservation_expiry,
            trip_start_date: tripStart,
            trip_end_date: tripEnd,
            trip_end_long,
            trip_end_lat,
            trip_secret: null,
        };
        trips.push(trip);
    }
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const tripsPath = path.join(OUTPUT_DIR, "trips.json");
    await fs.writeFile(tripsPath, JSON.stringify(trips, null, 2));
    console.log(`✅ Generated ${TRIP_COUNT} trips → ${tripsPath}`);
}
/* -------------------------------------------------------------------------- */
/*                          Run if executed directly                           */
/* -------------------------------------------------------------------------- */
generateTripsJson()
    .then(() => console.log("🎉 Trip generation completed."))
    .catch((err) => console.error("❌ Trip generation failed:", err));
