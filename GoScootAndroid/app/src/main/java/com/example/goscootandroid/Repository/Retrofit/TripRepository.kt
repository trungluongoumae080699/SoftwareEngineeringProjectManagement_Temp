package com.example.goscootandroid.Repository.Retrofit

import android.R
import android.util.Log
import com.example.goscootandroid.EnvironmentObjects.GoScootApi
import com.example.goscootandroid.Models.DTOs.Requests.RequestLogInDTO
import com.example.goscootandroid.Models.DTOs.Requests.RequestRegistrationDTO
import com.example.goscootandroid.Models.DTOs.Responses.ResponseFailureDTO
import com.example.goscootandroid.Models.DTOs.Responses.ResponseLogInDTO
import com.example.goscootandroid.Models.DTOs.Responses.Response_MyTripsDTO
import kotlinx.serialization.json.Json
import okhttp3.ResponseBody
import retrofit2.HttpException
import javax.inject.Inject

class TripRepository @Inject constructor(
    private val api: GoScootApi,
    private val json: Json
) {

    suspend fun getTripByUser(page: Int, sessionId: String): Response_MyTripsDTO =
        try {
            api.fetchMyTrips(page, sessionId)
        } catch (t: Throwable) {
            throw mapHttpException(t)
        }



    // ---- helpers ----

    private fun mapHttpException(t: Throwable): Throwable {
        if (t is HttpException) {
            val code = t.code()
            val message = parseServerMessage(t.response()?.errorBody())

            return when (code) {
                401, 403, 409 -> UnAuthorizedError(message ?: "Unauthorized", code)
                else          -> ApiError(message ?: "HTTP $code", code)
            }
        }
        return ApiError(t.message ?: "Network error", -1)
    }

    private fun parseServerMessage(body: ResponseBody?): String? {
        if (body == null) return null
        return runCatching {
            val raw = body.string() // consume once
            json.decodeFromString<ResponseFailureDTO>(raw).message
        }.getOrNull()
    }
}