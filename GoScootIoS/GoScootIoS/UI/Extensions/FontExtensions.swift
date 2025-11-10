//
//  FontExtensions.swift
//  GoScootIoS
//
//  Created by KumikoOumae on 8/11/25.
//

import SwiftUI

extension Font {
    static func brand(_ size: CGFloat, weight: String = "Regular") -> Font {
        .custom("BeVietnamPro-\(weight)", size: size)
    }
}
