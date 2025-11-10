export declare enum MobileAppBikeType {
    SCOOTER = "scooter",
    BIKE = "bike"
}
export type MobileAppBike = {
    id: string;
    bike_type: MobileAppBikeType;
    battery_status: number;
    maximum_speed: number;
    maximum_functional_distance: number;
};
