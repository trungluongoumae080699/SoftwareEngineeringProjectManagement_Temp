import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";

export type HubSeed = {
    id: string,
    longitude: number,
    latitude: number,
    address: string,
    deleted: boolean,
    last_modification_date: number,
    created_at: Date,
}

// Rough center of Ho Chi Minh City
const BASE_LAT = 10.776889;
const BASE_LNG = 106.700981;

// ~1km spacing
const LAT_STEP = 0.01;
const LNG_STEP = 0.01;

// HCMC district list for realism
const HCM_DISTRICTS = [
    "District 1", "District 2", "District 3", "District 4", "District 5",
    "District 6", "District 7", "District 8", "District 10", "District 11",
    "District 12", "Binh Thanh District", "Go Vap District", "Phu Nhuan District",
    "Tan Binh District", "Tan Phu District", "Binh Tan District",
    "Thu Duc City", "Nha Be District", "Binh Chanh District"
];

function generateHubId(existing: Set<string>): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (true) {
        let suffix = "";
        for (let i = 0; i < 8; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }
        const id = `HUB-${suffix}`;
        if (!existing.has(id)) {
            existing.add(id);
            return id;
        }
    }
}

// Generate a realistic HCMC address
function generateHcmAddress(index: number): string {
    const street = faker.location.street();
    const houseNumber = faker.number.int({ min: 1, max: 500 });
    const district = faker.helpers.arrayElement(HCM_DISTRICTS);

    return `${houseNumber} ${street}, ${district}, Ho Chi Minh City`;
}

/**
 * Generate 300 hubs with real-like HCMC addresses and save to hubs.json
 */
async function generateHubsJson() {
    console.log("Start Generating sample hubs...")
    const hubs: HubSeed[] = [];
    const hubIds: string[] = []
    const usedIds = new Set<string>();
    const now = Date.now();

    const rows = 20;
    const cols = 15;
    let count = 0;

    for (let r = 0; r < rows && count < 300; r++) {
        for (let c = 0; c < cols && count < 300; c++) {
            const id = generateHubId(usedIds);

            const latOffset = (r - rows / 2) * LAT_STEP;
            const lngOffset = (c - cols / 2) * LNG_STEP;

            const latitude = BASE_LAT + latOffset;
            const longitude = BASE_LNG + lngOffset;

            const createdAt = new Date(now + count * 500);

            const hub: HubSeed = {
                id,
                longitude,
                latitude,
                address: generateHcmAddress(count),
                deleted: false,
                last_modification_date: createdAt.getTime(),
                created_at: createdAt
            };

            hubs.push(hub);
            hubIds.push(id)
            count++;
        }
    }

    const serializable = hubs.map(h => ({
        ...h,
        created_at: h.created_at.toISOString()
    }));

      

await fs.writeFile("src/Assets/hubs.json", JSON.stringify(serializable, null, 2));
await fs.writeFile("src/Assets/hubIds.json", JSON.stringify(hubIds, null, 2));
    console.log("✅ Generated 300 HCMC hubs with faker addresses → hubs.json");
}

generateHubsJson()