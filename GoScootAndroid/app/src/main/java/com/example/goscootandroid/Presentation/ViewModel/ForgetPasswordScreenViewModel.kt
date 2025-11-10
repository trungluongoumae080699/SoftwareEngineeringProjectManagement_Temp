package com.example.goscootandroid.Presentation.ViewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goscootandroid.Models.DTOs.Requests.RequestRegistrationDTO
import com.example.goscootandroid.Presentation.Components.Inputs.ValidationResult
import com.example.goscootandroid.Repository.AuthenticationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ForgetPasswordScreenViewModel @Inject constructor(
) : ViewModel() {

    private val _phoneNumber = MutableStateFlow("")
    val phoneNumber: StateFlow<String> = _phoneNumber

    private val _password = MutableStateFlow("")
    val password: StateFlow<String> = _password

    private val _confirmPassword = MutableStateFlow("")
    val confirmPassword: StateFlow<String> = _confirmPassword

    private val _sendRequest = MutableStateFlow(false)
    val sendRequest: StateFlow<Boolean> = _sendRequest

    // --- setters (call from UI on text change) ---
    fun updatePhoneNumber(v: String) { _phoneNumber.value = v }
    fun updatePassword(v: String) { _password.value = v }
    fun updateConfirmPassword(v: String) { _confirmPassword.value = v }
    fun setSendRequest(v: Boolean) { _sendRequest.value = v }

    // --- Validators (mirror Swift logic) ---
    fun validatePassword(input: String): ValidationResult {
        val regex = Regex("^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$")
        return when {
            input.isEmpty() -> ValidationResult("", false)
            !regex.containsMatchIn(input) -> ValidationResult(
                message = "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt.",
                isValid = false
            )
            else -> ValidationResult("", true)
        }
    }

    fun validateConfirmPassword(input: String): ValidationResult {
        val pwd = _password.value
        return when {
            input.isEmpty() -> ValidationResult("", false)
            input != pwd -> ValidationResult("Mật khẩu xác nhận không khớp.", false)
            else -> ValidationResult("", true)
        }
    }


    fun isFormValid(): Boolean {
        return validatePassword(_password.value).isValid &&
                validateConfirmPassword(_confirmPassword.value).isValid &&
                _phoneNumber.value != ""


    }


}