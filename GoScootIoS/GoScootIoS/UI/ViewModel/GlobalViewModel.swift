//
//  GlobalViewModel.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import Foundation
import Combine
import SwiftUI

enum AppScreen: String, Hashable, Codable {
    case entry
    case login
    case signUp
    case forgetPassword
    
    
}



enum SnackbarType: String {
    case success = "checkmark.circle"
    case error = "xmark.circle"
    case wait = "exclamationmark.triangle"
    case info = "info.circle"
}

extension SnackbarType {
    var color: Color {
        switch self
        {
        case .success: return Color.green
        case .error: return Color.red
        case .wait: return Color.yellow
        case .info: return Color.blue
        }
    }
}

@MainActor
class GlobalViewModel: ObservableObject {
    @Published var path = NavigationPath()
    @Published var currentScreen = AppScreen.entry
    @Published var snackbarMessage: String = ""
    @Published var snackbarIsOpen = false
    @Published var snackbarType: SnackbarType = .success
    @Published var profile: Customer? = nil
    @Published var session_id: String? = nil
    @Published var reserved_trip: Trip? = nil

    
    func logInBySessionId() async throws -> Response_LogInDTO? {
        let authenticationRepo = AuthenticationRepository()
        if let sessionId = UserDefaults.standard.string(forKey: "sessionId") {
            let resp = try await authenticationRepo.logInWithSessionId(sessionId: sessionId)
            return resp
        }
        return nil

    }
    
    func navigate(to screen: AppScreen, toReset: Bool = false) {
        if (toReset){
            path = NavigationPath()
        }
        currentScreen = screen
        path.append(screen)
    }
    
    func goBack() {
        if !path.isEmpty {
            path.removeLast()
        }
    }
    
    func reset() {
        path = NavigationPath()
    }
    
   
}
