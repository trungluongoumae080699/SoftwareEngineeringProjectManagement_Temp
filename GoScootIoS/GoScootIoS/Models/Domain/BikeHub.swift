//
//  BikeHub.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

struct BikeHub: Codable, Identifiable {
    let id: String
    let longitude: String
    let latitude: String
    
    enum CodingKeys: String, CodingKey {
        case id, longitude, latitude
    }
}
