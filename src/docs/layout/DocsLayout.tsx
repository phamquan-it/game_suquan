import React, { useState } from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CrownOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import Sidebar from './Sidebar';
import Introduction from '../pages/Introduction';
import CoreConcepts from '../pages/CoreConcepts';
import LootBoxSystem from '../pages/LootBoxSystem';
import CurrencySystem from '../pages/CurrencySystem';
import UseCases from '../pages/UseCases';
import APIReference from '../pages/APIReference';
import Examples from '../pages/Examples';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const DocsLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('introduction');

    const renderPage = () => {
        switch (currentPage) {
            case 'introduction':
                return <Introduction />;
            case 'core-concepts':
                return <CoreConcepts />;
            case 'lootbox-system':
                return <LootBoxSystem />;
            case 'currency-system':
                return <CurrencySystem />;
            case 'use-cases':
                return <UseCases />;
            case 'api-reference':
                return <APIReference />;
            case 'examples':
                return <Examples />;
            default:
                return <Introduction />;
        }
    };

    return (
        <Layout className="min-h-screen bg-noble-ivory">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="bg-imperial-navy border-r border-imperial-gold"
                style={{ background: '#003366' }}
            >
                <div className="p-4 text-center border-b border-imperial-gold">
                    <Title level={4} className="text-imperial-gold m-0 font-imperial">
                        {collapsed ? '👑' : 'Imperial Economy'}
                    </Title>
                </div>
                <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
            </Sider>
            <Layout>
                <Header className="bg-imperial-red border-b border-imperial-gold px-6 flex items-center justify-between"
                    style={{ background: '#8B0000' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-imperial-gold text-lg w-16 h-16 hover:bg-imperial-navy"
                    />
                    <Space>
                        <Button
                            type="primary"
                            icon={<CrownOutlined />}
                            className="bg-imperial-gold text-imperial-red border-imperial-gold font-imperial font-bold hover:bg-yellow-500"
                            href="#examples"
                            onClick={() => setCurrentPage('examples')}
                        >
                            Royal Demo
                        </Button>
                    </Space>
                </Header>
                <Content className="m-6 p-6 bg-white rounded-lg imperial-border parchment-bg animate-fade-in">
                    {renderPage()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DocsLayout;
