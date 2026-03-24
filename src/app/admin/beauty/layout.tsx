'use client';

import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    DashboardOutlined,
    GiftOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { Header, Content } = Layout;

export default function BeautyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        {
            key: '/admin/beauty',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/beauty/characters',
            icon: <UserOutlined />,
            label: 'Characters',
        },
        {
            key: '/admin/beauty/gifts',
            icon: <GiftOutlined />,
            label: 'Gifts',
        },
        {
            key: '/admin/beauty/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    return (
        <ConfigProvider theme={theme}>
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    background: '#8B0000', // imperialRed
                    height: 64,
                }}>
                    {/* Logo bên trái */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginRight: 48 
                    }}>
                        <img src="/logo.png" alt="Logo" style={{ height: 40, marginRight: 16 }} />
                        <span style={{ 
                            color: '#D4AF37', 
                            fontSize: 20, 
                            fontWeight: 'bold' 
                        }}>
                            Beauty Management System
                        </span>
                    </div>

                    {/* Menu ngang ở giữa */}
                    <Menu
                        mode="horizontal"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        onClick={({ key }) => router.push(key)}
                        theme="dark"
                        style={{
                            flex: 1,
                            background: 'transparent',
                            borderBottom: 'none',
                            minWidth: 0,
                        }}
                    />

                    {/* Có thể thêm user info bên phải nếu cần */}
                    <div style={{ 
                        color: '#D4AF37',
                        fontSize: 14 
                    }}>
                        Admin
                    </div>
                </Header>

                <Content style={{
                    background: '#F5F5DC',
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}>
                    {children}
                </Content>
            </Layout>
        </ConfigProvider>
    );
}
