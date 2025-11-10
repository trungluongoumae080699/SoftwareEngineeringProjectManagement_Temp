//
//  GoScootIoSApp.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI
import SwiftData
import UIKit

@main
struct GoScootIoSApp: App {
    var centralViewModel: GlobalViewModel = GlobalViewModel()
    
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Item.self,
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        
        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(centralViewModel)
            
        }
        .modelContainer(sharedModelContainer)
    }
}
