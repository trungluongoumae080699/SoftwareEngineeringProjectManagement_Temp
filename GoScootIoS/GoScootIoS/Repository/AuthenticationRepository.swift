//
//  AuthenticationRepository.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import Foundation
class AuthenticationRepository {
    
    func signIn(
        body: Request_LogInDTO,
    ) async throws -> Response_LogInDTO {
        let apiConfig = ApiConfig(apiPath: .logIn)
        var request = apiConfig.buildRequest(params: [], sessionId: nil)
        request.httpBody = try JSONEncoder().encode(body)
        let (data, resp) = try await URLSession.shared.data(for: request)
        guard let http = resp as? HTTPURLResponse else {
            throw ApiError(message: "Vừa xảy ra lỗi. Xin vui lòng thử lại", status: -1)
        }
        if (200..<300).contains(http.statusCode) {
            return try JSONDecoder().decode(Response_LogInDTO.self, from: data)
        } else if (http.statusCode == 401 || http.statusCode == 403){
            let error = try JSONDecoder().decode(Response_FailureDTO.self, from: data)
            throw UnAuthorizedError(message: error.message, status: http.statusCode)
        }
        else {
            let error = try JSONDecoder().decode(Response_FailureDTO.self, from: data)
            throw ApiError(message: error.message, status: http.statusCode)
        }
        
    }
    
    func signUp(
        body: Request_RegistrationDTO,
    ) async throws -> Void {
        let apiConfig = ApiConfig(apiPath: .register)
        var request = apiConfig.buildRequest(params: [], sessionId: nil)
        request.httpBody = try JSONEncoder().encode(body)
        let (data, resp) = try await URLSession.shared.data(for: request)
        guard let http = resp as? HTTPURLResponse else {
            throw ApiError(message: "Vừa xảy ra lỗi. Xin vui lòng thử lại", status: -1)
        }
        if (200..<300).contains(http.statusCode) {
            return 
        } else if (http.statusCode == 401 || http.statusCode == 403){
            let error = try JSONDecoder().decode(Response_FailureDTO.self, from: data)
            throw UnAuthorizedError(message: error.message, status: http.statusCode)
        }
        else {
            let error = try JSONDecoder().decode(Response_FailureDTO.self, from: data)
            throw ApiError(message: error.message, status: http.statusCode)
        }
        
    }
    
    func logInWithSessionId(
        sessionId: String,
    ) async throws -> Response_LogInDTO {
        let apiConfig = ApiConfig(apiPath: .logInViaSession)
        let request = apiConfig.buildRequest(params: [], sessionId: sessionId)
        
        let (data, resp) = try await URLSession.shared.data(for: request)
        guard let http = resp as? HTTPURLResponse
        else {
            throw ApiError(message: "Vừa xảy ra lỗi. Xin vui lòng thử lại", status: -1)
        }
        print(http.statusCode)
        if (200..<300).contains(http.statusCode) {
            return try JSONDecoder().decode(Response_LogInDTO.self, from: data)
        }
        else if (http.statusCode == 401 || http.statusCode == 403 || http.statusCode == 409){
            let error = try JSONDecoder().decode(Response_FailureDTO.self, from: data)
            throw UnAuthorizedError(message: error.message, status: http.statusCode)
        }
        else {
            let error = try JSONDecoder().decode(Response_FailureDTO.self, from: data)
            throw ApiError(message: error.message, status: http.statusCode)
        }
        
    }
}
