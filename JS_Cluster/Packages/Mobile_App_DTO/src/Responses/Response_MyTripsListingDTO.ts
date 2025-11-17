import { MobileAppBike } from "../Models/MobileAppBike.js"
import { MobileAppBikeHub } from "../Models/MobileAppBikeHub.js"
import { MobileAppTrip } from "../Models/MobileAppTrip.js"

export type Response_TripDTO = {
    trip: MobileAppTrip,
    bike: MobileAppBike,
    hub: MobileAppBikeHub
}
export type Response_MyTripsListingDTO = {
    trips: Response_TripDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}