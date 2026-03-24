'use client';

import React from 'react';
import { Layout } from 'antd';
import BuildingTable from './compoments/BuildingTable';

const { Content } = Layout;


export default function BuildingManagementPage() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5DC' }}>
      <Content style={{ padding: '24px' }}>
        <BuildingTable />
      </Content>
    </Layout>
  );
}
