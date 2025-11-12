'use client';

import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';

const routeNames: { [key: string]: string } = {
    '/admin/dashboard': 'Tổng Quan',
    '/admin/players': 'Quản Lý Người Chơi',
    '/admin/alliances': 'Liên Minh',
    '/admin/battles': 'Chiến Trường',
    '/admin/economy': 'Kinh Tế',
    '/admin/system': 'Hệ Thống',
};

export default function BreadcrumbNav() {
    const pathname = usePathname();

    const breadcrumbItems = [
        {
            title: <HomeOutlined />,
            href: '/admin/dashboard',
        },
        ...pathname.split('/').filter(Boolean).slice(1).map((segment, index, arr) => {
            const path = `/admin/${arr.slice(0, index + 1).join('/')}`;
            return {
                title: routeNames[path] || segment,
            };
        }),
    ];

    return (
        <Breadcrumb
            items={breadcrumbItems}
            style={{ margin: '16px 0' }}
        />
    );
}
