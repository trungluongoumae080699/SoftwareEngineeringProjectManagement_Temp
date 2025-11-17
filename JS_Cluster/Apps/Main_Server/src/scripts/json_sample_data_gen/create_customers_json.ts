import { promises as fs } from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

export interface CustomerSeed {
  id: string;
  full_name: string;
  phone_number: string;
  password: string;    // plain text
  created_at: string;  // ISO date string
}

const OUTPUT_DIR = "src/Assets";
const CUSTOMER_COUNT = 1000;

/* -------------------------------------------------------------------------- */
/*                            GENERATE VIETNAMESE NAME                         */
/* -------------------------------------------------------------------------- */

function generateVietnameseName(): string {
  const lastNames = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng",
    "Huỳnh", "Phan", "Vũ", "Võ", "Đặng"
  ];

  const middleNames = [
    "Văn", "Thị", "Hữu", "Minh", "Ngọc",
    "Thanh", "Quốc", "Tuấn", "Thế", "Gia"
  ];

  const firstNames = [
    "Nam", "Hùng", "Hưng", "Dũng", "Long",
    "Anh", "Tuấn", "Trang", "Hà", "Nhi",
    "Thảo", "Vy", "Quỳnh", "Khanh", "Khánh"
  ];

  return (
    faker.helpers.arrayElement(lastNames) +
    " " +
    faker.helpers.arrayElement(middleNames) +
    " " +
    faker.helpers.arrayElement(firstNames)
  );
}

/* -------------------------------------------------------------------------- */
/*                            GENERATE VIETNAMESE PHONE                        */
/* -------------------------------------------------------------------------- */

function generateVietnamesePhone(): string {
  const prefixes = ["090", "093", "096", "097", "098", "091", "094", "038", "039", "088", "089"];
  const prefix = faker.helpers.arrayElement(prefixes);
  const number = faker.string.numeric(7);
  return prefix + number;
}

/* -------------------------------------------------------------------------- */
/*                              GENERATE ID (UUID)                             */
/* -------------------------------------------------------------------------- */

function generateId(existing: Set<string>): string {
  const id = faker.string.uuid();
  if (!existing.has(id)) {
    existing.add(id);
    return id;
  }
  return generateId(existing);
}

/* -------------------------------------------------------------------------- */
/*                                MAIN GENERATOR                               */
/* -------------------------------------------------------------------------- */

export async function generateCustomersJson() {
  console.log("👤 Generating customer data...");

  const customers: CustomerSeed[] = [];
  const customerIds: string[] = [];

  const usedIds = new Set<string>();
  const now = Date.now();

  for (let i = 0; i < CUSTOMER_COUNT; i++) {
    const id = generateId(usedIds);

    const full_name = generateVietnameseName();
    const phone_number = generateVietnamesePhone();

    const createdAt = new Date(now + i * 250);

    const customer: CustomerSeed = {
      id,
      full_name,
      phone_number,
      password: "Password123!", // plain text
      created_at: createdAt.toISOString(),
    };

    customers.push(customer);
    customerIds.push(id);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  await fs.writeFile(
    path.join(OUTPUT_DIR, "customers.json"),
    JSON.stringify(customers, null, 2)
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, "customerIds.json"),
    JSON.stringify(customerIds, null, 2)
  );

  console.log(`✅ Generated ${CUSTOMER_COUNT} customers → customers.json`);
}

/* -------------------------------------------------------------------------- */
/*                            RUN IF CALLED DIRECTLY                           */
/* -------------------------------------------------------------------------- */

generateCustomersJson()
  .then(() => {
    console.log("🎉 Customer generation completed.")
    process.exit(0)
})
  .catch((err) => {
    console.error("❌ Customer generation failed:", err)
    process.exit(0)
});