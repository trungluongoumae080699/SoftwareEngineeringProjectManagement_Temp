//
//  Customer.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

struct Customer: Codable  {
    let id: String
    let full_name: String
    let phone_number: String
    
    enum CodingKeys: String, CodingKey {
        case id, full_name, phone_number
    }
}
