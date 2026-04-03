// components/lootbox/tabs/LootBoxAnalyticsTab.tsx
import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { EyeOutlined, GiftOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LootBoxAnalyticsTabProps {
  lootBoxId: string;
}

export const LootBoxAnalyticsTab: React.FC<LootBoxAnalyticsTabProps> = ({
  lootBoxId,
}) => {
  return (
    <Card>
      <Title level={4}>Phân tích</Title>
      <Text type="secondary">Số liệu thống kê và phân tích sẽ được hiển thị tại đây</Text>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số lần mở"
              value={0}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Người chơi duy nhất"
              value={0}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Phần thưởng hiếm nhất"
              value="Chưa có"
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
