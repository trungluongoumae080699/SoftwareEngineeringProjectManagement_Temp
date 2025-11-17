package com.example.goscootandroid.Presentation.Screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddIcCall
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.goscootandroid.EnvironmentObjects.LocalGlobalViewModelProvider
import com.example.goscootandroid.Presentation.Components.Inputs.BrandButton
import com.example.goscootandroid.Presentation.Components.Inputs.HyperLink
import com.example.goscootandroid.Presentation.Components.Inputs.InputField
import com.example.goscootandroid.Presentation.Components.Modules.AppSnackbarHost
import com.example.goscootandroid.Presentation.ViewModel.GlobalViewModel
import com.example.goscootandroid.Presentation.ViewModel.RegistrationScreenViewModel
import com.example.goscootandroid.Presentation.ViewModel.SnackbarType
import com.example.goscootandroid.R
import com.example.goscootandroid.Repository.Retrofit.ApiError
import com.example.goscootandroid.Repository.Retrofit.UnAuthorizedError
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch


@Composable
fun SignUpScreen(
    vm: RegistrationScreenViewModel = hiltViewModel(),
) {
    val globalVM = LocalGlobalViewModelProvider.current
    val phone by vm.phoneNumber.collectAsState()
    val password by vm.password.collectAsState()
    val fullName by vm.fullName.collectAsState()
    val confirmPassword by vm.confirmPassword.collectAsState()

    val sendRequest by vm.sendRequest.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        snackbarHost = {
            AppSnackbarHost(
                hostState = snackbarHostState,
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(id = R.drawable.login_signup_bg),
                contentDescription = null, // null = decorative image
                modifier = Modifier.matchParentSize(), // fill the Box exactly
                contentScale = ContentScale.Crop // scale nicely to fill
            )

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.width(320.dp)
            ) {
                // Logo
                Image(
                    painter = painterResource(id = R.drawable.app_logo),
                    contentDescription = "App Logo"
                )

                Text(
                    "Chào Mừng Bạn Đến Với Với GoScoot!",
                    color = Color(0xFFDF6C20),
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(vertical = 10.dp),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                // Phone field
                InputField(
                    value = fullName,
                    onValueChange = vm::updateFullName,
                    placeholder = "Nhập họ và tên",
                    label = "Họ Và Tên",
                    leadingIcon = Icons.Filled.Person,
                    isRequired = true,
                    validator = { input -> vm.validateFullName(input) }
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Phone field
                InputField(
                    value = phone,
                    onValueChange = vm::updatePhoneNumber,
                    placeholder = "Nhập số điện thoại",
                    label = "Số Điện Thoại",
                    leadingIcon = Icons.Filled.AddIcCall,
                    isRequired = true,
                            validator = { input -> vm.validatePhoneNumber(input) }
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Password field
                InputField(
                    value = password,
                    onValueChange = vm::updatePassword,
                    placeholder = "Nhập mật khẩu",
                    label = "Mật Khẩu",
                    leadingIcon = Icons.Filled.Lock,
                    needSProtection = true,
                    isRequired = true,
                    validator = { input -> vm.validatePassword(input) }

                )

                Spacer(Modifier.height(10.dp))

                InputField(
                    value = confirmPassword,
                    onValueChange = vm::updateConfirmPassword,
                    placeholder = "Nhập lại mật khẩu",
                    label = "Xác Thực Mật Khẩu",
                    leadingIcon = Icons.Filled.Lock,
                    needSProtection = true,
                    isRequired = true,
                    validator = { input -> vm.validateConfirmPassword(input) }
                )

                Spacer(Modifier.height(15.dp))

                // Login button
                BrandButton(
                    label = "Đăng Ký",
                    onClick = {
                        vm.signUp(
                            onSuccess = {  ->
                                onSignUpSuccess(globalVM, coroutineScope, snackbarHostState)
                            },
                            onError = { err ->
                                onSignUpFailure(err, globalVM, coroutineScope, snackbarHostState)
                            }
                        )

                              },

                    enabled = vm.isFormValid() && !sendRequest,

                    )

                Spacer(Modifier.height(12.dp))

                // Sign up link
                Row(
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Đã Có Tài Khoản? ", style = MaterialTheme.typography.bodySmall,)
                    HyperLink(
                        text = "Đăng Nhập",
                        onClick = { globalVM.goBack() },
                        normalColor = Color(0xFFDF6C20),
                        pressedColor = MaterialTheme.colorScheme.secondary,
                        disabledColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f),

                        underlineOnPress = true,

                        )
                }
            }
        }
    }
}

private fun onSignUpSuccess(
    globalVM: GlobalViewModel,
    coroutineScope: CoroutineScope,
    snackbarHostState: SnackbarHostState
) {
    globalVM.updateSnackBarType(SnackbarType.Success)
    coroutineScope.launch {
        launch {
            snackbarHostState.showSnackbar(
                message = "Đăng nhập thành công",
                withDismissAction = true,
                duration = SnackbarDuration.Short
            )
        }
        delay(2000)
        globalVM.goBack()
    }

}

private fun onSignUpFailure(
    err: Throwable,
    globalVM: GlobalViewModel,
    coroutineScope: CoroutineScope,
    snackbarHostState: SnackbarHostState
) {
    val msg = when (err) {
        is UnAuthorizedError -> "Phiên đăng nhập không hợp lệ"
        is ApiError -> err.messageText
        else -> "Đã xảy ra lỗi. Xin vui lòng thử lại"
    }
    globalVM.updateSnackBarType(SnackbarType.Error)
    coroutineScope.launch {
        launch{
            snackbarHostState.showSnackbar(
                message = msg,
                withDismissAction = true,
                duration = SnackbarDuration.Short
            )
        }

    }


}


