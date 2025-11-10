//
//  Response_FailureDTO.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

struct Response_FailureDTO: Codable {
    var message: String
    
    enum CodingKeys: String, CodingKey {
        case message
    }
}
