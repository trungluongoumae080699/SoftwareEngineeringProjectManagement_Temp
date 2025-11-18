package com.example.goscootandroid.Presentation.ViewModel

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goscootandroid.Models.DTOs.Responses.ResponseLogInDTO
import com.example.goscootandroid.Models.DTOs.Responses.Response_TripDTO
import com.example.goscootandroid.Models.Domains.Bike
import com.example.goscootandroid.Models.Domains.BikeHub
import com.example.goscootandroid.Models.Domains.Trip
import com.example.goscootandroid.Models.Domains.TripStatus
import com.example.goscootandroid.Repository.Retrofit.TripRepository
import com.mapbox.maps.extension.style.expressions.dsl.generated.floor
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import java.io.BufferedReader
import javax.inject.Inject
import kotlin.math.ceil

@HiltViewModel
class TripManagementViewModel @Inject constructor(
    private val tripRepository: TripRepository
): ViewModel() {

    private val _trips = MutableStateFlow<List<Response_TripDTO>>(listOf())
    val trips: StateFlow<List<Response_TripDTO>> = _trips

    private val _toFetchTrips = MutableStateFlow<Boolean>(true)
    val toFetchTrips: StateFlow<Boolean> = _toFetchTrips

    fun updateToFetchTrips(state: Boolean){
        _toFetchTrips.value = state
    }

    private val _currentPage = MutableStateFlow<Int>(1)
    val currentPage: StateFlow<Int> = _currentPage

    fun updateCurrentPage(page: Int){
        _currentPage.value = page
    }

    private val _currentPageGroupIndex = MutableStateFlow<Int>(0)
    val currentPageGroupIndex: StateFlow<Int> = _currentPageGroupIndex

    private val _pageGroup = MutableStateFlow<List<List<Int>>>(listOf(listOf(1)))
    val pageGroup: StateFlow<List<List<Int>>> = _pageGroup

    suspend fun fetchTrips(
        context: Context,
        sessionId: String

    ) {
        val response = tripRepository.getTripByUser(_currentPage.value, sessionId)
        _trips.value = response.trips
        val numberOfPages = ceil(response.total / 10.0).toInt()
        val groups = mutableListOf<List<Int>>()
        var current = mutableListOf<Int>()

        for (page in 1..numberOfPages) {
            current.add(page)

            if (current.size == 5) {
                groups.add(current.toList())
                current = mutableListOf()
            }
        }

        if (current.isNotEmpty()) {
            groups.add(current.toList())
        }
        _pageGroup.value = groups

    }


    private val _trip = MutableStateFlow<Response_TripDTO?>(null)
    val trip: StateFlow<Response_TripDTO?> = _trip




}