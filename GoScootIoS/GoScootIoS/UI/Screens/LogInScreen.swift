//
//  LogInScreen.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI

struct LogInScreen: View {
    @StateObject var logInVM: LogInScreenViewModel = LogInScreenViewModel()
    @EnvironmentObject var globalViewModel: GlobalViewModel
    
    var body: some View {
        VStack{
            VStack{
                Image("app_logo")
                Text("Chào Mừng Bạn Quay Lại Với GoScoot!")
                    .foregroundColor(Color("Brand_Primary"))
                    .font(.brand(24, weight: "Bold"))
                    .multilineTextAlignment(TextAlignment.center)
                Spacer().frame(height: 10)
                InputField(
                    text: $logInVM.phone_number,
                    placeHolder: "Số Điện Thoại",
                    icon: "phone.fill",
                    isRequired: true
                )
                InputField(
                    text: $logInVM.phone_number,
                    placeHolder: "Mật Khẩu",
                    icon: "key.fill",
                    isRequired: true,
                    
                )
                HStack(){
                    Button("Quên Mật Khẩu ?") {
                        globalViewModel.navigate(to: .forgetPassword, toReset: false)
                    }
                        .buttonStyle(
                            BrandButtonStyle(
                                normalColor: .clear,
                                pressedColor: .clear,
                                disabledColor: .clear,
                                textColor: Color("Text_Sub"),
                                pressedTextColor: Color("Brand_Primary"),
                                alignment: .trailing,
                                isHyperLink: true
                            )
                        ).font(.brand(12, weight: "SemiBold"))
                }.frame(maxWidth: .infinity, alignment: .trailing)
                Spacer().frame(height: 15)
                
                Button("Đăng Nhập") {
                    logInVM.sendRequest = true
                }
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
                    ).frame(maxWidth: .infinity).disabled(!logInVM.isFormValid() && logInVM.sendRequest)
                
                HStack(spacing: 2) {
                    Text("Chưa Có Tài Khoản? ")
                    Button("Đăng Ký") {
                        globalViewModel.navigate(to: .signUp, toReset: false)
                        
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
            
        }.navigationBarBackButtonHidden(true).frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center).background{
            Image("login-signup-bg").resizable().ignoresSafeArea()
        }.font(.brand(14, weight: "Regular")).onChange(of: logInVM.sendRequest){
            if (logInVM.sendRequest){
                Task {
                    defer {
                        logInVM.sendRequest = false
                    }
                    do {
                        let resp = try await logInVM.logIn()
                        globalViewModel.profile = resp.user_profile
                        UserDefaults.standard.set(resp.session_id, forKey: "sessionId")
                        globalViewModel.snackbarIsOpen.toggle()
                        globalViewModel.snackbarMessage = "Đăng nhập thành công"
                        globalViewModel.snackbarType = .success
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
    LogInScreen()
}
