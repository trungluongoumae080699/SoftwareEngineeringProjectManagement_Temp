package com.example.goscootandroid.Models.Domains

import android.annotation.SuppressLint
import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@SuppressLint("UnsafeOptInUsageError")
@Serializable
@Entity(tableName = "bike_hubs")
data class BikeHub(
    @PrimaryKey val id: String,
    val address: String,
    val longitude: Double,
    val latitude: Double
)