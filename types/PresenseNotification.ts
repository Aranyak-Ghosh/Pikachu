"use strict";
enum NotificationType {
    Added = "Added",
    Removed = "Removed",
}

interface NotificationEntity {
    EntityType: string;
    EntityId: string;
}

interface PresenseUpdate {
    UserId: string;
    NotificationType: NotificationType;
    NotifiedEntities: Array<NotificationEntity>;
}

export type { PresenseUpdate, NotificationEntity };
export { NotificationType };
