//
//  ApiConfig.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import Foundation

enum HttpMethod: String {
    case GET, POST, PUT, DELETE
}

enum RequestContentType: String {
    case rawJSON = "application/json"
    case multipartFormData = "multipart/form-data"
}


enum API: String {
    case logIn = "/auth/signIn"
    case logInViaSession = "/auth/signIn/session"
    case register = "/auth/signUp"
    
    
    
    
    
    func getMethod() -> HttpMethod {
        switch self {
        case .logIn: return .POST
        case .logInViaSession: return .GET
        case .register: return .POST
            
            
        }
    }
    
}

struct ApiError: Error {
    let message: String
    let status: Int // or use a custom enum if you have one
}

struct UnAuthorizedError: Error {
    let message: String
    let status: Int
}

struct FrontEndError: Error {
    /// Detailed message shown to the user.
    let message: String
    
    init(message: String) {
        self.message = message
    }
    
}

struct ApiConfig {
    var baseUrl: String = "https://still-simply-katydid.ngrok.app/app"
    var apiPath: API
    
    init(apiPath: API) {
        self.apiPath = apiPath
    }
    
    func buildRequest(
        params: [String],
        queries: String? = nil,
        contentType: RequestContentType = .rawJSON,
        sessionId: String?
    ) -> URLRequest {
        print("SessionID \(sessionId ?? "nil")")
        var stringUrl = self.baseUrl + self.apiPath.rawValue
        for param in params {
            stringUrl = stringUrl + "/\(param)"
        }
        if let queries = queries {
            stringUrl = stringUrl + "?" + queries
        }
        let url = URL(string: stringUrl)
        var request = URLRequest(url: url!)
        request.httpMethod = self.apiPath.getMethod().rawValue
        request.setValue(contentType.rawValue, forHTTPHeaderField: "Content-Type")
        if let sessionId = sessionId {
            request.setValue(sessionId, forHTTPHeaderField: "authorization")
        }
        
        return request
    }
    
}
