'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Tooltip,
  Typography,
  Badge,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { BuildingWithRelations } from '../types/building.types';
import { useBuildings } from '../hooks/useBuildings';
import { useDeleteBuilding } from '../hooks/useBuildingMutations';
import BuildingForm from './BuildingForm';
import BuildingDetailModal from './BuildingDetailModal';

const { Title } = Typography;

const BuildingTable: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingWithRelations | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { data: buildings, isLoading } = useBuildings();
  const deleteBuilding = useDeleteBuilding();

  const handleEdit = (building: BuildingWithRelations) => {
    setSelectedBuilding(building);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleView = (building: BuildingWithRelations) => {
    setSelectedBuilding(building);
    setOpenDetail(true);
  };

  const handleDelete = async (type: string) => {
    await deleteBuilding.mutateAsync(type);
  };

  const columns: ColumnsType<BuildingWithRelations> = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <Tag color="volcano" icon={<ApartmentOutlined />}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Tên công trình',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record) => (
        <Space direction="vertical" size="small">
          <Typography.Text strong>{name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.type}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => desc || '—',
    },
    {
      title: 'Cấp tối đa',
      dataIndex: 'max_level',
      key: 'max_level',
      width: 120,
      align: 'center',
      render: (level: number) => (
        <Badge count={level} color="#8B0000" showZero />
      ),
    },
    {
      title: 'Chỉ số',
      key: 'stats',
      width: 200,
      render: (_, record) => {
        const stats = record.attribute_details?.[0];
        return (
          <Space size="small" wrap>
            {stats?.hit_points && (
              <Tooltip title="Máu">
                <Tag color="green">{stats.hit_points} HP</Tag>
              </Tooltip>
            )}
            {stats?.power_score && (
              <Tooltip title="Sức mạnh">
                <Tag color="gold">{stats.power_score} ⚔️</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa công trình"
            description="Bạn có chắc chắn muốn xóa công trình này?"
            onConfirm={() => handleDelete(record.type)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            background: '#F1E8D6',
            padding: '16px 24px',
            borderRadius: 12,
            border: '1px solid #D4AF37',
          }}
        >
          <Title level={3} style={{ margin: 0, color: '#8B4513' }}>
            Quản lý công trình
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedBuilding(null);
              setFormMode('create');
              setOpenForm(true);
            }}
            style={{
              background: '#8B0000',
              borderColor: '#D4AF37',
            }}
          >
            Thêm công trình
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={buildings}
          rowKey="type"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            total: buildings?.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} công trình`,
          }}
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #F1E8D6',
          }}
        />
      </Space>

      <BuildingForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        initialData={selectedBuilding}
        mode={formMode}
      />

      <BuildingDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        building={selectedBuilding}
      />
    </>
  );
};

export default BuildingTable;
