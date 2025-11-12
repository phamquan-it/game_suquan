// components/admin/NotificationPanel.tsx
'use client';

import React, { useState, useRef } from 'react';
import {
    Badge,
    List,
    Tag,
    Button,
    Space,
    Divider,
    Avatar,
    Typography,
    Empty,
    Popover
} from 'antd';
import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Text, Paragraph } = Typography;

export interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
    avatar?: string;
}

interface NotificationPanelProps {
    trigger?: 'hover' | 'click';
    placement?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    trigger = 'hover',
    placement = 'bottomRight'
}) => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'success',
            title: 'Nhiệm vụ hoàn thành',
            description: 'Hồng Nhan "Tây Thi" đã hoàn thành nhiệm vụ ngoại giao biên cương',
            timestamp: '5 phút trước',
            read: false,
            action: {
                label: 'Xem chi tiết',
                onClick: () => router.push('/beauty-system/beauty_001')
            },
            avatar: '/images/beauties/tay-thi-avatar.jpg'
        },
        {
            id: '2',
            type: 'warning',
            title: 'Cảnh báo hệ thống',
            description: 'Máy chủ game đang có dấu hiệu quá tải. Vui lòng kiểm tra ngay.',
            timestamp: '15 phút trước',
            read: false,
            action: {
                label: 'Kiểm tra',
                onClick: () => router.push('/system/monitoring')
            }
        },
        {
            id: '3',
            type: 'info',
            title: 'Người chơi mới',
            description: 'Có 5 người chơi mới đăng ký trong vòng 1 giờ qua',
            timestamp: '1 giờ trước',
            read: true,
            action: {
                label: 'Xem báo cáo',
                onClick: () => router.push('/players')
            }
        },
        {
            id: '4',
            type: 'error',
            title: 'Lỗi giao dịch',
            description: 'Phát hiện giao dịch bất thường từ người chơi ID: PL12345',
            timestamp: '2 giờ trước',
            read: false,
            action: {
                label: 'Điều tra',
                onClick: () => router.push('/economy/transactions')
            }
        },
        {
            id: '5',
            type: 'success',
            title: 'Cập nhật thành công',
            description: 'Hệ thống đã được cập nhật lên phiên bản 2.1.0',
            timestamp: '3 giờ trước',
            read: true
        }
    ]);

    const [visible, setVisible] = useState(false);
    const popoverRef = useRef(null);

    // Đếm số thông báo chưa đọc
    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type: string) => {
        const icons = {
            success: <CheckCircleOutlined style={{ color: '#52C41A' }} />,
            info: <InfoCircleOutlined style={{ color: '#1890FF' }} />,
            warning: <ExclamationCircleOutlined style={{ color: '#FAAD14' }} />,
            error: <ExclamationCircleOutlined style={{ color: '#FF4D4F' }} />
        };
        return icons[type as keyof typeof icons];
    };

    const getNotificationColor = (type: string) => {
        const colors = {
            success: 'green',
            info: 'blue',
            warning: 'orange',
            error: 'red'
        };
        return colors[type as keyof typeof colors];
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const handleClearAll = () => {
        setNotifications([]);
        setVisible(false);
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }
        if (notification.action) {
            notification.action.onClick();
        }
        setVisible(false);
    };

    const notificationContent = (
        <div style={{ width: 400, maxHeight: 500, overflow: 'auto' }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F0F0F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text strong style={{ fontSize: '16px' }}>
                    Thông Báo
                </Text>
                <Space>
                    {unreadCount > 0 && (
                        <Button
                            type="link"
                            size="small"
                            onClick={handleMarkAllAsRead}
                            icon={<CheckOutlined />}
                        >
                            Đánh dấu đã đọc
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button
                            type="link"
                            size="small"
                            danger
                            onClick={handleClearAll}
                            icon={<DeleteOutlined />}
                        >
                            Xóa tất cả
                        </Button>
                    )}
                </Space>
            </div>

            {/* Notifications List */}
            {notifications.length > 0 ? (
                <List
                    dataSource={notifications}
                    renderItem={(notification) => (
                        <List.Item
                            style={{
                                padding: '12px 20px',
                                cursor: 'pointer',
                                backgroundColor: notification.read ? 'transparent' : '#F6FFED',
                                borderBottom: '1px solid #F0F0F0',
                                transition: 'all 0.3s ease'
                            }}
                            className="notification-item"
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div style={{ width: '100%' }}>
                                <Space align="start" size="middle" style={{ width: '100%' }}>
                                    {/* Avatar/Icon */}
                                    <div style={{ marginTop: 2 }}>
                                        {notification.avatar ? (
                                            <Avatar
                                                size={32}
                                                src={notification.avatar}
                                                style={{ border: `2px solid ${getNotificationColor(notification.type)}` }}
                                            />
                                        ) : (
                                            <Avatar
                                                size={32}
                                                icon={getNotificationIcon(notification.type)}
                                                style={{
                                                    backgroundColor: `${getNotificationColor(notification.type)}10`,
                                                    color: getNotificationColor(notification.type)
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Space size="small" style={{ marginBottom: 4 }}>
                                            <Text strong style={{ fontSize: '14px' }}>
                                                {notification.title}
                                            </Text>
                                            {!notification.read && (
                                                <Badge dot size="small" color={getNotificationColor(notification.type)} />
                                            )}
                                        </Space>

                                        <Paragraph
                                            ellipsis={{ rows: 2 }}
                                            style={{
                                                margin: 0,
                                                fontSize: '13px',
                                                color: '#666',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {notification.description}
                                        </Paragraph>

                                        <Space size="small" style={{ marginTop: 8 }}>
                                            <Tag
                                                color={getNotificationColor(notification.type)}
                                                style={{ margin: 0, fontSize: '11px' }}
                                            >
                                                {notification.type === 'success' ? 'Thành công' :
                                                    notification.type === 'info' ? 'Thông tin' :
                                                        notification.type === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                                            </Tag>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                {notification.timestamp}
                                            </Text>
                                        </Space>

                                        {notification.action && (
                                            <div style={{ marginTop: 8 }}>
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    style={{
                                                        padding: 0,
                                                        height: 'auto',
                                                        fontSize: '12px',
                                                        color: getNotificationColor(notification.type)
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        notification.action?.onClick();
                                                        setVisible(false);
                                                    }}
                                                >
                                                    {notification.action.label} →
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <Space direction="vertical" size={2}>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CheckOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification.id);
                                            }}
                                            style={{
                                                color: notification.read ? '#BFBFBF' : '#52C41A',
                                                width: 24,
                                                height: 24
                                            }}
                                        />
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(notification.id);
                                            }}
                                            style={{
                                                color: '#FF4D4F',
                                                width: 24,
                                                height: 24
                                            }}
                                        />
                                    </Space>
                                </Space>
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có thông báo nào"
                    style={{ padding: '40px 0' }}
                />
            )}

            {/* Footer */}
            {notifications.length > 0 && (
                <>
                    <Divider style={{ margin: 0 }} />
                    <div style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <Button
                            type="link"
                            onClick={() => router.push('/notifications')}
                            style={{ fontSize: '13px' }}
                        >
                            Xem tất cả thông báo
                        </Button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <Popover
            ref={popoverRef}
            content={notificationContent}
            trigger={trigger}
            placement={placement}
            open={visible}
            onOpenChange={setVisible}
            overlayStyle={{ padding: 0 }}
            overlayInnerStyle={{ padding: 0 }}
        >
            <Badge
                count={unreadCount}
                size="small"
                offset={[-2, 2]}
                style={{
                    backgroundColor: '#FF4D4F',
                    boxShadow: '0 0 0 1px #fff'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: visible ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                    }}
                    className="notification-trigger"
                >
                    <BellOutlined style={{
                        color: 'white',
                        fontSize: 18,
                        transition: 'all 0.3s ease'
                    }} />
                </div>
            </Badge>
        </Popover>
    );
};

export default NotificationPanel;
