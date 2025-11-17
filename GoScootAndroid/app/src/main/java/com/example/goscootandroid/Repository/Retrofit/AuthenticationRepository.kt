package com.example.goscootandroid.Repository

import android.annotation.SuppressLint
import android.util.Log
import com.example.goscootandroid.EnvironmentObjects.GoScootApi
import com.example.goscootandroid.Models.DTOs.Requests.RequestLogInDTO
import com.example.goscootandroid.Models.DTOs.Requests.RequestRegistrationDTO
import com.example.goscootandroid.Models.DTOs.Responses.ResponseFailureDTO
import com.example.goscootandroid.Models.DTOs.Responses.ResponseLogInDTO

import kotlinx.serialization.json.Json
import okhttp3.ResponseBody
import retrofit2.HttpException
import javax.inject.Inject

/**
 * Swift parity:
 * - signIn(body) -> ResponseLogInDTO
 * - signUp(body) -> Unit
 * - logInWithSessionId(sessionId) -> ResponseLogInDTO
 *
 * Throws:
 * - UnAuthorizedError on 401/403/409
 * - ApiError on other non-2xx, with server message if available
 */
class AuthenticationRepository @Inject constructor(
    private val api: GoScootApi,
    private val json: Json
) {

    suspend fun signIn(body: RequestLogInDTO): ResponseLogInDTO =
        try {
            Log.d("Sign In", "Signing In....")
            api.logIn(body)
        } catch (t: Throwable) {
            throw mapHttpException(t)
        }

    suspend fun signUp(body: RequestRegistrationDTO) {
        try {
            api.register(body)
        } catch (t: Throwable) {
            throw mapHttpException(t)
        }
    }

    suspend fun logInWithSessionId(sessionId: String): ResponseLogInDTO =
        try {
            api.logInViaSession(sessionId)
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