package com.example.goscootandroid.Models.DTOs.Requests

import android.annotation.SuppressLint
import kotlinx.serialization.Serializable

@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class RequestRegistrationDTO(
    val full_name: String,
    val password: String,
    val phone_number: String
)