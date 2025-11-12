'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, Button, Space, Typography, Divider } from 'antd';
import {
    BellOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { SystemNotification, NotificationPriority } from '@/lib/types/notification';
import { mockNotifications, getPriorityColor, formatTime } from '@/lib/utils/notification-utils';

const { Text } = Typography;

interface NotificationBellProps {
    onShowNotificationCenter: () => void;
}

export default function NotificationBell({ onShowNotificationCenter }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<SystemNotification[]>([]);

    useEffect(() => {
        // Load mock data
        setNotifications(mockNotifications);
    }, []);

    const unreadCount = notifications.filter(n => n.status === 'unread').length;
    const criticalNotifications = notifications.filter(n => n.priority === 'critical' && n.status === 'unread');
    const unreadNotifications = notifications.filter(n => n.status === 'unread').slice(0, 3);

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, status: 'read' } : notif
            )
        );
    };

    const dropdownItems = [
        {
            key: 'header',
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Thông báo hệ thống</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {unreadCount} chưa đọc
                    </Text>
                </div>
            ),
            disabled: true,
        },
        ...(criticalNotifications.length > 0 ? [
            {
                key: 'critical-section',
                label: (
                    <Space>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        <Text type="danger">Cảnh báo quan trọng</Text>
                    </Space>
                ),
                disabled: true,
            },
            ...criticalNotifications.slice(0, 2).map(notif => ({
                key: `critical-${notif.id}`,
                label: (
                    <div
                        style={{ maxWidth: 300, cursor: 'pointer' }}
                        onClick={() => handleMarkAsRead(notif.id)}
                    >
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 8
                            }}>
                                <Text strong style={{ fontSize: '12px', lineHeight: 1.2 }}>
                                    {notif.title}
                                </Text>
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: getPriorityColor(notif.priority),
                                        flexShrink: 0,
                                        marginTop: 4
                                    }}
                                />
                            </div>
                            <Text type="secondary" style={{ fontSize: '11px', lineHeight: 1.2 }}>
                                {notif.message}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>
                                {formatTime(notif.timestamp)}
                            </Text>
                        </Space>
                    </div>
                ),
            }))
        ] : []),
        ...(unreadNotifications.length > 0 ? [
            {
                type: 'divider' as const,
            },
            {
                key: 'recent-section',
                label: 'Thông báo gần đây',
                disabled: true,
            },
            ...unreadNotifications.map(notif => ({
                key: `recent-${notif.id}`,
                label: (
                    <div
                        style={{ maxWidth: 300, cursor: 'pointer' }}
                        onClick={() => handleMarkAsRead(notif.id)}
                    >
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text strong style={{ fontSize: '12px', lineHeight: 1.2 }}>
                                    {notif.title}
                                </Text>
                                <div
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: getPriorityColor(notif.priority),
                                        flexShrink: 0,
                                        marginTop: 4
                                    }}
                                />
                            </div>
                            <Text type="secondary" style={{ fontSize: '11px', lineHeight: 1.2 }}>
                                {notif.message}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>
                                {formatTime(notif.timestamp)}
                            </Text>
                        </Space>
                    </div>
                ),
            }))
        ] : []),
        {
            type: 'divider' as const,
        },
        {
            key: 'view-all',
            label: (
                <Button
                    type="link"
                    style={{ padding: 0, height: 'auto' }}
                    onClick={onShowNotificationCenter}
                >
                    Xem tất cả thông báo
                </Button>
            ),
        }
    ];

    return (
        <Dropdown
            menu={{ items: dropdownItems }}
            trigger={['click']}
            placement="bottomRight"
            overlayStyle={{ width: 350 }}
            disabled={notifications.length === 0}
        >
            <Badge
                count={unreadCount}
                size="small"
                offset={[-2, 2]}
                className={criticalNotifications.length > 0 ? 'critical-badge' : ''}
                style={{ cursor: 'pointer' }}
            >
                <BellOutlined
                    style={{
                        color: criticalNotifications.length > 0 ? '#ffa39e' : 'white',
                        fontSize: 18,
                        cursor: 'pointer'
                    }}
                />
            </Badge>

        </Dropdown>
    );
}
