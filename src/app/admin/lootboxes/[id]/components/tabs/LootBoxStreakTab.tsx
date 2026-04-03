// components/lootbox/tabs/LootBoxStreakTab.tsx
import React from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Badge,
  Empty,
  Row,
  Col,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LootBoxStreakTabProps {
  rewardTables: any[];
  lootBoxId: string;
  onEditStreak: () => void;
}

export const LootBoxStreakTab: React.FC<LootBoxStreakTabProps> = ({
  rewardTables,
  lootBoxId,
  onEditStreak,
}) => {
  const streakTables = rewardTables?.filter(t => t.streak_bonus) || [];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>Thưởng chuỗi</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEditStreak}
          >
            Quản lý thưởng chuỗi
          </Button>
        </Col>
      </Row>

      {streakTables.length > 0 ? (
        <Table
          dataSource={streakTables}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Bảng thưởng',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Trạng thái',
              key: 'status',
              render: (_, record) => (
                <Badge
                  status={record.streak_bonus.enabled ? 'success' : 'default'}
                  text={record.streak_bonus.enabled ? 'Đã bật' : 'Đã tắt'}
                />
              ),
            },
            {
              title: 'Loại chuỗi',
              key: 'type',
              render: (_, record) => (
                <Tag color="geekblue">{record.streak_bonus.streak_type}</Tag>
              ),
            },
            {
              title: 'Cấp độ',
              key: 'tiers',
              render: (_, record) => (
                <Tag color="purple">{record.streak_bonus.tiers?.length || 0} cấp độ</Tag>
              ),
            },
          ]}
        />
      ) : (
        <Empty description="Chưa cấu hình thưởng chuỗi" />
      )}
    </Card>
  );
};
