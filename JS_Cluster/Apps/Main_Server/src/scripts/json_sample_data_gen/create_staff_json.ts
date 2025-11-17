import { promises as fs } from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

export interface StaffSeed {
  id: string;
  full_name: string;
  email: string;
  password: string; // plain text
  created_at: string;
}

const OUTPUT_DIR = "src/Assets";
const STAFF_COUNT = 20;

function generateStaffId(existing: Set<string>): string {
  const id = faker.string.uuid();
  if (!existing.has(id)) {
    existing.add(id);
    return id;
  }
  return generateStaffId(existing);
}

export async function generateStaffJson() {
  console.log("👥 Generating staff data (plain text passwords)...");

  const staffList: StaffSeed[] = [];
  const staffIds: string[] = [];

  const usedIds = new Set<string>();
  const now = Date.now();

  for (let i = 0; i < STAFF_COUNT; i++) {
    const id = generateStaffId(usedIds);
    staffIds.push(id);

    const full_name = faker.person.fullName();
    const email = faker.internet.email({
      firstName: full_name.split(" ")[0],
      lastName: full_name.split(" ").slice(-1)[0]
    });

    const createdAt = new Date(now + i * 500);

    const staff: StaffSeed = {
      id,
      full_name,
      email,
      password: "Password123!", // 🔥 PLAIN TEXT
      created_at: createdAt.toISOString()
    };

    staffList.push(staff);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  await fs.writeFile(
    path.join(OUTPUT_DIR, "staff.json"),
    JSON.stringify(staffList, null, 2)
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, "staffIds.json"),
    JSON.stringify(staffIds, null, 2)
  );

  console.log(`✅ Generated ${STAFF_COUNT} staff → staff.json`);
}

generateStaffJson()
  .then(() => {
    console.log("🎉 Staff generation completed.")
    process.exit(0)
})
  .catch((err) => {
    console.error("❌ Staff generation failed:", err)
    process.exit(0)
});