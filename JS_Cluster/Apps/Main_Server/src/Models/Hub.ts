import { RowDataPacket } from "mysql2";

export interface Hub extends RowDataPacket {
    id: string,
    longitude: number,
    latitude: number,
    address: string,
    deleted: boolean,
    last_modification_date: number,
    created_at: Date,
}

export type HubSeed = {
    id: string,
    longitude: number,
    latitude: number,
    address: string,
    deleted: boolean,
    last_modification_date: number,
    created_at: Date,
}