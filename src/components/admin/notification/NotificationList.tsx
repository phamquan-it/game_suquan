'use client';

import React from 'react';
import { List, Empty, Typography } from 'antd';
import { SystemNotification } from '@/types/notification';
import NotificationItem from './NotificationItem';

const { Text } = Typography;

interface NotificationListProps {
    notifications: SystemNotification[];
    emptyText: string;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NotificationList({
    notifications,
    emptyText,
    onMarkAsRead,
    onDelete
}: NotificationListProps) {
    if (notifications.length === 0) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <Text type="secondary">{emptyText}</Text>
                }
                style={{
                    marginTop: 80,
                    marginBottom: 80
                }}
            />
        );
    }

    return (
        <List
            dataSource={notifications}
            renderItem={(notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                />
            )}
            style={{ marginTop: 16 }}
        />
    );
}
