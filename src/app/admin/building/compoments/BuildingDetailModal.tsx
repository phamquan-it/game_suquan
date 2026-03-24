'use client';

import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Table,
} from 'antd';
import {
  ApartmentOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  RocketOutlined,
  GoldOutlined,
} from '@ant-design/icons';
import { BuildingWithRelations } from '../types/building.types';
import { useUnits } from '../hooks/useUnits';
import { useResources } from '../hooks/useResources';

const { Title, Text } = Typography;

interface BuildingDetailModalProps {
  open: boolean;
  onClose: () => void;
  building: BuildingWithRelations | null;
}

const BuildingDetailModal: React.FC<BuildingDetailModalProps> = ({
  open,
  onClose,
  building,
}) => {
  const { data: units } = useUnits();
  const { data: resources } = useResources();

  if (!building) return null;

  const getUnitName = (unitType: string) => {
    return units?.find(u => u.id === unitType)?.name || unitType;
  };

  const getResourceName = (resourceCode: string) => {
    return resources?.find(r => r.resource_code === resourceCode)?.name || resourceCode;
  };

  const statsColumns = [
    {
      title: 'Cấp',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Máu',
      dataIndex: 'hit_points',
      key: 'hit_points',
    },
    {
      title: 'Sức mạnh',
      dataIndex: 'power_score',
      key: 'power_score',
    },
    {
      title: 'Sức chứa quân',
      dataIndex: 'troop_capacity',
      key: 'troop_capacity',
    },
    {
      title: 'Tốc độ huấn luyện',
      dataIndex: 'training_speed_percent',
      key: 'training_speed_percent',
      render: (val: number) => `${val}%`,
    },
  ];

  const productionColumns = [
    {
      title: 'Cấp',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Tài nguyên',
      dataIndex: 'resource_code',
      key: 'resource_code',
      render: (code: string) => (
        <Tag color="gold">{getResourceName(code)}</Tag>
      ),
    },
    {
      title: 'Tốc độ/giờ',
      dataIndex: 'production_rate_per_hour',
      key: 'production_rate_per_hour',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Sức chứa',
      dataIndex: 'production_capacity',
      key: 'production_capacity',
    },
    {
      title: 'Hiệu suất',
      dataIndex: 'efficiency_percent',
      key: 'efficiency_percent',
      render: (val: number) => `${val}%`,
    },
  ];

  const trainingColumns = [
    {
      title: 'Cấp',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit_type',
      key: 'unit_type',
      render: (type: string) => (
        <Tag color="blue">{getUnitName(type)}</Tag>
      ),
    },
    {
      title: 'Tốc độ/giờ',
      dataIndex: 'training_rate_per_hour',
      key: 'training_rate_per_hour',
    },
    {
      title: 'Sức chứa',
      dataIndex: 'training_capacity',
      key: 'training_capacity',
    },
    {
      title: 'Hiệu suất',
      dataIndex: 'efficiency_percent',
      key: 'efficiency_percent',
      render: (val: number) => `${val}%`,
    },
  ];

  const unlockColumns = [
    {
      title: 'Đơn vị',
      dataIndex: 'unit_type',
      key: 'unit_type',
      render: (type: string) => (
        <Tag color="purple">{getUnitName(type)}</Tag>
      ),
    },
    {
      title: 'Cấp độ yêu cầu',
      dataIndex: 'required_building_level',
      key: 'required_building_level',
    },
  ];

  const upgradeCostColumns = [
    {
      title: 'Từ cấp',
      dataIndex: 'current_level',
      key: 'current_level',
    },
    {
      title: 'Đến cấp',
      dataIndex: 'target_level',
      key: 'target_level',
    },
    {
      title: 'Tài nguyên',
      dataIndex: 'resource_code',
      key: 'resource_code',
      render: (code: string) => (
        <Tag color="green">{getResourceName(code)}</Tag>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'resource_amount',
      key: 'resource_amount',
      render: (val: number) => val.toLocaleString(),
    },
  ];

  const items = [
    {
      key: 'stats',
      label: 'Chỉ số theo cấp',
      children: (
        <Table
          columns={statsColumns}
          dataSource={building.attribute_details}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: 'production',
      label: 'Sản xuất',
      children: (
        <Table
          columns={productionColumns}
          dataSource={building.production}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: 'training',
      label: 'Huấn luyện',
      children: (
        <Table
          columns={trainingColumns}
          dataSource={building.unit_training}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: 'unlock',
      label: 'Mở khóa',
      children: (
        <Table
          columns={unlockColumns}
          dataSource={building.unlock_rules}
          rowKey="unit_type"
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: 'upgrade',
      label: 'Chi phí nâng cấp',
      children: (
        <Table
          columns={upgradeCostColumns}
          dataSource={building.upgrade_costs}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <ApartmentOutlined style={{ color: '#8B0000' }} />
          <Title level={4} style={{ margin: 0, color: '#8B4513' }}>
            {building.name}
          </Title>
          <Tag color="volcano">{building.type}</Tag>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
    >
      <Descriptions bordered size="small" style={{ marginBottom: 20 }}>
        <Descriptions.Item label="Mô tả" span={3}>
          {building.description || 'Không có mô tả'}
        </Descriptions.Item>
        <Descriptions.Item label="Cấp tối đa">
          <Tag color="gold">{building.max_level}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(building.created_at || '').toLocaleDateString('vi-VN')}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật lần cuối">
          {new Date(building.updated_at || '').toLocaleDateString('vi-VN')}
        </Descriptions.Item>
      </Descriptions>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số cấp"
              value={building.attribute_details?.length || 0}
              suffix={`/${building.max_level}`}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sản xuất"
              value={building.production?.length || 0}
              suffix="loại"
              prefix={<GoldOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Huấn luyện"
              value={building.unit_training?.length || 0}
              suffix="đơn vị"
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Mở khóa"
              value={building.unlock_rules?.length || 0}
              suffix="đơn vị"
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs items={items} type="card" />
    </Modal>
  );
};

export default BuildingDetailModal;
