import { CustomRequest } from "../Middlewares/Authorization.js";
import { Response } from "express";
import { redisClient } from "../RedisConfig.js";
import { fetchBikeIdsAndBatteries } from "../Repositories/RedisRepo/BikeRepo.js";
import { getBikesByFilter } from "../Repositories/MySqlRepo/BikeRepo.js";

export const fetchTripsByBike = async (
    request: CustomRequest<{ bikeId: string }, {}, {}, {
        from?: string,
        to?: string
    }>,
    response: Response
) => {
    const bikeId = request.params
    const { from, to } = request.query;



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

    return response.json(sqlResult);
};