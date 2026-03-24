'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BankOutlined, ExpandOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { useRegions } from '../hooks/useRegions';

const RegionStats: React.FC = () => {
  const { data: regions } = useRegions();

  // Calculate stats
  const totalRegions = regions?.length || 0;
  const totalBuildings = 0; // This would need a separate query
  const totalExpansionSlots = 0; // This would need a separate query
  const uniqueLords = regions ? new Set(regions.map(r => r.lord_name)).size : 0;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)' }}>
          <Statistic
            title="Total Regions"
            value={totalRegions}
            prefix={<ShopOutlined style={{ color: '#8B0000' }} />}
            valueStyle={{ color: '#003366' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)' }}>
          <Statistic
            title="Total Buildings"
            value={totalBuildings}
            prefix={<BankOutlined style={{ color: '#8B0000' }} />}
            valueStyle={{ color: '#003366' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)' }}>
          <Statistic
            title="Expansion Slots"
            value={totalExpansionSlots}
            prefix={<ExpandOutlined style={{ color: '#8B0000' }} />}
            valueStyle={{ color: '#003366' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)' }}>
          <Statistic
            title="Unique Lords"
            value={uniqueLords}
            prefix={<UserOutlined style={{ color: '#8B0000' }} />}
            valueStyle={{ color: '#003366' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default RegionStats;
