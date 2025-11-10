//
//  ForgetPasswordViewModel.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI
import Combine
import Foundation

@MainActor
class ForgetPasswordViewModel: ObservableObject {
    @Published var phone_number: String = ""
    @Published var password: String = ""
    @Published var confirm_password: String = ""

    
    // MARK: - Password Validation
    func validatePassword() -> ValidationResult {
        // At least 8 chars, one uppercase, one non-alphanumeric
        let regex = "^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$"
        let predicate = NSPredicate(format: "SELF MATCHES %@", regex)
        
        if password.isEmpty {
            return ValidationResult(message: "", isValid: false)
        } else if !predicate.evaluate(with: password) {
            return ValidationResult(
                message: "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt.",
                isValid: false
            )
        } else {
            return ValidationResult(message: "", isValid: true)
        }
    }
    
    // MARK: - Confirm Password Validation
    func validateConfirmPassword() -> ValidationResult {
        if confirm_password.isEmpty {
            return ValidationResult(message: "", isValid: false)
        } else if confirm_password != password {
            return ValidationResult(message: "Mật khẩu xác nhận không khớp.", isValid: false)
        } else {
            return ValidationResult(message: "", isValid: true)
        }
    }
    
    
    func isFormValid() -> Bool {
        let passwordValid = validatePassword().isValid
        let confirmPasswordValid = validateConfirmPassword().isValid
        
        
        return phone_number.isEmpty == false && passwordValid && confirmPasswordValid
    }
}
