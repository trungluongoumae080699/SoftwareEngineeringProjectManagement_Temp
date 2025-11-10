//
//  Bike.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

enum BikeType: Codable {
    case scooter, bike
}

struct Bike: Codable, Identifiable {
    let id: String
    let name: String
    let battery_status: Int32
    let maximum_speed: Int32
    let maximum_functional_distance: Int32
    
    enum CodingKeys: String, CodingKey {
        case id, name, battery_status, maximum_speed, maximum_functional_distance
    }
}

