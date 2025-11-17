package com.example.goscootandroid.EnvironmentObjects

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.goscootandroid.Models.Domains.BikeHub
import com.example.goscootandroid.Repository.Room.BikeHubDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Database(
    entities = [BikeHub::class],
    version = 1,
    exportSchema = true
)

abstract class AppDatabase : RoomDatabase() {
    abstract fun bikeHubDao(): BikeHubDao
}

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(
        @ApplicationContext appContext: Context
    ): AppDatabase {
        return Room.databaseBuilder(
            appContext,
            AppDatabase::class.java,
            "goscoot.db"
        ).build()
    }

    @Provides
    fun provideBikeHubDao(db: AppDatabase): BikeHubDao {
        return db.bikeHubDao()
    }
}