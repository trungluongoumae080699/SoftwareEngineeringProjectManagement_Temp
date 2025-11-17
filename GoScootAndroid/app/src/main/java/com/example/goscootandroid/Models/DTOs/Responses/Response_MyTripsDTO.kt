package com.example.goscootandroid.Models.DTOs.Responses

import android.annotation.SuppressLint
import androidx.compose.foundation.pager.PageSize
import com.example.goscootandroid.Models.Domains.Bike
import com.example.goscootandroid.Models.Domains.BikeHub
import com.example.goscootandroid.Models.Domains.Trip
import kotlinx.serialization.Serializable

@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class Response_TripDTO (
    val trip: Trip,
    val bike: Bike,
    val hub: BikeHub
)

@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class Response_MyTripsDTO (
    val trips: List<Response_TripDTO>,
    val total: Int,
    val page: Int,
    val pageSize: Int,
    val totalPages: Int
)