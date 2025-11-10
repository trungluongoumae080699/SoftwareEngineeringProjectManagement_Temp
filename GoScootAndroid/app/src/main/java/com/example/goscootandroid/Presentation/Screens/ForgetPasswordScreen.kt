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
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.goscootandroid.EnvironmentObjects.LocalGlobalViewModelProvider
import com.example.goscootandroid.Models.DTOs.Responses.ResponseLogInDTO
import com.example.goscootandroid.Presentation.Components.Inputs.BrandButton
import com.example.goscootandroid.Presentation.Components.Inputs.HyperLink
import com.example.goscootandroid.Presentation.Components.Inputs.InputField
import com.example.goscootandroid.Presentation.Components.Modules.AppSnackbarHost
import com.example.goscootandroid.Presentation.ViewModel.AppScreen
import com.example.goscootandroid.Presentation.ViewModel.ForgetPasswordScreenViewModel
import com.example.goscootandroid.R


@Composable
fun ForgetPasswordScreen(
    vm: ForgetPasswordScreenViewModel = hiltViewModel(),
) {
    val globalVM = LocalGlobalViewModelProvider.current
    val phone by vm.phoneNumber.collectAsState()
    val password by vm.password.collectAsState()
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
                    "Quên Mật Khẩu? Đừng Lo!",
                    color = Color(0xFFDF6C20),
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(vertical = 10.dp),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                // Phone field
                InputField(
                    value = phone,
                    onValueChange = vm::updatePhoneNumber,
                    placeholder = "Số Điện Thoại",
                    leadingIcon = Icons.Filled.AddIcCall,
                    isRequired = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Password field
                InputField(
                    value = password,
                    onValueChange = vm::updatePassword,
                    placeholder = "Mật Khẩu",
                    leadingIcon = Icons.Filled.Lock,
                    needSProtection = true,
                    isRequired = true,
                    validator = { input -> vm.validatePassword(input) }

                )

                Spacer(Modifier.height(10.dp))

                InputField(
                    value = confirmPassword,
                    onValueChange = vm::updateConfirmPassword,
                    placeholder = "Xác Thực Mật Khẩu",
                    leadingIcon = Icons.Filled.Lock,
                    needSProtection = true,
                    isRequired = true,
                    validator = { input -> vm.validateConfirmPassword(input) }
                )

                Spacer(Modifier.height(10.dp))

                // Forgot password link
                HyperLink(
                    text = "Quay Về Đăng Nhập?",
                    onClick = { globalVM.goBack() },
                    normalColor = Color(0xFF757575),
                    pressedColor = Color(0xFFDF6C20),
                    disabledColor = Color(0xFFDF6C20),
                    underlineOnPress = true,
                    modifier = Modifier.align(Alignment.End)
                )

                Spacer(Modifier.height(15.dp))

                // Login button
                BrandButton(
                    label = "Đổi Mật Khẩu",
                    onClick = {},
                    enabled = vm.isFormValid() && !sendRequest,

                    )
            }
        }
    }
}


