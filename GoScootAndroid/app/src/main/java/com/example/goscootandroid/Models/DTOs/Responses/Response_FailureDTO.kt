package com.example.goscootandroid.Models.DTOs.Responses

import android.annotation.SuppressLint
import kotlinx.serialization.Serializable

@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class ResponseFailureDTO(
    val message: String
)
