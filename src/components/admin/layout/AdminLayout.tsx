'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import BreadcrumbNav from './BreadcrumbNav';

const { Content, Sider } = Layout;

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ maxHeight: '100vh', overflow: "hidden" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={280}
                style={{
                    background: '#003366',
                }}
            >
                <AdminSidebar collapsed={collapsed} />
            </Sider>

            <Layout>
                <AdminHeader />
                <Content style={{ margin: '0 0 0 16px' }} className="h-screen overflow-auto">
                    <div
                        style={{
                            padding: 24,
                            background: '#F5F5DC',
                            minHeight: 360,
                            borderRadius: 12,
                        }}
                    >
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
