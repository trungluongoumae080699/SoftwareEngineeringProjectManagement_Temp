package com.example.goscootandroid.Presentation.Components.Modules

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarData
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.goscootandroid.EnvironmentObjects.LocalGlobalViewModelProvider
import com.example.goscootandroid.Presentation.ViewModel.GlobalViewModel
import com.example.goscootandroid.Presentation.ViewModel.SnackbarType
import com.example.goscootandroid.ui.theme.BeVietnamPro

@Composable
fun AppSnackbarHost(
    hostState: SnackbarHostState
) {
    // Observe whether the snackbar is currently being displayed
    val currentSnackbarData = hostState.currentSnackbarData

    // Render custom snackbar UI for anything posted to hostState
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(bottom = 24.dp),
        contentAlignment = Alignment.BottomCenter
    ) {
        AnimatedVisibility(
            visible = currentSnackbarData != null,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            currentSnackbarData?.let { data ->
                AppSnackbar(data)
            }
        }
    }
}

@Composable
private fun AppSnackbar(
    data: SnackbarData,

) {
    val globalVM = LocalGlobalViewModelProvider.current
    val snackbarType by globalVM.snackbarType.collectAsStateWithLifecycle()

    Row(
        modifier = Modifier
            .widthIn(max = 350.dp)
            .fillMaxWidth(0.92f)
            .clip(MaterialTheme.shapes.small)
            .background(snackbarType.color)
            .padding(horizontal = 12.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceAround
    ) {
        Icon(snackbarType.icon, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimary)
        Spacer(modifier = Modifier.width(5.dp))
        Text(
            text = data.visuals.message,
            color = Color.White,
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.weight(1f)
        )
        // Close button (like your SwiftUI xmark)
        Spacer(modifier = Modifier.width(5.dp))
        Text(
            text = "✕",
            color = MaterialTheme.colorScheme.onPrimary,
            modifier = Modifier
                .padding(4.dp)
                .clickable {
                    data.dismiss()   // dismiss the current snackbar in the host
                },
            style = MaterialTheme.typography.labelLarge
        )
    }
}