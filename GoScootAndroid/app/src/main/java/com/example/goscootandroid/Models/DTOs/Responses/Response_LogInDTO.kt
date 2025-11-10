package com.example.goscootandroid.Models.DTOs.Responses
import android.annotation.SuppressLint
import com.example.goscootandroid.Models.Domains.Customer
import kotlinx.serialization.Serializable



@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class ResponseLogInDTO(
    val user_profile: Customer,
    val session_id: String
)

