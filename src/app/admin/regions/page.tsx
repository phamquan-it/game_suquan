'use client';

import React, { useState } from 'react';
import { Layout, Tabs, Breadcrumb } from 'antd';
import { HomeOutlined, BankOutlined } from '@ant-design/icons';
import RegionTable from './components/RegionTable';
import RegionBuildings from './components/RegionBuildings';
import RegionExpansion from './components/RegionExpansion';
import RegionStats from './components/RegionStats';
import { Region } from './types/region.types';
import { useRegionById } from './hooks/useRegions';

const { Content } = Layout;

export default function RegionsPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [buildingsModalVisible, setBuildingsModalVisible] = useState(false);
  const [expansionModalVisible, setExpansionModalVisible] = useState(false);

  const { data: regionDetails } = useRegionById(selectedRegion?.id || '');

  const handleViewBuildings = (region: Region) => {
    setSelectedRegion(region);
    setBuildingsModalVisible(true);
  };

  const handleViewExpansion = (region: Region) => {
    setSelectedRegion(region);
    setExpansionModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5DC' }}>
      <Content style={{ padding: '24px' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item href="/admin">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Regions</Breadcrumb.Item>
        </Breadcrumb>

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: (
                <span>
                  <BankOutlined />
                  Regions Overview
                </span>
              ),
              children: (
                <>
                  <RegionStats />
                  <RegionTable
                    onViewBuildings={handleViewBuildings}
                    onViewExpansion={handleViewExpansion}
                  />
                </>
              ),
            },
            {
              key: '2',
              label: 'Building Types',
              children: <div>Building Types Configuration (Coming Soon)</div>,
            },
            {
              key: '3',
              label: 'Resource Types',
              children: <div>Resource Types Configuration (Coming Soon)</div>,
            },
          ]}
          style={{ background: '#FFFFFF', padding: '20px', borderRadius: 12 }}
        />

        <RegionBuildings
          visible={buildingsModalVisible}
          onClose={() => setBuildingsModalVisible(false)}
          region={selectedRegion}
          buildings={regionDetails?.buildings}
        />

        <RegionExpansion
          visible={expansionModalVisible}
          onClose={() => setExpansionModalVisible(false)}
          region={selectedRegion}
          expansionCosts={regionDetails?.expansion_costs}
        />
      </Content>
    </Layout>
  );
}
