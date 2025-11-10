package com.example.goscootandroid.Presentation.Components.Inputs

import android.view.MotionEvent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInteropFilter
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun HyperLink(
    text: String,
    onClick: () -> Unit,
    enabled: Boolean = true,
    normalColor: Color = MaterialTheme.colorScheme.primary,
    pressedColor: Color = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f),
    disabledColor: Color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f),
    underlineOnPress: Boolean = true,
    style: TextStyle = MaterialTheme.typography.bodySmall, // 👈 pass TextStyle instead
    modifier: Modifier = Modifier
) {
    var isPressed by remember { mutableStateOf(false) }

    val textColor by remember(isPressed, enabled) {
        mutableStateOf(
            when {
                !enabled -> disabledColor
                isPressed -> pressedColor
                else -> normalColor
            }
        )
    }

    Text(
        text = text,
        style = style.copy(                 // 👈 use style here
            color = textColor,
            textDecoration = if (underlineOnPress && isPressed) TextDecoration.Underline else TextDecoration.None
        ),
        modifier = modifier
            .clickable(
                enabled = enabled,
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            ) { onClick() }
            .pointerInteropFilter {
                when (it.action) {
                    MotionEvent.ACTION_DOWN -> isPressed = true
                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> isPressed = false
                }
                false
            }
    )
}