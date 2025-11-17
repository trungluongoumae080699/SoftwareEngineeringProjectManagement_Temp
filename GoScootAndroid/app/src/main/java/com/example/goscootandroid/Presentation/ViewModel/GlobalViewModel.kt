package com.example.goscootandroid.Presentation.ViewModel
import android.content.Context
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTimeFilled
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Info
import androidx.compose.ui.graphics.Color
import androidx.datastore.preferences.core.edit
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goscootandroid.EnvironmentObjects.SessionKeys
import com.example.goscootandroid.EnvironmentObjects.SessionKeys.PERSIST_HUB_JSON
import com.example.goscootandroid.EnvironmentObjects.dataStore
import com.example.goscootandroid.Models.Domains.BikeHub
import com.example.goscootandroid.Models.Domains.Customer
import com.example.goscootandroid.Repository.Retrofit.AuthenticationRepository
import com.example.goscootandroid.Repository.Retrofit.IgnorableError
import com.example.goscootandroid.Repository.Room.BikeHubDao
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import javax.inject.Inject



/* ---------- Navigation Destinations ---------- */
enum class AppScreen {
    ENTRY,
    LOGIN,
    SIGNUP,
    FORGET_PASSWORD,
    MAP,
    MY_TRIPS,
    CAMERA,
    TRIP_DETAIL
}

/* ---------- Snackbar Type Enum ---------- */
enum class SnackbarType {
    Success, Error, Wait, Info;

    val color: Color
        get() = when (this) {
            Success -> Color(0xFF4CAF50)
            Error   -> Color(0xFFE53935)
            Wait    -> Color(0xFFFFB300)
            Info    -> Color(0xFF2196F3)
        }

    val icon
        get() = when (this) {
            Success -> Icons.Filled.CheckCircle
            Error   -> Icons.Filled.Error
            Wait    -> Icons.Filled.AccessTimeFilled
            Info    -> Icons.Filled.Info
        }
}

sealed class NavEvent {
    data class To(val route: String, val popUpTo: String? = null, val inclusive: Boolean = false) : NavEvent()
    data object Back : NavEvent()
}

/* ---------- ViewModel ---------- */
@HiltViewModel
class GlobalViewModel @Inject constructor(
    private val bikeHubDao: BikeHubDao,
    private val authRepo: AuthenticationRepository
) : ViewModel() {

    private val _navEvents = MutableSharedFlow<NavEvent>(extraBufferCapacity = 1)
    val navEvents = _navEvents.asSharedFlow()
    private val _currentScreen = MutableStateFlow(AppScreen.ENTRY)
    val currentScreen: StateFlow<AppScreen> = _currentScreen

    private val _snackbarType = MutableStateFlow(SnackbarType.Success)
    val snackbarType: StateFlow<SnackbarType> = _snackbarType

    private val _profile = MutableStateFlow<Customer?>(null)
    val profile: StateFlow<Customer?> = _profile

    fun updateProfile(customer: Customer?) {
        _profile.value = customer
    }

    private val _sessionId = MutableStateFlow<String?>(null)
    val sessionId: StateFlow<String?> = _sessionId

    fun updateSessionId(sessionId: String?) {
        _sessionId.value = sessionId
    }

    // For simplicity, you can store a Trip model later here
    private val _reservedTrip = MutableStateFlow<Any?>(null)
    val reservedTrip: StateFlow<Any?> = _reservedTrip

    private val _finishedPersistingHubJson = MutableStateFlow<Boolean>(false)
    val finishedPersistingHubJson: StateFlow<Boolean> = _finishedPersistingHubJson

    suspend  fun persistHubFromJson(context: Context) {
        val alreadyPersisted = context.dataStore.data
            .map { it[PERSIST_HUB_JSON] ?: false }
            .first()

        if (alreadyPersisted) {
            println("✅ Hubs already persisted — skip loading.")
            return
        }
        val jsonString = withContext(Dispatchers.IO) {
            context.assets.open("hubs.json").bufferedReader().use { it.readText() }
        }

        // 3️⃣ Deserialize JSON → List<BikeHub>
        val json = Json {
            ignoreUnknownKeys = true
        }

        val hubs: List<BikeHub> = json.decodeFromString(jsonString)

        // 4️⃣ Insert into Room (replace all)
        bikeHubDao.insertAll(hubs)
        println("🚀 Inserted ${hubs.size} hubs into Room database.")

        // 5️⃣ Persist flag to DataStore
        context.dataStore.edit { prefs ->
            prefs[PERSIST_HUB_JSON] = true
        }
        _finishedPersistingHubJson.value = true
        println("🔒 DataStore flag updated → persist_hub_json = true")


    }

    /* -------- Navigation -------- */
    fun navigate(to: AppScreen, toClearStack: Boolean) {
        var pop: String? = null
        if (toClearStack){
            pop = _currentScreen.value.name
        }
        _currentScreen.value = to
        _navEvents.tryEmit(NavEvent.To(_currentScreen.value.name, popUpTo = pop, inclusive = false))
    }

    fun goBack() {
        _navEvents.tryEmit(NavEvent.Back)
    }

    fun resetNavigation() {
        _currentScreen.value = AppScreen.ENTRY
    }

    fun updateSnackBarType(type: SnackbarType){
        _snackbarType.value = type
    }



    /* -------- Session-based Login -------- */
    suspend fun logInBySessionId(
        context: Context,
    ) {
        val sessionId = context.dataStore.data
            .map { prefs -> prefs[SessionKeys.SESSION_ID] }
            .firstOrNull()

        if (sessionId.isNullOrBlank()) {
            throw IgnorableError("Missing session id")
        }
        // 2) Call API
        val resp = authRepo.logInWithSessionId(sessionId)
        // 3) Update state
        _profile.value = resp.user_profile
        _sessionId.value = resp.session_id
    }

    /* -------- Session Persistence -------- */
    fun saveSessionId(sessionId: String, context: Context) {
        _sessionId.value = sessionId
        viewModelScope.launch {
            context.dataStore.edit { prefs ->
                prefs[SessionKeys.SESSION_ID] = sessionId
            }
        }
    }

    fun clearSession() {
        _sessionId.value = null
        _profile.value = null
    }
}