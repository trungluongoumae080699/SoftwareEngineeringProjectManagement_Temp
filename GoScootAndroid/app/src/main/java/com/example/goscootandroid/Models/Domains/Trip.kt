package com.example.goscootandroid.Models.Domains

import android.annotation.SuppressLint
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
enum class TripStatus(val value: String) {
    @SerialName("Cancelled")
    CANCELLED("Cancelled"),
    @SerialName("Pending")
    PENDING("Pending"),
    @SerialName("Complete")
    COMPLETE("Complete"),
    @SerialName("In Progress")
    IN_PROGRESS("In Progress")
}
@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class Trip (
    val id: String,
    val bike_id: String,
    val hub_id: String,
    val customer_id: String,
    val trip_status: TripStatus,
    val reservation_expiry: Long,
    val reservation_date: Long,
    val trip_start_date: Long?,
    val trip_end_date: Long?,
    val trip_end_long: Double?,
    val trip_end_lat: Double?,
    val trip_secret: String?,
    val price: Int?,
    val isPaid: Boolean?,
)