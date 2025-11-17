package com.example.goscootandroid.Presentation.Screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.goscootandroid.EnvironmentObjects.LocalGlobalViewModelProvider
import com.example.goscootandroid.Presentation.Components.Inputs.BrandButton
import com.example.goscootandroid.Presentation.Components.Modules.Cards.TripCard
import com.example.goscootandroid.Presentation.ViewModel.SnackbarType
import com.example.goscootandroid.Presentation.ViewModel.TripManagementViewModel
import com.example.goscootandroid.Repository.Retrofit.ApiError
import com.example.goscootandroid.Repository.Retrofit.UnAuthorizedError
import kotlinx.coroutines.launch

@Preview
@Composable
fun MyTrips(
    vm: TripManagementViewModel = hiltViewModel(),
){
    val globalVM = LocalGlobalViewModelProvider.current
    val sessionId by globalVM.sessionId.collectAsState()
    val trips by vm.trips.collectAsState()
    val pageGroup by vm.pageGroup.collectAsState()
    val currentPage by vm.currentPage.collectAsState()
    val toFetchTrips by vm.toFetchTrips.collectAsState()
    val pageGroupIndex by vm.currentPageGroupIndex.collectAsState()
    val context = LocalContext.current
    val snackbarHostState = remember { SnackbarHostState() }

    val scope = rememberCoroutineScope()

    LaunchedEffect(toFetchTrips) {
        if (toFetchTrips){
            try {
                vm.fetchTrips(
                    context,
                    sessionId as String
                )
            } catch (err: Error){
                val msg = when (err) {
                    is UnAuthorizedError -> err.msg
                    is ApiError -> err.messageText
                    else -> "Đã xảy ra lỗi. Xin vui lòng thử lại"
                }

                scope.launch {
                    globalVM.updateSnackBarType(SnackbarType.Error)
                    scope.launch {
                        launch {
                            snackbarHostState.showSnackbar(
                                message = msg,
                                withDismissAction = true,
                                duration = SnackbarDuration.Short
                            )
                        }

                    }
                }
            } finally {
                vm.updateToFetchTrips(false)
            }
        }


    }
    Scaffold(modifier = Modifier.background(Color.White)) {
            padding ->
        Column(
            modifier = Modifier.fillMaxSize().background(Color.White).padding(PaddingValues(start = 16.dp, end = 16.dp, bottom = 16.dp))) {
            Spacer(modifier = Modifier.height(30.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.height(70.dp),
            ){
                Text("Lịch Sử", style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.W800
                ), modifier = Modifier.fillMaxWidth().weight(1f))
                Row(modifier = Modifier.width(120.dp)){
                    BrandButton(
                        label = "Scan QR",
                        icon = Icons.Filled.QrCodeScanner,
                        contentPadding = PaddingValues(vertical = 5.dp),
                        iconModifier = Modifier.padding(horizontal = 5.dp),
                        onClick = {}
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Row(modifier = Modifier.width(120.dp)){
                    BrandButton(
                        label = "Đặt Xe",
                        icon = Icons.Filled.CalendarMonth,
                        contentPadding = PaddingValues(vertical = 5.dp),
                        iconModifier = Modifier.padding(horizontal = 5.dp),
                        onClick = {}
                    )
                }



            }

            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.weight(1f)){
                items(trips, key = {it.trip.id}){
                    trip -> TripCard(trip) { }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier
                    .height(30.dp)
                    .fillMaxWidth()
            ) {
                IconButton(
                    onClick = { /* your logic */ },
                    modifier = Modifier.size(30.dp).background(Color(0xFFDF6C20)).padding(0.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.SkipPrevious,
                        contentDescription = "Prev"
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))

                LazyRow {
                    items(pageGroup[pageGroupIndex], key = { it }) { page ->
                        IconButton(
                            onClick = {
                                vm.updateCurrentPage(page)
                                vm.updateToFetchTrips(true)
                            },
                            modifier = Modifier.size(30.dp).background(Color(0xFFDF6C20)).padding(0.dp),
                            enabled = currentPage != page
                        ) {
                            Text(
                                text = "$page",
                                color = Color.White,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    fontWeight = FontWeight.W600,
                                    lineHeight = 1.sp
                                )
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                    }
                }

                IconButton(
                    onClick = { /* your logic */ },
                    modifier = Modifier.size(30.dp).background(Color(0xFFDF6C20)).padding(0.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.SkipNext,
                        contentDescription = "Prev"
                    )
                }

            }



        }
    }
}