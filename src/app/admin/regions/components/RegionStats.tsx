'use client';

import React, { useMemo, memo } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BankOutlined, ExpandOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { useRegions } from '../hooks/useRegions';

const RegionStats: React.FC = () => {
  const { data: regions } = useRegions();

  // Memoize stats calculations to prevent recalculations on every render
  const stats = useMemo(() => {
    if (!regions) {
      return {
        totalRegions: 0,
        totalBuildings: 0,
        totalExpansionSlots: 0,
        uniqueLords: 0,
      };
    }

    const totalRegions = regions.length;

    // Calculate unique lords using Set for O(n) complexity
    const uniqueLords = new Set(regions.map(r => r.lord_name)).size;

    return {
      totalRegions,
      totalBuildings: 0, // Would come from a separate optimized query
      totalExpansionSlots: 0, // Would come from a separate optimized query
      uniqueLords,
    };
  }, [regions]);

  // Memoize card configurations to prevent object recreation
  const cardsConfig = useMemo(() => [
    {
      key: 'total-regions',
      title: 'Total Regions',
      value: stats.totalRegions,
      prefix: <ShopOutlined style={{ color: '#8B0000' }} />,
      xs: 24,
      sm: 12,
      lg: 6,
    },
    {
      key: 'total-buildings',
      title: 'Total Buildings',
      value: stats.totalBuildings,
      prefix: <BankOutlined style={{ color: '#8B0000' }} />,
      xs: 24,
      sm: 12,
      lg: 6,
    },
    {
      key: 'expansion-slots',
      title: 'Expansion Slots',
      value: stats.totalExpansionSlots,
      prefix: <ExpandOutlined style={{ color: '#8B0000' }} />,
      xs: 24,
      sm: 12,
      lg: 6,
    },
    {
      key: 'unique-lords',
      title: 'Unique Lords',
      value: stats.uniqueLords,
      prefix: <UserOutlined style={{ color: '#8B0000' }} />,
      xs: 24,
      sm: 12,
      lg: 6,
    },
  ], [stats]);

  // Memoize card styles to prevent recreation
  const cardStyle = useMemo(() => ({
    boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)'
  }), []);

  const valueStyle = useMemo(() => ({
    color: '#003366'
  }), []);

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {cardsConfig.map((config) => (
        <Col
          key={config.key}
          xs={config.xs}
          sm={config.sm}
          lg={config.lg}
        >
          <Card variant="borderless" style={cardStyle}>
            <Statistic
              title={config.title}
              value={config.value}
              prefix={config.prefix}
              valueStyle={valueStyle}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(RegionStats);
