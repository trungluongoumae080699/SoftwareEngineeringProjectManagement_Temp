//
//  InputField.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI

struct ValidationResult {
    let message: String
    let isValid: Bool
}

struct InputField: View {
    @Binding var text: String
    var placeHolder: String
    var label: String?
    var icon: String?
    var needSProtection: Bool = false
    var isRequired: Bool = false
    var onChangeText: (() -> ValidationResult)?

    @State private var validationMessage: String = ""
    @State private var isSecureVisible: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {

            // Label
            if let fieldLabel = label {
                HStack(spacing: 2) {
                    Text(fieldLabel)
                        .font(.brand(14, weight: "Bold"))
                        .foregroundColor(.black)

                    if isRequired {
                        Text("*")
                            .font(.brand(14, weight: "Bold"))
                            .foregroundColor(Color("Brand_Primary"))
                    }
                }
            }

            // Input field
            HStack {
                // Icon (if provided)
                if let fieldIcon = icon {
                    Image(systemName: fieldIcon)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 18, height: 18)
                        .foregroundColor(Color("Text_Sub"))
                    Spacer().frame(width: 10)
                }

                // Secure or normal text input
                if needSProtection {
                    if isSecureVisible {
                        TextField("", text: $text, prompt: Text(placeHolder).font(.brand(14, weight: "Regular")).foregroundColor(Color("Text_Sub"))).onChange(of: text) { oldValue, newValue in
                            if let validate = onChangeText {
                                let result = validate()
                                validationMessage = result.isValid ? "" : result.message
                            }
                           
                        }.font(.brand(14, weight: "Regular"))
                    } else {
                        SecureField("", text: $text, prompt: Text(placeHolder).font(.brand(14, weight: "Regular")).foregroundColor(Color("Text_Sub"))).onChange(of: text) { oldValue, newValue in
                            if let validate = onChangeText {
                                let result = validate()
                                validationMessage = result.isValid ? "" : result.message
                            }
                           
                        }.font(.brand(14, weight: "Regular"))
                    }

                    Button {
                        isSecureVisible.toggle()
                    } label: {
                        Image(systemName: isSecureVisible ? "eye.slash.fill" : "eye.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 18, height: 18)
                            .foregroundColor(Color("Text_Sub"))
                            
                    }
                } else {
                    TextField("", text: $text, prompt: Text(placeHolder).font(.brand(14, weight: "Regular")).foregroundColor(Color("Text_Sub")))
                        .onChange(of: text) { oldValue, newValue in
                            if let validate = onChangeText {
                                let result = validate()
                                validationMessage = result.isValid ? "" : result.message
                            }
                           
                        }.font(.brand(14, weight: "Regular"))
                }
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 15)
            .background(RoundedRectangle(cornerRadius: 30).fill(Color.white))
            .cornerRadius(8)


            // Validation message
            if !validationMessage.isEmpty {
                Text(validationMessage)
                    .font(.brand(14, weight: "Regular"))
                    .foregroundColor(.red)
                    .padding(.horizontal, 4)
                Spacer().frame(height: 5)
            }
        }
    }
}
