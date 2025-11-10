package com.example.goscootandroid.EnvironmentObjects

import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.staticCompositionLocalOf
import com.example.goscootandroid.Presentation.ViewModel.GlobalViewModel

val LocalGlobalViewModelProvider = staticCompositionLocalOf<GlobalViewModel> {
    error("GlobalViewModel not provided")
}