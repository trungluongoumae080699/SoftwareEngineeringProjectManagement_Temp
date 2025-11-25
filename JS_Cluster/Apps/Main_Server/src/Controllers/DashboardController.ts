import { CustomRequest } from "../Middlewares/Authorization.js";
import { Response } from "express";
import { redisClient } from "../RedisConfig.js";
import { fetchBikeIdsAndBatteries } from "../Repositories/RedisRepo/BikeRepo.js";
import { getBikesByFilter } from "../Repositories/MySqlRepo/BikeRepo.js";
import { TripStatus } from "@trungthao/admin_dashboard_dto";
import { getTrips } from "../Repositories/MySqlRepo/TripRepo.js";


export type TripSortField = "reservation_date" | "price";
export type SortDirection = "asc" | "desc";

export interface GetTripsOptions {
  bikeId?: string;
  status?: TripStatus;
  reservationFrom?: number; 
  reservationTo?: number;
  sortBy?: TripSortField;   
  sortDirection?: SortDirection; // default: "desc"
  page?: number;            // default: 1
  pageSize?: number;        // default: 20
}

export const fetchTripsByBike = async (
  request: CustomRequest<
    { bikeId: string }, // params
    {},                 // body
    {},                 // headers
    {
      from?: string;
      to?: string;
      status?: TripStatus;
      sortBy?: TripSortField;
      sortDirection?: SortDirection;
      page?: string;
      pageSize?: string;
    }
  >,
  response: Response
) => {
  try {
    const { bikeId } = request.params;
    if (!bikeId) {
      return response.status(400).json({ error: "bikeId path parameter is required" });
    }

    const {
      from,
      to,
      status,
      sortBy,
      sortDirection,
      page,
      pageSize,
    } = request.query;

    // Parse from/to -> numbers (BIGINT)
    let reservationFrom: number | undefined;
    let reservationTo: number | undefined;

    if (from !== undefined) {
      const n = Number(from);
      if (Number.isNaN(n)) {
        return response.status(400).json({ error: "`from` must be a number" });
      }
      reservationFrom = n;
    }

    if (to !== undefined) {
      const n = Number(to);
      if (Number.isNaN(n)) {
        return response.status(400).json({ error: "`to` must be a number" });
      }
      reservationTo = n;
    }

    const options: GetTripsOptions = {
      bikeId,
      status,
      reservationFrom,
      reservationTo,
      sortBy,
      sortDirection,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    };

    const result = await getTrips(options);

    return response.json(result);
  } catch (err) {
    console.error("fetchTripsByBike error:", err);
    return response.status(500).json({ error: "Internal server error" });
  }
};

export const fetchTelegramByBike = async (
    request: CustomRequest<{ bikeId: string }, {}, {}, {
        from?: string,
        to?: string
    }>,
    response: Response
) => {
    const bikeId = request.params
    const { from, to } = request.query;



};


export const fetchBikes = async (
    request: CustomRequest<{}, {}, {}, { battery?: string; hub?: string; page?: string }>,
    response: Response
) => {
    const { battery, hub, page } = request.query;

    const PAGE_SIZE = 10;
    const pageNum = Math.max(Number(page) || 1, 1);
    const offset = (pageNum - 1) * PAGE_SIZE;

    // ---------------------------------------------------------
    //  CASE 1: battery is NOT provided -> MySQL only
    // ---------------------------------------------------------
    if (battery === undefined) {
        const sqlResult = await getBikesByFilter({
            hubId: hub,
            limit: PAGE_SIZE,
            offset,
        });

        for (const b of sqlResult.bikes) {
            const redisKey = `bike:${b.id}:telemetry`;

            // HGETALL returns Record<string, string>
            const tele = await redisClient.hGetAll(redisKey);

            const batteryStatus = tele.battery_status
                ? Number(tele.battery_status)
                : null;
            b.battery_status = batteryStatus
        }

        return response.json(sqlResult);
    }

    // ---------------------------------------------------------
    //  CASE 2: battery IS provided -> Redis + MySQL
    // ---------------------------------------------------------
    const maxBattery = Number(battery);
    if (Number.isNaN(maxBattery)) {
        return response.status(400).json({
            error: "battery must be a number",
        });
    }

    // Step 1: fetch all bikes from Redis with battery <= maxBattery
    const redisBikes = await fetchBikeIdsAndBatteries(maxBattery);
    const ids = redisBikes.map((b) => b.id);

    if (ids.length === 0) {
        return response.json({
            bikes: [],
            page: pageNum,
            pageSize: PAGE_SIZE,
            total: 0,
            totalPages: 0,
        });
    }

    // Step 2: fetch paginated bikes from MySQL
    const sqlResult = await getBikesByFilter({
        ids,
        hubId: hub,
        limit: PAGE_SIZE,
        offset,
    });

      for (const b of sqlResult.bikes) {
            for (const ba_id of redisBikes){
                if (ba_id.id === b.id){
                    b.battery_status = ba_id.battery
                    break
                }
            }
        }

    return response.json(sqlResult);
};