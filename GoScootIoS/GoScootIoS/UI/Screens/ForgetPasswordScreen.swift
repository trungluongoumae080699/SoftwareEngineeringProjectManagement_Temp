//
//  ForgetPasswordScreen.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//
import SwiftUI

struct ForgetPasswordScreen: View {
    @StateObject var forgetPasswordVm: ForgetPasswordViewModel = ForgetPasswordViewModel()
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
                    text: $forgetPasswordVm.phone_number,
                    placeHolder: "Số điệnt thoại của bạn",
                    label: "Số Điện Thoại",
                    icon: "phone.fill",
                    isRequired: true,
                )
                InputField(
                    text: $forgetPasswordVm.password,
                    placeHolder: "Mật khẩu của bạn",
                    label: "Mật Khẩu",
                    icon: "key.fill",
                    isRequired: true,
                    onChangeText: forgetPasswordVm.validatePassword
                    
                )
                InputField(
                    text: $forgetPasswordVm.confirm_password,
                    placeHolder: "Nhập lại mật khẩu của bạn",
                    label: "Xác Nhận Mật Khẩu",
                    icon: "key.fill",
                    isRequired: true,
                    onChangeText: forgetPasswordVm.validateConfirmPassword
                    
                )
                HStack(){
                    Button("Quay Lại Đăng Nhập") {
                        globalViewModel.goBack()
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
                
                Button("Thay Đổi Mật Khẩu") { }
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
                ).frame(maxWidth: .infinity).disabled(!forgetPasswordVm.isFormValid())
                

                
            }.frame(width: 320)
           
        }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center).background{
            Image("login-signup-bg").resizable().ignoresSafeArea()
        }.navigationBarBackButtonHidden(true).font(.brand(14, weight: "Regular"))
    }
}


#Preview {
    ForgetPasswordScreen()
}
