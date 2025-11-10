import SwiftUI

struct BrandButtonStyle: ButtonStyle {
    // MARK: - Colors
    var normalColor: Color = Color("Brand_Primary")
    var pressedColor: Color = Color("Brand_Primary").opacity(0.7)
    var disabledColor: Color = .gray.opacity(0.4)
    
    var textColor: Color = .white
    var pressedTextColor: Color = .white.opacity(0.9)
    var disabledTextColor: Color = .white.opacity(0.6)
    
    // MARK: - Layout
    var alignment: Alignment = .center
    var width: CGFloat? = nil
    var height: CGFloat? = nil
    var cornerRadius: CGFloat = 25
    
    // MARK: - Behavior
    var isHyperLink: Bool = false
    
    func makeBody(configuration: Configuration) -> some View {
        BrandButton(
            configuration: configuration,
            normalColor: normalColor,
            pressedColor: pressedColor,
            disabledColor: disabledColor,
            textColor: textColor,
            pressedTextColor: pressedTextColor,
            disabledTextColor: disabledTextColor,
            alignment: alignment,
            width: width,
            height: height,
            cornerRadius: cornerRadius,
            isHyperLink: isHyperLink
        )
    }

    // MARK: - Inner View
    private struct BrandButton: View {
        let configuration: Configuration
        let normalColor: Color
        let pressedColor: Color
        let disabledColor: Color
        let textColor: Color
        let pressedTextColor: Color
        let disabledTextColor: Color
        let alignment: Alignment
        let width: CGFloat?
        let height: CGFloat?
        let cornerRadius: CGFloat
        let isHyperLink: Bool

        @Environment(\.isEnabled) private var isEnabled

        var body: some View {
            Group {
                if isHyperLink {
                    configuration.label
                        .foregroundColor(foregroundColor)
                        .underline(configuration.isPressed, color: foregroundColor)
                        .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
                } else {
                    configuration.label
                        .frame(maxWidth: width ?? .infinity, alignment: alignment)
                        .frame(height: height)
                        .background(backgroundColor)
                        .foregroundColor(foregroundColor)
                        .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
                        .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
                }
            }
        }

        // MARK: - Dynamic Colors
        private var backgroundColor: Color {
            if !isEnabled { return disabledColor }
            if configuration.isPressed { return pressedColor }
            return normalColor
        }

        private var foregroundColor: Color {
            if !isEnabled { return disabledTextColor }
            if configuration.isPressed { return pressedTextColor }
            return textColor
        }
    }
}
