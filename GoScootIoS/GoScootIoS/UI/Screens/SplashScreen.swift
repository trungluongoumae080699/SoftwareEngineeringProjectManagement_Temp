//
//  SplashScreen.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//
import SwiftUI

struct Entry: View {
    @EnvironmentObject var globalViewModel: GlobalViewModel
    
    var body: some View {
        VStack{
            Image("app_logo")
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(
            Image("splash_screen_bg").resizable().ignoresSafeArea()
        ).onAppear{
            Task {
                do {
                    try? await Task.sleep(nanoseconds: 3_000_000_000) // 3 seconds
                    let resp = try await globalViewModel.logInBySessionId()
                    if let logInResp = resp {
                        globalViewModel.profile = logInResp.user_profile
                        UserDefaults.standard.set(logInResp.session_id, forKey: "sessionId")
                        globalViewModel.snackbarIsOpen.toggle()
                        globalViewModel.snackbarMessage = "Đăng nhập thành công"
                        globalViewModel.snackbarType = .success
                    } else {
                        globalViewModel.navigate(to: .login)
                    }
                    
                }catch let error as ApiError {
                    globalViewModel.snackbarIsOpen.toggle()
                    globalViewModel.snackbarMessage = error.message
                    globalViewModel.snackbarType = .error
                    globalViewModel.navigate(to: .login)
                } catch let error as UnAuthorizedError {
                    globalViewModel.snackbarIsOpen.toggle()
                    globalViewModel.snackbarMessage = error.message
                    globalViewModel.snackbarType = .error
                    globalViewModel.navigate(to: .login)
                } catch {
                    globalViewModel.snackbarIsOpen.toggle()
                    globalViewModel.snackbarMessage = "Đã xảy ra lỗi. Xin vui lòng thử lại"
                    globalViewModel.snackbarType = .error
                    globalViewModel.navigate(to: .login)
                }
                
            }
        }
    }
}

#Preview {
    Entry().environmentObject(GlobalViewModel())
}
