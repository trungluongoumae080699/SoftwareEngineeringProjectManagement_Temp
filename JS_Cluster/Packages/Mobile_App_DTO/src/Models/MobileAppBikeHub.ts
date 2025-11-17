export enum SyncStatus {
    NEW = "New",
    UPDATED = "Updated",
    DELETED = "Deleted"
}

export type MobileAppBikeHub = {
    id: string,
    longitude: number,
    latitude: number,
    syncStatus: SyncStatus

    
}