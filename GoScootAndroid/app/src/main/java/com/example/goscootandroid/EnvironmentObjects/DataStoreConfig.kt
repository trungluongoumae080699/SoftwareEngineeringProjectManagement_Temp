package com.example.goscootandroid.EnvironmentObjects

import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.map
import android.content.Context

// top-level extension for Context
val Context.dataStore by preferencesDataStore(name = "goscoot_prefs")

object SessionKeys {
    val SESSION_ID = stringPreferencesKey("session_id")
}