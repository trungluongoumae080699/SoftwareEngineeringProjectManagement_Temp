//
//  RootView.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 9/11/25.
//

import SwiftUI
import Foundation

struct AppNavHost: View {
    @EnvironmentObject var centralViewModel: GlobalViewModel
    
    
    var body: some View {
        NavigationStack(path: $centralViewModel.path) {
            Entry()
                .navigationDestination(for: AppScreen.self) { screen in
                    switch screen {
                    case .entry: Entry()
                    case .login: LogInScreen()
                    case .signUp: SignUpScreen()
                    case .forgetPassword: ForgetPasswordScreen()
                    }
                }
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct RootView: View {
    @EnvironmentObject var centralViewModel: GlobalViewModel
    @Environment(\.modelContext) private var context
    
    var body: some View {
        VStack {
            AppNavHost().frame(maxWidth: .infinity)
            /*
             if centralViewModel.currentScreen == .productListing
             || centralViewModel.currentScreen == .employeeListing
             
             {
             BottomTab()
             }
             */
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
        .ignoresSafeArea()
        .overlay(alignment: .bottom){
            Snackbar()
        }
        /*
         .onAppear {
         BGUploadManager.shared.attachContext(context)
         BGDownloadManager.shared.attachContext(context)
         BGUploadManager.shared.resumePendingJobs()
         BGDownloadManager.shared.resumePendingJobs()
         }
         
         .sheet(isPresented: $centralViewModel.notificationSheetIsOpen){
         NotificationSheet().presentationDetents([.fraction(0.5)])
         .presentationBackground(Color(hex: "#212121"))
         .presentationDragIndicator(.visible)
         .interactiveDismissDisabled(false)
         .presentationCornerRadius(24)
         .presentationBackgroundInteraction(.disabled)
         }
         */
        
        
    }
}
