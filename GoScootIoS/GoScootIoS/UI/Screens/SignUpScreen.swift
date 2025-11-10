//
//  SignUpScreen.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI

struct SignUpScreen: View {
    @StateObject var registrationVm: RegistrationScreenViewModel = RegistrationScreenViewModel()
    @EnvironmentObject var globalViewModel: GlobalViewModel
    
    var body: some View {
        VStack{
            VStack{
                Image("app_logo")
                Text("Chào Mừng Bạn Đến Với GoScoot!")
                    .foregroundColor(Color("Brand_Primary"))
                    .font(.brand(24, weight: "Bold"))
                    .multilineTextAlignment(TextAlignment.center)
                Spacer().frame(height: 10)
                InputField(
                    text: $registrationVm.full_name,
                    placeHolder: "Họ và tên của bạn",
                    label: "Họ Và Tên",
                    icon: "person.fill",
                    isRequired: true,
                    onChangeText: registrationVm.validateFullName
                )
                InputField(
                    text: $registrationVm.phone_number,
                    placeHolder: "Số điệnt thoại của bạn",
                    label: "Số Điện Thoại",
                    icon: "phone.fill",
                    isRequired: true,
                    onChangeText: registrationVm.validatePhoneNumber
                )
                InputField(
                    text: $registrationVm.password,
                    placeHolder: "Mật khẩu của bạn",
                    label: "Mật Khẩu",
                    icon: "key.fill",
                    isRequired: true,
                    onChangeText: registrationVm.validatePassword
                    
                )
                InputField(
                    text: $registrationVm.confirm_password,
                    placeHolder: "Nhập lại mật khẩu của bạn",
                    label: "Xác Nhận Mật Khẩu",
                    icon: "key.fill",
                    isRequired: true,
                    onChangeText: registrationVm.validateConfirmPassword
                    
                )
                Spacer().frame(height: 20)

                Button("Đăng Ký") { }
                .buttonStyle(
                    BrandButtonStyle(
                        normalColor: Color("Brand_Primary"),
                        pressedColor: Color("Brand_Primary").opacity(0.6),
                        disabledColor: Color("Brand_Primary").opacity(0.6),
                        textColor: Color.white,
                        pressedTextColor: Color("Brand_Primary").opacity(0.6),
                        disabledTextColor: Color.white,
                        height: 40
                    )
                ).frame(maxWidth: .infinity).disabled(!registrationVm.isFormValid())
                
                HStack(spacing: 2) {
                    Text("Đã Có Tài Khoản? ")
                    Button("Đăng Nhập") {
                        globalViewModel.goBack()
                    }
                    .buttonStyle(
                        BrandButtonStyle(
                            normalColor: .clear,
                            pressedColor: .clear,
                            disabledColor: .clear,
                            textColor: Color("Brand_Primary"),
                            pressedTextColor: Color("Brand_Primary").opacity(0.2),
                            alignment: .trailing,
                            isHyperLink: true
                        )
                    ).font(.brand(14, weight: "SemiBold"))
                    
                }
                
            }.frame(width: 320)
           
        }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center).background{
            Image("login-signup-bg").resizable().ignoresSafeArea()
        }.navigationBarBackButtonHidden(true).font(.brand(14, weight: "Regular")).onChange(of: registrationVm.sendRequest){
            if (registrationVm.sendRequest){
                Task {
                    defer {
                        registrationVm.sendRequest = false
                        
                    }
                    do {
                        try await registrationVm.signUp()
                        globalViewModel.snackbarIsOpen.toggle()
                        globalViewModel.snackbarMessage = "Đăng nhập thành công"
                        globalViewModel.snackbarType = .success
                        globalViewModel.goBack()
                        
                    } catch let error as ApiError {
                        globalViewModel.snackbarIsOpen.toggle()
                        globalViewModel.snackbarMessage = error.message
                        globalViewModel.snackbarType = .error
                    } catch let error as UnAuthorizedError {
                        globalViewModel.snackbarIsOpen.toggle()
                        globalViewModel.snackbarMessage = error.message
                        globalViewModel.snackbarType = .error
                        globalViewModel.navigate(to: .entry)
                    } catch {
                        globalViewModel.snackbarIsOpen.toggle()
                        globalViewModel.snackbarMessage = "Đã xảy ra lỗi. Xin vui lòng thử lại"
                        globalViewModel.snackbarType = .error
                    }
                }
            }
        }
    }
}


#Preview {
    SignUpScreen()
}
