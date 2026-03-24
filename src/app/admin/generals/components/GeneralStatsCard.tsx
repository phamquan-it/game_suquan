'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  StarOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  FireOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useGeneralStats } from '../hooks/useGenerals';

const GeneralStatsCard: React.FC = () => {
  const { data: stats, isLoading } = useGeneralStats();

  if (isLoading || !stats) {
    return null;
  }

  return (
    <Card style={{ borderRadius: 12, border: '1px solid #F1E8D6', marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={4}>
          <Statistic
            title="Tổng số tướng"
            value={stats.totalGenerals}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#8B0000' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Huyền thoại"
            value={stats.totalLegendary}
            prefix={<CrownOutlined />}
            valueStyle={{ color: '#FFA500' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Thần thoại"
            value={stats.totalMythic}
            prefix={<StarOutlined />}
            valueStyle={{ color: '#DC143C' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Cấp TB"
            value={stats.avgLevel}
            precision={1}
            prefix={<ThunderboltOutlined />}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Sức mạnh TB"
            value={stats.avgPower}
            prefix={<FireOutlined />}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Nguyên tố phổ biến"
            value={stats.mostCommonElement}
            prefix={<TeamOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default GeneralStatsCard;
