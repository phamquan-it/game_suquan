// components/lootbox/tabs/LootBoxFirstTimeTab.tsx
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

interface LootBoxFirstTimeTabProps {
  rewardTables: any[];
  lootBoxId: string;
  onEditFirstTime: () => void;
}

export const LootBoxFirstTimeTab: React.FC<LootBoxFirstTimeTabProps> = ({
  rewardTables,
  lootBoxId,
  onEditFirstTime,
}) => {
  const firstTimeTables = rewardTables?.filter(t => t.first_time_bonus) || [];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>Thưởng lần đầu</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEditFirstTime}
          >
            Quản lý thưởng lần đầu
          </Button>
        </Col>
      </Row>

      {firstTimeTables.length > 0 ? (
        <Table
          dataSource={firstTimeTables}
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
                  status={record.first_time_bonus.enabled ? 'success' : 'default'}
                  text={record.first_time_bonus.enabled ? 'Đã bật' : 'Đã tắt'}
                />
              ),
            },
            {
              title: 'Hệ số nhân',
              key: 'multiplier',
              render: (_, record) => (
                <Tag color="green">{record.first_time_bonus.multiplier}x</Tag>
              ),
            },
            {
              title: 'Phần thưởng',
              key: 'rewards',
              render: (_, record) => (
                <Tag color="blue">{record.first_time_bonus.rewards?.length || 0} phần thưởng</Tag>
              ),
            },
          ]}
        />
      ) : (
        <Empty description="Chưa cấu hình thưởng lần đầu" />
      )}
    </Card>
  );
};
