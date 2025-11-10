package com.example.goscootandroid.Models.DTOs.Requests

import android.annotation.SuppressLint
import kotlinx.serialization.Serializable

@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class RequestLogInDTO(
    val phone_number: String,
    val password: String
)