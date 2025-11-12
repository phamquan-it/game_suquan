'use client';

import React from 'react';
import {
    Card,
    Space,
    Typography,
    Tag,
    Button,
    Dropdown
} from 'antd';
import {
    CheckOutlined,
    DeleteOutlined,
    MoreOutlined,
    ClockCircleOutlined,
    WarningOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { SystemNotification, NotificationType, NotificationPriority } from '@/lib/types/notification';
import { getPriorityColor, getTypeColor, formatTime } from '@/lib/utils/notification-utils';

const { Text, Paragraph } = Typography;

interface NotificationItemProps {
    notification: SystemNotification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete
}: NotificationItemProps) {
    const getTypeIcon = (type: NotificationType) => {
        switch (type) {
            case 'system': return <InfoCircleOutlined />;
            case 'security': return <WarningOutlined />;
            case 'critical': return <WarningOutlined />;
            default: return <InfoCircleOutlined />;
        }
    };

    const handleMarkAsRead = () => {
        onMarkAsRead(notification.id);
    };

    const handleDelete = () => {
        onDelete(notification.id);
    };

    const menuItems = [
        {
            key: 'mark-read',
            icon: <CheckOutlined />,
            label: 'Đánh dấu đã đọc',
            onClick: handleMarkAsRead,
            disabled: notification.status === 'read'
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Xóa thông báo',
            onClick: handleDelete,
            danger: true
        }
    ];

    return (
        <Card
            size="small"
            style={{
                marginBottom: 8,
                borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                ...(notification.status === 'unread' && {
                    backgroundColor: '#f9f0ff',
                    borderColor: '#d6e4ff'
                })
            }}
            bodyStyle={{ padding: '12px 16px' }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Space size={8}>
                        {getTypeIcon(notification.type)}
                        <Text strong style={{ fontSize: '14px' }}>
                            {notification.title}
                        </Text>
                    </Space>

                    <Space size={4}>
                        <Tag
                            color={getTypeColor(notification.type)}
                        >
                            {notification.type}
                        </Tag>
                        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                            <Button
                                type="text"
                                icon={<MoreOutlined />}
                                size="small"
                            />
                        </Dropdown>
                    </Space>
                </div>

                {/* Message */}
                <Paragraph
                    style={{
                        margin: 0,
                        fontSize: '13px',
                        color: notification.status === 'unread' ? '#000000' : '#666666'
                    }}
                >
                    {notification.message}
                </Paragraph>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={8}>
                        <Tag
                            color={getPriorityColor(notification.priority)}
                        >
                            {notification.priority.toUpperCase()}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                            {notification.source}
                        </Text>
                    </Space>

                    <Space size={4}>
                        <ClockCircleOutlined style={{ fontSize: '11px', color: '#999' }} />
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                            {formatTime(notification.timestamp)}
                        </Text>
                    </Space>
                </div>

                {/* Action Button */}
                {notification.actionUrl && (
                    <div style={{ textAlign: 'right' }}>
                        <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                            Xem chi tiết →
                        </Button>
                    </div>
                )}
            </Space>
        </Card>
    );
}
