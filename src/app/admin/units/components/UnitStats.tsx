// app/admin/units/components/UnitStats.tsx
'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import {
  TeamOutlined,
  CrownOutlined,
  RiseOutlined,
  StarOutlined
} from '@ant-design/icons';
import theme from '@/theme/themeConfig';

interface UnitStatsProps {
  totalUnits: number;
  totalVipUnits: number;
  totalSpecialUnits: number;
  averageLevel: number;
  unitsByType: Record<string, number>;
}

const UnitStats: React.FC<UnitStatsProps> = ({
  totalUnits,
  totalVipUnits,
  totalSpecialUnits,
  averageLevel,
  unitsByType,
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card
          variant='borderless'
          style={{
            background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
            color: 'white',
            borderRadius: theme.token?.borderRadius,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Units</span>}
            value={totalUnits}
            prefix={<TeamOutlined />}
            valueStyle={{ color: 'white' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card
          variant='borderless'
          style={{
            background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
            color: 'white',
            borderRadius: theme.token?.borderRadius,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>VIP Units</span>}
            value={totalVipUnits}
            prefix={<CrownOutlined />}
            valueStyle={{ color: 'white' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card
          variant='borderless'
          style={{
            background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
            color: 'white',
            borderRadius: theme.token?.borderRadius,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Special Units</span>}
            value={totalSpecialUnits}
            prefix={<StarOutlined />}
            valueStyle={{ color: 'white' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card
          variant='borderless'
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            color: 'white',
            borderRadius: theme.token?.borderRadius,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Average Level</span>}
            value={averageLevel}
            prefix={<RiseOutlined />}
            precision={1}
            valueStyle={{ color: 'white' }}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card
          title="Units by Type"
          variant='borderless'
          style={{
            borderRadius: theme.token?.borderRadius,
            border: `1px solid ${theme.token?.colorBorder}`,
          }}
        >
          <Row gutter={[16, 16]}>
            {Object.entries(unitsByType).map(([type, count]) => (
              <Col key={type} xs={24} sm={12} md={8}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    <span>{count}</span>
                  </div>
                  <Progress
                    percent={Math.round((count / totalUnits) * 100)}
                    showInfo={false}
                    strokeColor={theme.token?.colorPrimary}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default UnitStats;
