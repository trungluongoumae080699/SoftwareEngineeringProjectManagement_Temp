package com.example.goscootandroid.Presentation.ViewModel

import android.annotation.SuppressLint
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goscootandroid.Models.DTOs.Requests.RequestLogInDTO
import com.example.goscootandroid.Models.DTOs.Responses.ResponseLogInDTO
import com.example.goscootandroid.Repository.AuthenticationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LogInScreenViewModel @Inject constructor(
    private val authRepo: AuthenticationRepository
) : ViewModel() {

    private val _phoneNumber = MutableStateFlow("")
    val phone_number = _phoneNumber.asStateFlow()

    private val _password = MutableStateFlow("")
    val password = _password.asStateFlow()

    private val _sendRequest = MutableStateFlow(false)
    val sendRequest = _sendRequest.asStateFlow()

    fun updatePhoneNumber(value: String) = _phoneNumber.update { value }
    fun updatePassword(value: String) = _password.update { value }

    fun togglingSendRequest(){
        _sendRequest.value = !_sendRequest.value
    }

    // MARK: - Overall Form Validation
    fun isFormValid(): Boolean =
        _phoneNumber.value.isNotBlank() && _password.value.isNotBlank()

    /**
     * Swift parity:
     * suspend fun logIn(): ResponseLogInDTO
     */
    suspend fun logIn(): ResponseLogInDTO {
        check(isFormValid()) { "Phone and password are required." }
        _sendRequest.update { true }
        return try {
            val req = RequestLogInDTO(
                phone_number = _phoneNumber.value,
                password = _password.value
            )
            authRepo.signIn(req).also {
                _sendRequest.update { false }
            }
        } catch (e: Throwable) {
            _sendRequest.update { false }
            throw e
        }
    }

    /** Convenience launcher if you prefer not to call suspend from UI directly */
    fun logInAsync(onSuccess: (ResponseLogInDTO) -> Unit, onError: (Throwable) -> Unit) {
        viewModelScope.launch {
            try {
                onSuccess(logIn())
            } catch (t: Throwable) {
                onError(t)
            }
        }
    }
}