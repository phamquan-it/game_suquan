'use client';

import React from 'react';
import { Menu } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    FireOutlined,
    DollarOutlined,
    SettingOutlined,
    CrownOutlined,
    TrophyOutlined,
    GiftOutlined,
    SmileOutlined,
    IdcardOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const menuItems = [
    {
        key: '/admin',
        icon: <DashboardOutlined />,
        label: 'Tổng Quan',
    },
    {
        key: '/admin/players',
        icon: <UserOutlined />,
        label: 'Quản Lý Người Chơi',
    },
    {
        key: '/admin/profile',
        icon: <IdcardOutlined />,
        label: 'Hồ Sơ',
    },
    {
        key: '/admin/alliances',
        icon: <TeamOutlined />,
        label: 'Liên Minh',
    },
       {
        key: '/admin/generals',
        icon: <CrownOutlined />,
        label: 'Danh Tướng',
    },
    {
        key: '/admin/beauty',
        icon: <SmileOutlined />,
        label: 'Mỹ Nhân',
    },
    {
        key: '/admin/battles',
        icon: <FireOutlined />,
        label: 'Chiến Trường',
    },
    {
        key: '/admin/quests/daily',
        icon: <FireOutlined />,
        label: 'Nhiệm vụ Hằng Ngày',
    },
    {
        key: '/admin/loot-boxes',
        icon: <GiftOutlined />,
        label: 'Rương & Vật Phẩm',
    },
    {
        key: '/admin/economy',
        icon: <DollarOutlined />,
        label: 'Kinh Tế',
    },
    {
        key: '/admin/achievements',
        icon: <TrophyOutlined />,
        label: 'Thành Tựu',
    },
    {
        key: '/admin/system',
        icon: <SettingOutlined />,
        label: 'Hệ Thống',
    },
];

interface AdminSidebarProps {
    collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div style={{ padding: '16px 0' }}>
            {/* Logo */}
            <div style={{
                padding: '16px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 16
            }}>
                <CrownOutlined style={{ fontSize: 32, color: '#D4AF37' }} />
                {!collapsed && (
                    <div style={{ color: 'white', marginTop: 8, fontWeight: 'bold' }}>
                        12 SỨ QUÂN
                    </div>
                )}
            </div>

            <Menu
                theme="dark"
                selectedKeys={[pathname]}
                mode="inline"
                items={menuItems}
                onClick={({ key }) => router.push(key)}
                style={{
                    background: 'transparent',
                    border: 'none'
                }}
            />
        </div>
    );
}
