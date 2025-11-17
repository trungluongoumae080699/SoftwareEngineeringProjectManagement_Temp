package com.example.goscootandroid.EnvironmentObjects

import com.example.goscootandroid.Models.DTOs.Requests.RequestLogInDTO
import com.example.goscootandroid.Models.DTOs.Requests.RequestRegistrationDTO
import com.example.goscootandroid.Models.DTOs.Responses.ResponseLogInDTO
import com.example.goscootandroid.Models.DTOs.Responses.Response_MyTripsDTO
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Query
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    // Base URL (Retrofit requires it, even if you pass full @Url later)
    private const val BASE_URL = "https://still-simply-katydid.ngrok.app/app/"

    // --- JSON Serializer ---
    @Provides
    @Singleton
    fun provideJson(): Json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
        explicitNulls = false
    }

    // --- Logging Interceptor ---
    @Provides
    @Singleton
    fun provideLoggingInterceptor(): HttpLoggingInterceptor =
        HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

    // --- Session Interceptor ---
    @Provides
    @Singleton
    fun provideSessionInterceptor(): Interceptor = Interceptor { chain ->
        val original = chain.request()
        val builder = original.newBuilder()
            .header("Content-Type", "application/json")

        // You can later inject a session provider (e.g. from DataStore)
        // For now, it’s a placeholder
        val sessionId: String? = null
        sessionId?.let { builder.header("authorization", it) }

        chain.proceed(builder.build())
    }

    // --- OkHttp Client ---
    @Provides
    @Singleton
    fun provideOkHttpClient(
        logging: HttpLoggingInterceptor,
        sessionInterceptor: Interceptor
    ): OkHttpClient =
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor(sessionInterceptor)
            .build()

    // --- Retrofit ---
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, json: Json): Retrofit {
        val contentType = "application/json".toMediaType()
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(json.asConverterFactory(contentType))
            .client(okHttpClient)
            .build()
    }

    // --- API Interface ---
    @Provides
    @Singleton
    fun provideGoScootApi(retrofit: Retrofit): GoScootApi =
        retrofit.create(GoScootApi::class.java)
}

object ApiPaths {
    const val LOGIN = "auth/signIn"
    const val LOGIN_VIA_SESSION = "auth/signIn/session"
    const val REGISTER = "auth/signUp"

    const val MY_TRIPS = "trips"
}

/* =========================
 * 5) Retrofit service
 * =========================
 * We use @Url to pass fully-built URLs from ApiConfig.buildUrl(),
 * matching your Swift `buildRequest(...)` flexibility.
 */
interface GoScootApi {
    @POST(ApiPaths.LOGIN)
    suspend fun logIn(
        @Body body: RequestLogInDTO
    ): ResponseLogInDTO

    @GET(ApiPaths.LOGIN_VIA_SESSION)
    suspend fun logInViaSession(
        @Header("authorization") sessionId: String
    ): ResponseLogInDTO

    @POST(ApiPaths.REGISTER)
    suspend fun register(
        @Body body: RequestRegistrationDTO
    ): Unit

    @GET(ApiPaths.MY_TRIPS)
    suspend fun fetchMyTrips(
        @Query("page") page: Int,
        @Header("authorization") sessionId: String
    ): Response_MyTripsDTO
}