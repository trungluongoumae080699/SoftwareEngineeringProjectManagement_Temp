//
//  Trip.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

enum TripStatusEnum: Codable {
        case cancelled, pending, complete, in_progress
}

struct Trip: Codable, Identifiable {
    let id: String
    let bike_id: String
    let customer_id: String
    let trip_status: TripStatusEnum
    let reservation_expiry: Int128
    let trip_start_date: Int128?
    let trip_end_date: Int128?
    let trip_start_long: Int64
    let trip_start_lat: Int64
    let trip_end_long: Int64?
    let trip_end_lat: Int64?
    let trip_secret: String?
    
    enum CodingKeys: String, CodingKey {
        case id, bike_id, customer_id, trip_status, reservation_expiry, trip_start_date, trip_end_date, trip_start_long, trip_start_lat, trip_end_long, trip_end_lat, trip_secret
    }
    
}
