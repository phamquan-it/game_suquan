export type NotificationType = 'system' | 'security' | 'player' | 'alliance' | 'battle' | 'economy' | 'maintenance';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface SystemNotification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    status: NotificationStatus;
    timestamp: string;
    source: string;
    actionUrl?: string;
    metadata?: {
        serverId?: string;
        playerId?: string;
        allianceId?: string;
        battleId?: string;
        transactionId?: string;
        errorCode?: string;
    };
    expiresAt?: string;
}

export interface NotificationState {
    notifications: SystemNotification[];
    unreadCount: number;
    isCenterVisible: boolean;
    lastFetched: string | null;
}
