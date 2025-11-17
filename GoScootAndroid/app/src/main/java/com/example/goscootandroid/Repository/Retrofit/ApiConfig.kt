package com.example.goscootandroid.Repository

import android.annotation.SuppressLint
import kotlinx.serialization.Serializable
import okhttp3.Interceptor
import okhttp3.HttpUrl.Companion.toHttpUrl


@SuppressLint("UnsafeOptInUsageError")
@Serializable
data class ApiErrorDTO(val message: String, val status: Int? = null)

class ApiError(val messageText: String, val status: Int? = null) : Exception(messageText)
class UnAuthorizedError(val msg: String, val code: Int = 401) : Exception(msg)
class IgnorableError(val msg: String) : Exception("Ignore")

class FrontEndError(val reason: String) : Exception(reason)


