package com.example.goscootandroid.Models.Domains

import android.annotation.SuppressLint
import kotlinx.serialization.Serializable

@Serializable
@SuppressLint("UnsafeOptInUsageError")
data class Customer(
    val id: String,
    val full_name: String,
    val phone_number: String
)