//
//  RegistrationScreenViewModel.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI
import Combine
import Foundation

@MainActor
class RegistrationScreenViewModel: ObservableObject {
    @Published var phone_number: String = ""
    @Published var password: String = ""
    @Published var confirm_password: String = ""
    @Published var full_name: String = ""
    @Published var sendRequest: Bool = false
    
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
    
    // MARK: - Phone Number Validation
    func validatePhoneNumber() -> ValidationResult {
        // Vietnamese phone number pattern: starts with 0, followed by 9-10 digits
        let regex = "^0[0-9]{9,10}$"
        let predicate = NSPredicate(format: "SELF MATCHES %@", regex)
        
        if phone_number.isEmpty {
            return ValidationResult(message: "", isValid: false)
        } else if !predicate.evaluate(with: phone_number) {
            return ValidationResult(message: "Số điện thoại không hợp lệ", isValid: false)
        } else {
            return ValidationResult(message: "", isValid: true)
        }
    }
    
    // MARK: - Full Name Validation
    func validateFullName() -> ValidationResult {
        if full_name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return ValidationResult(message: "", isValid: false)
        } else if full_name.split(separator: " ").count < 2 {
            return ValidationResult(message: "Vui lòng nhập đầy đủ họ và tên.", isValid: false)
        } else {
            return ValidationResult(message: "", isValid: true)
        }
    }
    
    func isFormValid() -> Bool {
        let passwordValid = validatePassword().isValid
        let confirmPasswordValid = validateConfirmPassword().isValid
        let phoneValid = validatePhoneNumber().isValid
        let fullNameValid = validateFullName().isValid
        
        return passwordValid && confirmPasswordValid && phoneValid && fullNameValid
    }
    
    func signUp() async throws -> Void {
        let authenticationRepository = AuthenticationRepository()
        let requestBody: Request_RegistrationDTO = Request_RegistrationDTO(full_name: full_name, password: password, phone_number: phone_number)
        //requestBody.fcm = fcmToken
        try await authenticationRepository.signUp(body: requestBody)
    }
}
