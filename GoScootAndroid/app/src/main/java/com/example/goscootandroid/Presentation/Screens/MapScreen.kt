package com.example.goscootandroid.Presentation.Screens
import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.Style
import com.mapbox.maps.extension.compose.MapboxMap
import com.mapbox.maps.extension.compose.MapEffect
import com.mapbox.maps.extension.compose.animation.viewport.rememberMapViewportState
import com.mapbox.maps.plugin.PuckBearing
import com.mapbox.maps.plugin.locationcomponent.createDefault2DPuck
import com.mapbox.maps.plugin.locationcomponent.location

/*
@Composable
fun MapScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val permission = Manifest.permission.ACCESS_FINE_LOCATION
    val hasPermission = remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, permission) ==
                    PackageManager.PERMISSION_GRANTED
        )
    }

    val hcm = Point.fromLngLat(106.700981, 10.776889) // fallback: Ho Chi Minh City
    val mapViewportState = rememberMapViewportState {
        setCameraOptions(
            CameraOptions.Builder()
                .center(hcm)
                .zoom(12.0)
                .build()
        )
    }

    // Launcher for requesting permission
    val requestPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission.value = granted
    }

    // Request permission on first composition if not granted
    LaunchedEffect(Unit) {
        if (!hasPermission.value) {
            requestPermissionLauncher.launch(permission)
        }
    }

    MapboxMap(
        modifier = modifier.fillMaxSize(),
        mapViewportState = mapViewportState,
        style = { Style.MAPBOX_STREETS }
    ) {
        MapEffect(hasPermission.value) { mapView ->
            if (hasPermission.value) {
                // Enable user location puck
                mapView.location.updateSettings {
                    locationPuck = createDefault2DPuck(withBearing = true)
                    enabled = true
                    puckBearing = PuckBearing.COURSE
                    puckBearingEnabled = true
                }

                // Center camera to follow user
                mapViewportState.transitionToFollowPuckState()
            } else {
                // Disable puck & reset to HCMC
                mapView.location.updateSettings { enabled = false }
                mapViewportState.setCameraOptions(
                    CameraOptions.Builder()
                        .center(hcm)
                        .zoom(12.0)
                        .build()
                )
            }
        }
    }
}

 */


@Composable
fun MapScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val permission = Manifest.permission.ACCESS_FINE_LOCATION
    val mapViewportState = rememberMapViewportState{
        setCameraOptions {
            zoom(12.0)
            center(Point.fromLngLat(106.700981, 10.776889))
            pitch(0.0)
            bearing(0.0)
        }
    }
    val hasPermission = remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, permission) ==
                    PackageManager.PERMISSION_GRANTED
        )
    }
    // Launcher for requesting permission
    val requestPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission.value = granted
    }
    LaunchedEffect(Unit) {
        if (!hasPermission.value) {
            requestPermissionLauncher.launch(permission)
        }
    }

    MapboxMap(
        Modifier.fillMaxSize(),
        mapViewportState = mapViewportState){
        MapEffect(Unit) { mapView ->
            mapView.location.updateSettings {
                locationPuck = createDefault2DPuck(withBearing = true)
                enabled = true
                puckBearing = PuckBearing.COURSE
                puckBearingEnabled = true
            }
            mapViewportState.transitionToFollowPuckState()
    }
}}
