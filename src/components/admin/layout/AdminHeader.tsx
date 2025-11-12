'use client';

import React, { useState } from 'react';
import { Layout, Avatar, Dropdown, Space } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import NotificationBell from './NotificationBell';
import NotificationCenter from '../notification/NotificationCenter';

const { Header } = Layout;

export default function AdminHeader() {
    const router = useRouter();
    const [notificationCenterVisible, setNotificationCenterVisible] = useState(false);

    const handleMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'profile':
                router.push('/admin/profile');
                break;
            case 'settings':
                // Handle settings
                break;
            case 'logout':
                // Handle logout
                break;
        }
    };

    const handleShowNotificationCenter = () => {
        setNotificationCenterVisible(true);
    };

    return (
        <>
            <Header style={{
                padding: '0 24px',
                background: '#8B0000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                    Quản Trị 12 Sứ Quân
                </div>

                <Space size="large">
                    <NotificationBell onShowNotificationCenter={handleShowNotificationCenter} />

                    <Dropdown menu={{
                        items: [
                            {
                                key: 'profile',
                                icon: <UserOutlined />,
                                label: 'Hồ sơ',
                            },
                            {
                                key: 'settings',
                                icon: <SettingOutlined />,
                                label: 'Cài đặt',
                            },
                            {
                                type: 'divider',
                            },
                            {
                                key: 'logout',
                                icon: <LogoutOutlined />,
                                label: 'Đăng xuất',
                                danger: true,
                            },
                        ],
                        onClick: handleMenuClick
                    }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#D4AF37' }}
                            />
                            <span style={{ color: 'white' }}>Admin</span>
                        </Space>
                    </Dropdown>
                </Space>
            </Header>

            <NotificationCenter
                visible={notificationCenterVisible}
                onClose={() => setNotificationCenterVisible(false)}
            />
        </>
    );
}
