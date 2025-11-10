//
//  Request_RegistrationDTO.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

struct Request_RegistrationDTO: Encodable {
    let full_name: String
    let password: String
    let phone_number: String
}
