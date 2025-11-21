import { BikeStatus, Bike } from "../../Models/Bike.js";
import { pool } from "../../MySqlConfig.js";
import { MobileAppBikeDTO} from "../../DTOs/MobileApp/Response_MobileAppBikeDTO.js"
import { MobileAppBike } from "@trungthao/mobile_app_dto";
import { RowDataPacket } from "mysql2";



/**
 * Retrieves bikes, optionally filtered by hubId and/or status.
 *
 * @param hubId  optional hub ID filter
 * @param status optional bike status filter
 */
export async function getBikes(hubId?: string, status?: BikeStatus): Promise<Bike[]> {
  let sql = `
    SELECT 
      id,
      status,
      maximum_speed,
      maximum_functional_distance,
      UNIX_TIMESTAMP(purchase_date) * 1000 AS purchase_date,
      UNIX_TIMESTAMP(last_service_date) * 1000 AS last_service_date,
      current_hub
    FROM bikes
  `;

  const conditions: string[] = [];
  const params: any[] = [];

  if (hubId) {
    conditions.push("current_hub = ?");
    params.push(hubId);
  }

  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await pool.query<Bike[]>(sql, params);
  return rows;
}

export async function getMobileAppBikesByHub(
  hubId: string
): Promise<MobileAppBike[]> {
  const sql = `
    SELECT
      id,
      name,
      maximum_speed,
      maximum_functional_distance
    FROM bikes
    WHERE current_hub = ?
  `;

  const [rows] = await pool.query<(RowDataPacket & MobileAppBike)[]>(sql, [hubId]);
  return rows;
}