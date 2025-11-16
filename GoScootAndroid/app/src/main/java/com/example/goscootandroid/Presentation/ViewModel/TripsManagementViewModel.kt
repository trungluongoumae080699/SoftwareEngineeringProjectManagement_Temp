package com.example.goscootandroid.Presentation.ViewModel

import androidx.lifecycle.ViewModel
import com.example.goscootandroid.Models.Domains.Bike
import com.example.goscootandroid.Models.Domains.BikeHub
import com.example.goscootandroid.Models.Domains.Trip
import com.example.goscootandroid.Models.Domains.TripStatus
import com.mapbox.maps.extension.style.expressions.dsl.generated.id
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

@HiltViewModel
class TripManagementViewModel @Inject constructor(): ViewModel() {

    private val _trips = MutableStateFlow<List<Trip>>(listOf())
    private val trips: StateFlow<List<Trip>> = _trips

    private val _trip = MutableStateFlow<Trip?>(Trip(
        id = "trip_001",
        bike = Bike(
            id = "bike_003",
            name = "E-Bike 3",
            battery_status = null,
            maximum_speed = 35,
            maximum_functional_distance = 95
        ),
        hub = BikeHub(
            id = "hub_4",
            address = "16 street 7 Linh Chieu ward Thu Duc district Ho Chi Minh",
            longitude = 106.612219,
            latitude = 106.612219
        ),
        customer_id = "user_456",
        trip_status = TripStatus.IN_PROGRESS,
        reservation_date = System.currentTimeMillis(),
        reservation_expiry = System.currentTimeMillis() + (15 * 60 * 1000), // +15 minutes
        trip_start_date = System.currentTimeMillis(),
        trip_end_date = null,
        trip_end_long = null,
        trip_end_lat = null,
        trip_secret = List(32) {
            "abcdefghijklmnopqrstuvwxyz0123456789".random()
        }.joinToString(""),
        price = null,
        isPaid = null

    ))
    val trip: StateFlow<Trip?> = _trip




}