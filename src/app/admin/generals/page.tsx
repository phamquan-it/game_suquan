'use client';

import React from 'react';
import { Layout } from 'antd';
import GeneralTable from './components/GeneralTable';
import GeneralStatsCard from './components/GeneralStatsCard';

const { Content } = Layout;

export default function GeneralManagementPage() {
    return (
        <Layout style={{ minHeight: '100vh', background: '#F5F5DC' }}>
            <Content style={{ padding: '24px' }}>
                <GeneralStatsCard />
                <GeneralTable />
            </Content>
        </Layout>
    );
}
