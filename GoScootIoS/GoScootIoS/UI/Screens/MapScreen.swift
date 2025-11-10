//
//  MapScreen.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI
import MapKit
import CoreLocation



struct MapScreen: View {
    @StateObject private var mapVm = MapScreenViewModel()
    @State private var camera: MapCameraPosition = .automatic

    private let hcmc = CLLocationCoordinate2D(latitude: 10.7769, longitude: 106.7009)

    var body: some View {
        Map(position: $camera, interactionModes: .all) {
            if mapVm.isAuthorized {
                // ✅ iOS 17+: hiển thị chấm xanh vị trí người dùng
                UserAnnotation()
            } else {
                // ❌ Không có quyền -> ghim HCMC
                Annotation("Ho Chi Minh City", coordinate: hcmc) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.title)
                }
            }
        }
        .ignoresSafeArea()
        .mapControls {
            MapUserLocationButton()
            MapCompass()
            MapScaleView()
        }
        .onAppear {
            mapVm.requestAuthIfNeeded()
            // Fallback ban đầu: HCMC
            camera = .region(.init(center: hcmc,
                                   span: .init(latitudeDelta: 0.08, longitudeDelta: 0.08)))
        }
        .onChange(of: mapVm.authorizationStatus) { _ in
            updateCamera()
        }
        .onChange(of: mapVm.lastLocation) { _ in
            updateCamera()
        }
    }

    private func updateCamera() {
        if mapVm.isAuthorized, let coord = mapVm.lastLocation?.coordinate {
            camera = .region(.init(center: coord,
                                   span: .init(latitudeDelta: 0.02, longitudeDelta: 0.02)))
        } else {
            camera = .region(.init(center: hcmc,
                                   span: .init(latitudeDelta: 0.08, longitudeDelta: 0.08)))
        }
    }
}

#Preview {
    MapScreen()
}
