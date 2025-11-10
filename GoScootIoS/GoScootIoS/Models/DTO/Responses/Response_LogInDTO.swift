//
//  Response_LogInDTO.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

struct Response_LogInDTO: Decodable {
    let user_profile: Customer
    let session_id: String
    
    enum CodingKeys: String, CodingKey {
        case user_profile, session_id
    }
}
