//
//  Snackbar.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI

struct Snackbar: View {
    @EnvironmentObject var centralViewModel: GlobalViewModel
    
    var body: some View {
        
        HStack {
            Image(systemName: centralViewModel.snackbarType.rawValue).resizable().frame(width: 15, height: 15).foregroundColor(Color.white)
            Text(centralViewModel.snackbarMessage).font(.system(size: 16, weight: .bold, design: .monospaced)).foregroundColor(Color.white).frame(maxWidth: .infinity, alignment: .leading)
            Button(action: {
                withAnimation(.easeInOut(duration: 0.3)){
                    centralViewModel.snackbarIsOpen = false
                }

            }){
                Image(systemName: "xmark").resizable().frame(width: 10, height: 10).foregroundColor(Color.white)
            }
            
        }.padding(12).frame(width: 350).background(
            RoundedRectangle(cornerRadius: 5).fill(centralViewModel.snackbarType.color)).offset(y: centralViewModel.snackbarIsOpen ? -30 : 100)
    }
}

