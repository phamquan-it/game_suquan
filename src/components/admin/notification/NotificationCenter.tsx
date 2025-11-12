'use client';

import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Tabs,
    Button,
    Space,
    Typography,
    Tag,
    Empty,
    Switch,
    message
} from 'antd';
import {
    CloseOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    BellOutlined,
    WarningOutlined,
    SecurityScanOutlined,
    TeamOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { mockNotifications, generateNewNotification } from '@/lib/utils/notification-utils';
import NotificationList from './NotificationList';
import { SystemNotification } from '@/types/notification';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface NotificationCenterProps {
    visible: boolean;
    onClose: () => void;
}

export default function NotificationCenter({ visible, onClose }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<SystemNotification[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        // Load initial notifications
        setNotifications(mockNotifications);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (autoRefresh && visible) {
            interval = setInterval(() => {
                // Simulate new notifications
                if (Math.random() > 0.7) { // 30% chance every 10 seconds
                    const newNotif = generateNewNotification();
                    setNotifications(prev => [newNotif, ...prev]);
                    message.info(`Có thông báo mới: ${newNotif.title}`);
                }
            }, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, visible]);

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.status === 'unread' ? { ...notif, status: 'read' } : notif
            )
        );
        message.success('Đã đánh dấu tất cả là đã đọc');
    };

    const handleClearAll = () => {
        setNotifications([]);
        message.success('Đã xóa tất cả thông báo');
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, status: 'read' } : notif
            )
        );
    };

    const handleDeleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        message.success('Đã xóa thông báo');
    };

    const getNotificationsByType = (type: string): SystemNotification[] => {
        if (type === 'all') return notifications;
        if (type === 'unread') return notifications.filter(n => n.status === 'unread');
        return notifications.filter(n => n.type === type);
    };

    const getTabIcon = (type: string) => {
        switch (type) {
            case 'all': return <BellOutlined />;
            case 'unread': return <WarningOutlined />;
            case 'system': return <DashboardOutlined />;
            case 'security': return <SecurityScanOutlined />;
            case 'player': return <TeamOutlined />;
            default: return <BellOutlined />;
        }
    };

    const tabItems = [
        { key: 'all', label: 'Tất cả', count: notifications.length },
        { key: 'unread', label: 'Chưa đọc', count: unreadCount },
        { key: 'system', label: 'Hệ thống', count: notifications.filter(n => n.type === 'system').length },
        { key: 'security', label: 'Bảo mật', count: notifications.filter(n => n.type === 'security').length },
        { key: 'player', label: 'Người chơi', count: notifications.filter(n => n.type === 'player').length },
        { key: 'alliance', label: 'Liên minh', count: notifications.filter(n => n.type === 'alliance').length },
        { key: 'battle', label: 'Chiến trận', count: notifications.filter(n => n.type === 'battle').length },
        { key: 'economy', label: 'Kinh tế', count: notifications.filter(n => n.type === 'economy').length },
    ];

    return (
        <Drawer
            title={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <BellOutlined />
                        {unreadCount > 0 && (
                            <Tag color="red">{unreadCount} chưa đọc</Tag>
                        )}
                    </Space>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                    />
                </Space>
            }
            placement="right"
            closable={false}
            onClose={onClose}
            open={visible}
            width={600}
            extra={
                <Space>
                    <Space size={4}>
                        <Text type="secondary">Tự động làm mới</Text>
                        <Switch
                            size="small"
                            checked={autoRefresh}
                            onChange={setAutoRefresh}
                        />
                    </Space>
                    <Button
                        icon={<CheckCircleOutlined />}
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Đánh dấu đã đọc
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={handleClearAll}
                        disabled={notifications.length === 0}
                        danger
                    >
                        Xóa tất cả
                    </Button>
                </Space>
            }
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="middle"
                style={{ marginTop: -16 }}
                items={tabItems.map(tab => ({
                    key: tab.key,
                    label: (
                        <Space size={4}>
                            {getTabIcon(tab.key)}
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <Tag
                                    color={tab.key === 'unread' ? 'red' : 'default'}
                                    style={{
                                        fontSize: '10px',
                                        lineHeight: '14px',
                                        minWidth: 20,
                                        height: 16,
                                        padding: '0 4px'
                                    }}
                                >
                                    {tab.count}
                                </Tag>
                            )}
                        </Space>
                    ),
                    children: (
                        <NotificationList
                            notifications={getNotificationsByType(tab.key)}
                            emptyText={`Không có thông báo ${tab.label.toLowerCase()}`}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDeleteNotification}
                        />
                    )
                }))}


            />
        </Drawer>
    );
}
