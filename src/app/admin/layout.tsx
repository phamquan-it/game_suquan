'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
