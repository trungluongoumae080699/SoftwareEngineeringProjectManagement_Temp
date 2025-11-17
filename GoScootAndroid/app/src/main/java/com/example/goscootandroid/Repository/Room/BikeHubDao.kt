package com.example.goscootandroid.Repository.Room

import androidx.room.*
import com.example.goscootandroid.Models.Domains.BikeHub

@Dao
interface BikeHubDao {

    @Query("SELECT * FROM bike_hubs")
    suspend fun getAll(): List<BikeHub>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(hubs: List<BikeHub>)
}