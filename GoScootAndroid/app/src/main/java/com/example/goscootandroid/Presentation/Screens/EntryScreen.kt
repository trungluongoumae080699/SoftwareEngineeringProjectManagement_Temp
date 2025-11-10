package com.example.goscootandroid.Presentation.Screens

import android.content.Context
import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import com.example.goscootandroid.EnvironmentObjects.LocalGlobalViewModelProvider
import com.example.goscootandroid.Models.DTOs.Responses.ResponseLogInDTO
import com.example.goscootandroid.Presentation.Components.Modules.AppSnackbarHost
import com.example.goscootandroid.Presentation.ViewModel.AppScreen
import com.example.goscootandroid.Presentation.ViewModel.GlobalViewModel
import com.example.goscootandroid.Presentation.ViewModel.SnackbarType
import com.example.goscootandroid.R
import com.example.goscootandroid.Repository.ApiError
import com.example.goscootandroid.Repository.IgnorableError
import com.example.goscootandroid.Repository.UnAuthorizedError
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun EntryScreen() {
    val globalVM: GlobalViewModel = LocalGlobalViewModelProvider.current
    val snackbarHostState = remember { SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        delay(3_000)
        globalVM.logInBySessionId(
            context = context,
            onSuccess = { resp ->
                onLoginSuccess(resp, context, globalVM, coroutineScope, snackbarHostState)
            },
            onError = { err ->
                onLoginFailure(err, globalVM, coroutineScope, snackbarHostState)
            }
        )
    }

    Scaffold(
        // disable Scaffold’s default safe-area padding so content can draw edge-to-edge
        contentWindowInsets = WindowInsets(0),
        snackbarHost = {
            // keep the snackbar above the gesture bar
            Box(Modifier.windowInsetsPadding(WindowInsets.navigationBars)) {
                AppSnackbarHost(hostState = snackbarHostState)
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),           // full-bleed
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(R.drawable.splash_screen_bg),
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),   // full-bleed background
                contentScale = ContentScale.Crop
            )

            Image(
                painter = painterResource(R.drawable.app_logo),
                contentDescription = "App Logo"
            )
        }
    }
}

private fun onLoginSuccess(
    resp: ResponseLogInDTO,
    context: Context,
    globalVM: GlobalViewModel,
    coroutineScope: CoroutineScope,
    snackbarHostState: SnackbarHostState
) {
    // Save session ID
    globalVM.updateProfile(resp.user_profile)
    globalVM.saveSessionId(resp.session_id, context)
    coroutineScope.launch {
        globalVM.updateSnackBarType(SnackbarType.Success)
        launch {
            snackbarHostState.showSnackbar(
                message = "Đăng nhập thành công",
                withDismissAction = true,
                duration = SnackbarDuration.Short
            )
        }
        delay(2000)
        globalVM.navigate(AppScreen.MAP, true)
    }

}

private fun onLoginFailure(
    err: Throwable,
    globalVM: GlobalViewModel,
    coroutineScope: CoroutineScope,
    snackbarHostState: SnackbarHostState
) {
    val msg = when (err) {
        is UnAuthorizedError -> "Phiên đăng nhập không hợp lệ"
        is ApiError -> err.messageText
        else -> "Đã xảy ra lỗi. Xin vui lòng đăng nhập lại"
    }

    coroutineScope.launch {
        if (err !is IgnorableError){
            globalVM.updateSnackBarType(SnackbarType.Error)
            launch {
                snackbarHostState.showSnackbar(
                    message = msg,
                    withDismissAction = true,
                    duration = SnackbarDuration.Short
                )
            }
            delay(2000)
        }

        globalVM.navigate(AppScreen.LOGIN, true)
    }


}
