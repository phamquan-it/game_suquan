// components/lootbox/tabs/LootBoxRewardsTab.tsx
import React from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Empty,
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LootBoxGuaranteedReward, LootBoxRewardItem } from '../../hooks/useLootBoxGuaranteedDrops';
import { LootBoxRewardTable } from '../../../types';

const { Title, Text } = Typography;

interface LootBoxRewardsTabProps {
  rewardTables: LootBoxRewardTable[];
  lootBoxId: string;
  onAddRewardTable: () => void;
}

export const LootBoxRewardsTab: React.FC<LootBoxRewardsTabProps> = ({
  rewardTables,
  lootBoxId,
  onAddRewardTable,
}) => {
  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>Bảng thưởng</Title>
          <Text type="secondary">
            Đã cấu hình {rewardTables?.length || 0} bảng thưởng
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddRewardTable}
          >
            Thêm bảng thưởng
          </Button>
        </Col>
      </Row>

      {rewardTables && rewardTables.length > 0 ? (
        <Table
          dataSource={rewardTables}
          rowKey="id"
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ paddingLeft: 24 }}>
                <Title level={5}>Danh sách nhóm</Title>
                {record.pools && record.pools.length > 0 ? (
                  <Table
                    dataSource={record.pools}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    columns={[
                      {
                        title: 'Tên nhóm',
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: 'Trọng số',
                        dataIndex: 'weight',
                        key: 'weight',
                        render: (weight) => <Tag color="purple">{weight}</Tag>,
                      },
                      {
                        title: 'Số lượng phần thưởng',
                        key: 'drops',
                        render: (_, pool) => (
                          <Text>{pool.min_drops} - {pool.max_drops}</Text>
                        ),
                      },
                      {
                        title: 'Vật phẩm',
                        key: 'items',
                        render: (_, pool) => (
                          <Tag color="blue">{pool?.items?.length ?? 0} vật phẩm</Tag>
                        ),
                      },
                      {
                        title: 'Đảm bảo',
                        dataIndex: 'guaranteed',
                        key: 'guaranteed',
                        render: (guaranteed) => (
                          <Tag color={guaranteed ? 'success' : 'default'}>
                            {guaranteed ? 'Có' : 'Không'}
                          </Tag>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <Text type="secondary">Chưa cấu hình nhóm</Text>
                )}
              </div>
            ),
          }}
          columns={[
            {
              title: 'Tên',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <Space direction="vertical" size="small">
                  <Text strong>{text}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.id}</Text>
                </Space>
              ),
            },
            {
              title: 'Kiểu phân phối',
              dataIndex: 'distribution_type',
              key: 'distribution_type',
              render: (type) => <Tag color="blue">{type}</Tag>,
            },
            {
              title: 'Chống trùng lặp',
              dataIndex: 'anti_duplicate',
              key: 'anti_duplicate',
              render: (value) => (
                <Tag color={value ? 'success' : 'default'}>
                  {value ? 'Đã bật' : 'Đã tắt'}
                </Tag>
              ),
            },
            {
              title: 'Nhóm',
              key: 'pools',
              render: (_, record) => (
                <Tag color="geekblue">{record.pools?.length || 0} nhóm</Tag>
              ),
            },
          ]}
        />
      ) : (
        <Empty description="Chưa cấu hình bảng thưởng" />
      )}
    </Card>
  );
};
