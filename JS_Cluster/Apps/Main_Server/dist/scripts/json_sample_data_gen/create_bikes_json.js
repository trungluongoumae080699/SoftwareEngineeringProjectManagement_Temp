import { promises as fs } from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
const BikeStatus = {
    IDLE: "Idle",
    RESERVED: "Reserved",
    INUSE: "Inuse"
};
const OUTPUT_DIR = "src/Assets";
const BIKE_COUNT = 1500;
/* -------------------------------------------------------------------------- */
/*                              UTIL: GENERATE ID                              */
/* -------------------------------------------------------------------------- */
function generateBikeId(existing) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (true) {
        let suffix = "";
        for (let i = 0; i < 8; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }
        const id = `BIK-${suffix}`;
        if (!existing.has(id)) {
            existing.add(id);
            return id;
        }
    }
}
/* -------------------------------------------------------------------------- */
/*                                 MAIN SCRIPT                                 */
/* -------------------------------------------------------------------------- */
export async function generateBikesJson() {
    console.log("📂 Reading hub IDs from src/Assets/hubIds.json ...");
    const hubIdsRaw = await fs.readFile(path.join(OUTPUT_DIR, "hubIds.json"), "utf8");
    const hubIds = JSON.parse(hubIdsRaw);
    if (!Array.isArray(hubIds) || hubIds.length === 0) {
        console.error("❌ hubIds.json is empty or invalid!");
        return;
    }
    console.log(`📦 Loaded ${hubIds.length} hub IDs`);
    const bikes = [];
    const idlingBikeIds = [];
    const inUsedBikeIds = [];
    const used = new Set();
    const now = Date.now();
    for (let i = 0; i < BIKE_COUNT; i++) {
        const id = generateBikeId(used);
        const status = faker.helpers.arrayElement([
            BikeStatus.IDLE,
            BikeStatus.INUSE,
        ]);
        const purchase_date = faker.number.int({
            min: now - 1000 * 60 * 60 * 24 * 365 * 2, // 2 years ago
            max: now - 1000 * 60 * 60 * 24 * 30, // 1 month ago
        });
        const last_service_date = faker.number.int({
            min: purchase_date,
            max: now,
        });
        // 70% of bikes belong to a hub, 30% no hub (null)
        const current_hub = status === BikeStatus.INUSE ? null : Math.random() < 0.7 ? faker.helpers.arrayElement(hubIds) : null;
        const createdAt = new Date(now + i * 1000);
        const bike = {
            id,
            status,
            maximum_speed: faker.number.int({ min: 20, max: 40 }),
            maximum_functional_distance: faker.number.int({ min: 10, max: 100 }),
            purchase_date,
            last_service_date,
            current_hub,
            deleted: false,
            created_at: createdAt.toISOString(),
        };
        bikes.push(bike);
        if (status === BikeStatus.IDLE) {
            idlingBikeIds.push(id);
        }
        else {
            inUsedBikeIds.push(id);
        }
    }
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(path.join(OUTPUT_DIR, "bikes.json"), JSON.stringify(bikes, null, 2));
    await fs.writeFile(path.join(OUTPUT_DIR, "inUseBikeIds.json"), JSON.stringify(inUsedBikeIds, null, 2));
    await fs.writeFile(path.join(OUTPUT_DIR, "idlingBikeIds.json"), JSON.stringify(idlingBikeIds, null, 2));
    console.log(`✅ Generated ${BIKE_COUNT} bikes → bikes.json`);
    console.log(`🔑 Bike IDs saved → bikeIds.json`);
}
/* -------------------------------------------------------------------------- */
/*                               RUN IF DIRECTLY                               */
/* -------------------------------------------------------------------------- */
generateBikesJson()
    .then(() => {
    console.log("🎉 Bike generation completed.");
    process.exit(0);
})
    .catch((err) => {
    console.error("❌ Generation failed:", err);
    process.exit(0);
});
