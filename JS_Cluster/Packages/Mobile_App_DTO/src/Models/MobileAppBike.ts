import * as z from "zod";

export enum MobileAppBikeType {
    SCOOTER = "scooter",
    BIKE = "bike"
}

export type MobileAppBike = {
    id: string,
    name: string,
    battery_status?: number | null,
    maximum_speed: number,
    maximum_functional_distance: number
}