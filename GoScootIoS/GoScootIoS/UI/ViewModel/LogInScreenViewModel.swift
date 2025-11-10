//
//  LogInScreenViewModel.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//
import Foundation
import Combine

@MainActor
class LogInScreenViewModel: ObservableObject {
    @Published var phone_number: String = ""
    @Published var password: String = ""
    @Published var sendRequest: Bool = false
    
    // MARK: - Overall Form Validation
    func isFormValid() -> Bool {
        return !phone_number.isEmpty && !password.isEmpty
    }
    
    func logIn() async throws -> Response_LogInDTO {
        // Step 1: Delete old token
        /*
         try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
         Messaging.messaging().deleteToken { error in
         if let error = error {
         continuation.resume(throwing: error)
         } else {
         print("🗑️ Old FCM token deleted successfully")
         continuation.resume()
         }
         }
         }
         
         // Step 2: Get new token
         
         let fcmToken = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<String, Error>) in
         Messaging.messaging().token { newToken, error in
         if let error = error {
         continuation.resume(throwing: error)
         } else if let newToken = newToken {
         continuation.resume(returning: newToken)
         } else {
         continuation.resume(throwing: NSError(domain: "FCM", code: -1, userInfo: [NSLocalizedDescriptionKey: "No FCM token returned"]))
         }
         }
         }
         */
        
        let authenticationRepository = AuthenticationRepository()
        let requestBody: Request_LogInDTO = Request_LogInDTO(phone_number: phone_number, password: password)
        //requestBody.fcm = fcmToken
        let result = try await authenticationRepository.signIn(body: requestBody)
        return result
        
    }
    
}
