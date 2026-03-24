'use client';

import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  CheckCircleOutlined, 
  StopOutlined, 
  BarsOutlined,
  FireOutlined 
} from '@ant-design/icons';
import { Quest } from '../types';

interface QuestStatsProps {
  quests: Quest[];
}

export const QuestStats: React.FC<QuestStatsProps> = ({ quests }) => {
  const totalQuests = quests.length;
  const activeQuests = quests.filter(q => q.status === 'active').length;
  const inactiveQuests = quests.filter(q => q.status === 'inactive').length;
  const dailyQuests = quests.filter(q => q.category === 'daily').length;

  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={12} md={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Tổng số nhiệm vụ"
            value={totalQuests}
            prefix={<BarsOutlined className="text-imperialRed" />}
            valueStyle={{ color: '#8B0000' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Đang hoạt động"
            value={activeQuests}
            prefix={<CheckCircleOutlined className="text-green-600" />}
            valueStyle={{ color: '#2E8B57' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Vô hiệu hóa"
            value={inactiveQuests}
            prefix={<StopOutlined className="text-red-600" />}
            valueStyle={{ color: '#DC143C' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Nhiệm vụ hàng ngày"
            value={dailyQuests}
            prefix={<FireOutlined className="text-orange-500" />}
            valueStyle={{ color: '#FF8C00' }}
          />
        </Card>
      </Col>
    </Row>
  );
};
